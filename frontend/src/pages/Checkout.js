import { useState, useEffect } from 'react';
import { axiosInstance } from '../App';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

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

  const calculateTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error('Por favor, preencha o endereço de entrega');
      return;
    }

    setProcessing(true);

    try {
      const total = calculateTotal();
      const orderData = {
        address,
        items: cart.items,
        total,
      };

      const orderResponse = await axiosInstance.post('/orders', orderData);
      
      toast.success('Pedido criado com sucesso! Processando pagamento...');
      
      setTimeout(() => {
        setOrderComplete(true);
        toast.success('Pagamento confirmado!');
      }, 2000);
    } catch (error) {
      toast.error('Erro ao processar pedido');
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center glassmorphism rounded-3xl p-12 max-w-md" data-testid="order-success">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Pedido Confirmado!</h2>
          <p className="text-gray-600 mb-6">
            Seu pedido foi realizado com sucesso. Em breve você receberá um email de confirmação.
          </p>
          <button
            onClick={() => navigate('/my-orders')}
            data-testid="view-orders-button"
            className="btn-primary mb-3 w-full"
          >
            Ver Meus Pedidos
          </button>
          <button
            onClick={() => navigate('/shop')}
            data-testid="continue-shopping-success"
            className="glassmorphism px-6 py-3 rounded-full font-medium text-gray-700 hover:scale-105 transition w-full"
          >
            Continuar Comprando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="checkout-title">Finalizar Compra</h1>

        <div className="grid gap-8">
          <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Endereço de Entrega</h2>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              data-testid="address-input"
              className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows="4"
              placeholder="Rua, número, bairro, cidade, estado, CEP"
            />
          </div>

          <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Resumo do Pedido</h2>
            <div className="space-y-3">
              {cart.items.map((item, index) => (
                <div key={index} className="flex justify-between text-gray-600" data-testid={`checkout-item-${index}`}>
                  <span>
                    {item.product_name} (x{item.quantity})
                  </span>
                  <span>R$ {(item.product_price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-3 flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span data-testid="checkout-total">R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glassmorphism rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Método de Pagamento</h2>
            <p className="text-gray-600 mb-4">PayPal - Pagamento seguro e rápido</p>
            
            <button
              onClick={handleCheckout}
              disabled={processing}
              data-testid="confirm-order-button"
              className="btn-primary w-full py-4 text-lg disabled:opacity-50"
            >
              {processing ? 'Processando...' : 'Confirmar Pedido'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
