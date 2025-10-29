import { useState, useEffect } from 'react';
import { axiosInstance } from '../App';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await axiosInstance.get('/cart');
      setCart(response.data);
    } catch (error) {
      toast.error('Erro ao carregar carrinho');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId, size, color) => {
    try {
      await axiosInstance.delete(`/cart/${productId}?size=${size}&color=${color}`);
      toast.success('Item removido do carrinho');
      loadCart();
    } catch (error) {
      toast.error('Erro ao remover item');
    }
  };

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" data-testid="empty-cart">
        <ShoppingBag className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
        <p className="text-gray-600 mb-6">Adicione produtos para começar a comprar</p>
        <button onClick={() => navigate('/shop')} className="btn-primary" data-testid="continue-shopping-empty">
          Continuar Comprando
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="cart-title">Meu Carrinho</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item, index) => (
              <div key={index} className="glassmorphism rounded-2xl p-6 flex gap-4" data-testid={`cart-item-${index}`}>
                <img
                  src={item.product_image}
                  alt={item.product_name}
                  className="w-24 h-24 object-cover rounded-xl"
                  data-testid={`cart-item-image-${index}`}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1" data-testid={`cart-item-name-${index}`}>
                    {item.product_name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Tamanho: {item.size} | Cor: {item.color}
                  </p>
                  <p className="text-lg font-bold text-pink-600" data-testid={`cart-item-price-${index}`}>
                    R$ {item.product_price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemoveItem(item.product_id, item.size, item.color)}
                    data-testid={`remove-item-${index}`}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium" data-testid={`cart-item-quantity-${index}`}>
                      Qtd: {item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="glassmorphism rounded-2xl p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span data-testid="cart-subtotal">R$ {calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Frete</span>
                  <span className="text-green-600 font-medium">Grátis</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                  <span>Total</span>
                  <span data-testid="cart-total">R$ {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                data-testid="proceed-to-checkout"
                className="btn-primary w-full py-3 text-lg mb-3"
              >
                Finalizar Compra
              </button>
              
              <button
                onClick={() => navigate('/shop')}
                data-testid="continue-shopping"
                className="glassmorphism w-full py-3 rounded-full font-medium text-gray-700 hover:scale-105 transition"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
