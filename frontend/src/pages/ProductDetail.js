import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../App';
import { ShoppingCart, Heart, Truck, Shield } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      setProduct(response.data);
      setSelectedSize(response.data.sizes[0]);
      setSelectedColor(response.data.colors[0]);
    } catch (error) {
      toast.error('Erro ao carregar produto');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Faça login para adicionar ao carrinho');
      navigate('/auth');
      return;
    }

    try {
      await axiosInstance.post('/cart', {
        product_id: product.id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        product_name: product.name,
        product_price: product.price,
        product_image: product.image_url,
      });
      toast.success('Produto adicionado ao carrinho!');
    } catch (error) {
      toast.error('Erro ao adicionar ao carrinho');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Produto não encontrado</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="glassmorphism rounded-3xl overflow-hidden" data-testid="product-image-container">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="product-detail-image"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="product-detail-name">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-pink-600" data-testid="product-detail-price">
                R$ {product.price.toFixed(2)}
              </p>
            </div>

            <p className="text-gray-600 text-lg" data-testid="product-detail-description">{product.description}</p>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tamanho</label>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    data-testid={`size-${size}`}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'glassmorphism text-gray-700 hover:scale-105'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cor</label>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    data-testid={`color-${color}`}
                    className={`px-6 py-2 rounded-full font-medium transition ${
                      selectedColor === color
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'glassmorphism text-gray-700 hover:scale-105'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantidade</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="decrease-quantity"
                  className="glassmorphism w-10 h-10 rounded-full font-bold hover:scale-105 transition"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-12 text-center" data-testid="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="increase-quantity"
                  className="glassmorphism w-10 h-10 rounded-full font-bold hover:scale-105 transition"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              data-testid="add-to-cart-button"
              className="btn-primary w-full py-4 text-lg flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Adicionar ao Carrinho</span>
            </button>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                <p className="text-xs text-gray-600">Frete Grátis</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                <p className="text-xs text-gray-600">Compra Segura</p>
              </div>
              <div className="text-center">
                <Heart className="w-6 h-6 mx-auto mb-2 text-pink-500" />
                <p className="text-xs text-gray-600">Qualidade Premium</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
