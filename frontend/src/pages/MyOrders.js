import { useState, useEffect } from 'react';
import { axiosInstance } from '../App';
import { Package, CheckCircle, Clock, Truck } from 'lucide-react';
import { toast } from 'sonner';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axiosInstance.get('/orders');
      setOrders(response.data);
    } catch (error) {
      toast.error('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Entregue';
      case 'shipped':
        return 'Em trânsito';
      default:
        return 'Processando';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" data-testid="no-orders">
        <Package className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhum pedido encontrado</h2>
        <p className="text-gray-600">Você ainda não fez nenhum pedido</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="orders-title">Meus Pedidos</h1>

        <div className="space-y-6">
          {orders.map((order, index) => (
            <div key={order.id} className="glassmorphism rounded-2xl p-6" data-testid={`order-${index}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1" data-testid={`order-id-${index}`}>
                    Pedido #{order.id.slice(0, 8)}
                  </h3>
                  <p className="text-sm text-gray-600" data-testid={`order-date-${index}`}>
                    {new Date(order.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex items-center gap-2" data-testid={`order-status-${index}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-medium text-gray-700">{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Itens do Pedido</h4>
                <div className="space-y-3">
                  {order.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex gap-4" data-testid={`order-item-${index}-${itemIndex}`}>
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{item.product_name}</h5>
                        <p className="text-sm text-gray-600">
                          Tamanho: {item.size} | Cor: {item.color} | Qtd: {item.quantity}
                        </p>
                      </div>
                      <p className="font-semibold text-pink-600">
                        R$ {(item.product_price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Endereço de entrega:</p>
                    <p className="text-gray-800" data-testid={`order-address-${index}`}>{order.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-pink-600" data-testid={`order-total-${index}`}>
                      R$ {order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
