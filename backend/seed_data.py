import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_products():
    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Vestido Floral Verão",
            "description": "Vestido leve e elegante com estampa floral, perfeito para dias quentes",
            "price": 129.90,
            "category": "vestidos",
            "sizes": ["P", "M", "G", "GG"],
            "colors": ["Rosa", "Azul", "Branco"],
            "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
            "stock": 15
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Blusa Renda Premium",
            "description": "Blusa sofisticada com detalhes em renda francesa",
            "price": 89.90,
            "category": "blusas",
            "sizes": ["P", "M", "G"],
            "colors": ["Branco", "Preto", "Nude"],
            "image_url": "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400",
            "stock": 20
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Calça Alfaiataria",
            "description": "Calça de alfaiataria moderna com caimento perfeito",
            "price": 159.90,
            "category": "calcas",
            "sizes": ["36", "38", "40", "42"],
            "colors": ["Preto", "Cinza", "Bege"],
            "image_url": "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400",
            "stock": 12
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Conjunto Esportivo",
            "description": "Top e legging para prática de yoga e fitness",
            "price": 149.90,
            "category": "esportivo",
            "sizes": ["P", "M", "G"],
            "colors": ["Rosa", "Roxo", "Preto"],
            "image_url": "https://images.unsplash.com/photo-1518644961665-ed172691aaa1?w=400",
            "stock": 18
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Saia Midi Plissada",
            "description": "Saia midi plissada elegante para ocasiões especiais",
            "price": 119.90,
            "category": "saias",
            "sizes": ["P", "M", "G", "GG"],
            "colors": ["Preto", "Vinho", "Azul Marinho"],
            "image_url": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400",
            "stock": 14
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Casaco Oversized",
            "description": "Casaco oversized confortável e estiloso",
            "price": 199.90,
            "category": "casacos",
            "sizes": ["Único"],
            "colors": ["Bege", "Caramelo", "Preto"],
            "image_url": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400",
            "stock": 10
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Body Decote V",
            "description": "Body básico com decote V, essencial no guarda-roupa",
            "price": 69.90,
            "category": "bodies",
            "sizes": ["P", "M", "G"],
            "colors": ["Preto", "Branco", "Nude"],
            "image_url": "https://images.unsplash.com/photo-1582142306909-195724d33e9b?w=400",
            "stock": 25
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Jeans Skinny Premium",
            "description": "Calça jeans skinny de qualidade premium com elasticidade",
            "price": 179.90,
            "category": "calcas",
            "sizes": ["36", "38", "40", "42", "44"],
            "colors": ["Azul Escuro", "Azul Claro", "Preto"],
            "image_url": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
            "stock": 16
        }
    ]
    
    await db.products.delete_many({})
    await db.products.insert_many(products)
    print(f"✅ {len(products)} produtos adicionados")

async def seed_models():
    models = [
        {
            "id": str(uuid.uuid4()),
            "name": "Isabella Rodrigues",
            "bio": "Modelo profissional com 8 anos de experiência em desfiles e campanhas publicitárias. Especializada em moda feminina e editorial.",
            "hourly_rate": 250.00,
            "portfolio_images": [
                "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400"
            ],
            "availability": ["Segunda", "Terça", "Quarta", "Quinta"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Mariana Santos",
            "bio": "Modelo e influenciadora digital focada em moda sustentável e lifestyle. Trabalha com marcas nacionais e internacionais.",
            "hourly_rate": 300.00,
            "portfolio_images": [
                "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
                "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400",
                "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=400"
            ],
            "availability": ["Terça", "Quinta", "Sexta", "Sábado"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Julia Mendes",
            "bio": "Especialista em campanhas de e-commerce e lookbooks. Experiência em fotos de produto e vídeos promocionais.",
            "hourly_rate": 200.00,
            "portfolio_images": [
                "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
            ],
            "availability": ["Segunda", "Quarta", "Sexta"]
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Sofia Lima",
            "bio": "Modelo fitness e lifestyle com foco em roupas esportivas e casuais. Portfólio diversificado e atitude positiva.",
            "hourly_rate": 220.00,
            "portfolio_images": [
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
                "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400"
            ],
            "availability": ["Segunda", "Terça", "Quinta", "Sábado"]
        }
    ]
    
    await db.models.delete_many({})
    await db.models.insert_many(models)
    print(f"✅ {len(models)} modelos adicionadas")

async def main():
    print("🌱 Iniciando seed do banco de dados...")
    await seed_products()
    await seed_models()
    print("✅ Seed completo!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
