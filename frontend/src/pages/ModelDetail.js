import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../App';
import { Calendar, Clock, DollarSign, Send } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

const ModelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [duration, setDuration] = useState(2);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');

  useEffect(() => {
    loadModel();
  }, [id]);

  const loadModel = async () => {
    try {
      const response = await axiosInstance.get(`/models/${id}`);
      setModel(response.data);
      setBudget((response.data.hourly_rate * 2).toString());
    } catch (error) {
      toast.error('Erro ao carregar modelo');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.error('Por favor, selecione uma data');
      return;
    }
    if (!message.trim()) {
      toast.error('Por favor, descreva o projeto');
      return;
    }

    try {
      await axiosInstance.post('/bookings', {
        model_id: model.id,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        duration: parseInt(duration),
        message,
        budget: parseFloat(budget),
      });
      toast.success('Reserva solicitada com sucesso!');
      navigate('/my-bookings');
    } catch (error) {
      toast.error('Erro ao criar reserva');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!model) {
    return <div className="min-h-screen flex items-center justify-center">Modelo não encontrada</div>;
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="glassmorphism rounded-3xl overflow-hidden aspect-[3/4]" data-testid="model-main-image">
              <img
                src={model.portfolio_images[0]}
                alt={model.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {model.portfolio_images.slice(1).map((img, index) => (
                <div key={index} className="glassmorphism rounded-xl overflow-hidden aspect-square" data-testid={`portfolio-image-${index}`}>
                  <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2" data-testid="model-detail-name">{model.name}</h1>
              <div className="flex items-center text-2xl font-bold text-pink-600 mb-4">
                <DollarSign className="w-6 h-6" />
                <span data-testid="model-detail-rate">R$ {model.hourly_rate}/hora</span>
              </div>
            </div>

            <div className="glassmorphism p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-2">Sobre</h3>
              <p className="text-gray-600" data-testid="model-detail-bio">{model.bio}</p>
            </div>

            <div className="glassmorphism p-6 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-3">Disponibilidade</h3>
              <div className="flex flex-wrap gap-2">
                {model.availability.map((day) => (
                  <span key={day} className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-sm font-medium text-gray-700" data-testid={`availability-${day}`}>
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glassmorphism rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6" data-testid="booking-form-title">Solicitar Reserva</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    data-testid="date-picker-trigger"
                    className="w-full glassmorphism px-4 py-3 rounded-xl text-left flex items-center justify-between hover:scale-105 transition"
                  >
                    <span>{selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecione uma data'}</span>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    data-testid="date-picker-calendar"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                data-testid="time-select"
                className="w-full glassmorphism px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duração (horas)</label>
              <input
                type="number"
                min="1"
                max="8"
                value={duration}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  setDuration(val);
                  setBudget((model.hourly_rate * val).toString());
                }}
                data-testid="duration-input"
                className="w-full glassmorphism px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Orçamento (R$)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                data-testid="budget-input"
                className="w-full glassmorphism px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descreva seu projeto</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              data-testid="message-textarea"
              className="w-full glassmorphism px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows="4"
              placeholder="Conte-nos sobre seu evento, campanha ou projeto..."
            />
          </div>

          <button
            onClick={handleBooking}
            data-testid="submit-booking-button"
            className="btn-primary w-full mt-6 py-4 text-lg flex items-center justify-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Solicitar Reserva</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelDetail;
