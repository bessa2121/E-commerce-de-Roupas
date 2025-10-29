from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
import jwt
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

SECRET_KEY = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440

# PayPal Config
paypal_client_id = os.environ.get('PAYPAL_CLIENT_ID', '')
paypal_secret = os.environ.get('PAYPAL_SECRET', '')

if paypal_client_id and paypal_secret:
    environment = SandboxEnvironment(client_id=paypal_client_id, client_secret=paypal_secret)
    paypal_client = PayPalHttpClient(environment)
else:
    paypal_client = None

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "customer"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    price: float
    category: str
    sizes: List[str]
    colors: List[str]
    image_url: str
    stock: int = 10

class CartItem(BaseModel):
    product_id: str
    quantity: int
    size: str
    color: str
    product_name: str
    product_price: float
    product_image: str

class Cart(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[CartItem] = []
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Order(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    items: List[CartItem]
    total: float
    status: str = "pending"
    paypal_order_id: Optional[str] = None
    address: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class OrderCreate(BaseModel):
    address: str
    items: List[CartItem]
    total: float

class Model(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    bio: str
    hourly_rate: float
    portfolio_images: List[str]
    availability: List[str] = []

class ModelBooking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    model_id: str
    date: str
    time: str
    duration: int
    status: str = "pending"
    message: str
    budget: float
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ModelBookingCreate(BaseModel):
    model_id: str
    date: str
    time: str
    duration: int
    message: str
    budget: float

class Partnership(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    company: str
    message: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PartnershipCreate(BaseModel):
    name: str
    email: EmailStr
    company: str
    message: str

class PayPalOrderRequest(BaseModel):
    amount: float
    order_id: str

# Auth helpers
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# Auth routes
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user = User(email=user_data.email, name=user_data.name)
    
    doc = user.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['password'] = hashed_password
    
    await db.users.insert_one(doc)
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user_doc = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if not user_doc or not verify_password(user_data.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user = User(**{k: v for k, v in user_doc.items() if k != 'password'})
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Product routes
@api_router.get("/products", response_model=List[Product])
async def get_products(category: Optional[str] = None):
    query = {"category": category} if category else {}
    products = await db.products.find(query, {"_id": 0}).to_list(1000)
    return products

@api_router.get("/products/{product_id}", response_model=Product)
async def get_product(product_id: str):
    product = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Cart routes
@api_router.get("/cart", response_model=Cart)
async def get_cart(current_user: User = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user.id}, {"_id": 0})
    if not cart:
        cart = Cart(user_id=current_user.id).model_dump()
        cart['updated_at'] = cart['updated_at'].isoformat()
        await db.carts.insert_one(cart)
    else:
        if isinstance(cart['updated_at'], str):
            cart['updated_at'] = datetime.fromisoformat(cart['updated_at'])
    return Cart(**cart)

@api_router.post("/cart", response_model=Cart)
async def add_to_cart(item: CartItem, current_user: User = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user.id}, {"_id": 0})
    
    if not cart:
        cart = Cart(user_id=current_user.id, items=[item])
    else:
        if isinstance(cart['updated_at'], str):
            cart['updated_at'] = datetime.fromisoformat(cart['updated_at'])
        cart_obj = Cart(**cart)
        
        found = False
        for existing_item in cart_obj.items:
            if (existing_item.product_id == item.product_id and 
                existing_item.size == item.size and 
                existing_item.color == item.color):
                existing_item.quantity += item.quantity
                found = True
                break
        
        if not found:
            cart_obj.items.append(item)
        
        cart = cart_obj
    
    cart.updated_at = datetime.now(timezone.utc)
    doc = cart.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.carts.replace_one({"user_id": current_user.id}, doc, upsert=True)
    return cart

@api_router.delete("/cart/{product_id}")
async def remove_from_cart(product_id: str, size: str, color: str, current_user: User = Depends(get_current_user)):
    cart = await db.carts.find_one({"user_id": current_user.id}, {"_id": 0})
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    if isinstance(cart['updated_at'], str):
        cart['updated_at'] = datetime.fromisoformat(cart['updated_at'])
    cart_obj = Cart(**cart)
    
    cart_obj.items = [item for item in cart_obj.items 
                      if not (item.product_id == product_id and 
                             item.size == size and 
                             item.color == color)]
    
    cart_obj.updated_at = datetime.now(timezone.utc)
    doc = cart_obj.model_dump()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.carts.replace_one({"user_id": current_user.id}, doc)
    return {"message": "Item removed"}

@api_router.delete("/cart")
async def clear_cart(current_user: User = Depends(get_current_user)):
    await db.carts.delete_one({"user_id": current_user.id})
    return {"message": "Cart cleared"}

# Order routes
@api_router.post("/orders", response_model=Order)
async def create_order(order_data: OrderCreate, current_user: User = Depends(get_current_user)):
    order = Order(
        user_id=current_user.id,
        items=order_data.items,
        total=order_data.total,
        address=order_data.address
    )
    
    doc = order.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.orders.insert_one(doc)
    await db.carts.delete_one({"user_id": current_user.id})
    
    return order

@api_router.get("/orders", response_model=List[Order])
async def get_orders(current_user: User = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    for order in orders:
        if isinstance(order['created_at'], str):
            order['created_at'] = datetime.fromisoformat(order['created_at'])
    return orders

# PayPal routes
@api_router.post("/paypal/create-order")
async def create_paypal_order(request: PayPalOrderRequest):
    if not paypal_client:
        raise HTTPException(status_code=503, detail="PayPal not configured")
    
    request_obj = OrdersCreateRequest()
    request_obj.prefer('return=representation')
    request_obj.request_body({
        "intent": "CAPTURE",
        "purchase_units": [{
            "reference_id": request.order_id,
            "amount": {
                "currency_code": "USD",
                "value": f"{request.amount:.2f}"
            }
        }]
    })
    
    try:
        response = paypal_client.execute(request_obj)
        return {"id": response.result.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/paypal/capture-order/{order_id}")
async def capture_paypal_order(order_id: str, current_user: User = Depends(get_current_user)):
    if not paypal_client:
        raise HTTPException(status_code=503, detail="PayPal not configured")
    
    request_obj = OrdersCaptureRequest(order_id)
    
    try:
        response = paypal_client.execute(request_obj)
        
        reference_id = response.result.purchase_units[0].reference_id
        await db.orders.update_one(
            {"id": reference_id, "user_id": current_user.id},
            {"$set": {"status": "completed", "paypal_order_id": order_id}}
        )
        
        return {"status": "success", "order_id": reference_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Model routes
@api_router.get("/models", response_model=List[Model])
async def get_models():
    models = await db.models.find({}, {"_id": 0}).to_list(1000)
    return models

@api_router.get("/models/{model_id}", response_model=Model)
async def get_model(model_id: str):
    model = await db.models.find_one({"id": model_id}, {"_id": 0})
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model

# Model Booking routes
@api_router.post("/bookings", response_model=ModelBooking)
async def create_booking(booking_data: ModelBookingCreate, current_user: User = Depends(get_current_user)):
    booking = ModelBooking(
        user_id=current_user.id,
        model_id=booking_data.model_id,
        date=booking_data.date,
        time=booking_data.time,
        duration=booking_data.duration,
        message=booking_data.message,
        budget=booking_data.budget
    )
    
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    return booking

@api_router.get("/bookings", response_model=List[ModelBooking])
async def get_bookings(current_user: User = Depends(get_current_user)):
    bookings = await db.bookings.find({"user_id": current_user.id}, {"_id": 0}).to_list(1000)
    for booking in bookings:
        if isinstance(booking['created_at'], str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    return bookings

# Partnership routes
@api_router.post("/partnerships", response_model=Partnership)
async def create_partnership(partnership_data: PartnershipCreate):
    partnership = Partnership(
        name=partnership_data.name,
        email=partnership_data.email,
        company=partnership_data.company,
        message=partnership_data.message
    )
    
    doc = partnership.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.partnerships.insert_one(doc)
    return partnership

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()