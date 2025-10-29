import { useState, useEffect } from 'react';
import { axiosInstance } from '../App';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await axiosInstance.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      toast.error('Erro ao carregar reservas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" data-testid="no-bookings">
        <Calendar className="w-20 h-20 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Nenhuma reserva encontrada</h2>
        <p className="text-gray-600">Você ainda não fez nenhuma reserva de modelo</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8" data-testid="bookings-title">Minhas Reservas</h1>

        <div className="space-y-4">
          {bookings.map((booking, index) => (
            <div key={booking.id} className="glassmorphism rounded-2xl p-6" data-testid={`booking-${index}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1" data-testid={`booking-model-${index}`}>
                    Modelo ID: {booking.model_id}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span data-testid={`booking-date-${index}`}>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span data-testid={`booking-time-${index}`}>{booking.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-testid={`booking-status-${index}`}>
                  {getStatusIcon(booking.status)}
                  <span className="font-medium text-gray-700">{getStatusText(booking.status)}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duração:</span>
                  <span className="ml-2 font-medium text-gray-800" data-testid={`booking-duration-${index}`}>
                    {booking.duration}h
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Orçamento:</span>
                  <span className="ml-2 font-medium text-pink-600" data-testid={`booking-budget-${index}`}>
                    R$ {booking.budget.toFixed(2)}
                  </span>
                </div>
              </div>

              {booking.message && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600" data-testid={`booking-message-${index}`}>{booking.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
