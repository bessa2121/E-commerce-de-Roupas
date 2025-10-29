import { useState, useEffect } from 'react';
import { axiosInstance } from '../App';
import { Link } from 'react-router-dom';
import { Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const Models = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const response = await axiosInstance.get('/models');
      setModels(response.data);
    } catch (error) {
      toast.error('Erro ao carregar modelos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="models-title">
            Nossas Modelos
          </h1>
          <p className="text-lg text-gray-600">
            Profissionais experientes prontas para dar vida à sua marca
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">Carregando modelos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {models.map((model) => (
              <Link key={model.id} to={`/model/${model.id}`} data-testid={`model-card-${model.id}`}>
                <div className="product-card glassmorphism rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={model.portfolio_images[0]}
                      alt={model.name}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                      data-testid={`model-image-${model.id}`}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 text-lg" data-testid={`model-name-${model.id}`}>
                      {model.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{model.bio}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-pink-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-bold" data-testid={`model-rate-${model.id}`}>
                          R$ {model.hourly_rate}/h
                        </span>
                      </div>
                      <Calendar className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;
