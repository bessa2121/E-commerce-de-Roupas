import { useState } from 'react';
import { axiosInstance } from '../App';
import { Handshake, Send, Mail, Building, User } from 'lucide-react';
import { toast } from 'sonner';

const Partnership = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/partnerships', formData);
      toast.success('Solicitação enviada com sucesso!');
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      toast.error('Erro ao enviar solicitação');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 mb-4">
            <Handshake className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="partnership-title">
            Parcerias Comerciais
          </h1>
          <p className="text-lg text-gray-600">
            Junte-se a nós e faça parte da família Femme Style. Vamos crescer juntos!
          </p>
        </div>

        {submitted && (
          <div className="glassmorphism rounded-2xl p-6 mb-8 bg-green-50 border-green-200" data-testid="success-message">
            <p className="text-green-800 font-medium text-center">
              Obrigada pelo interesse! Entraremos em contato em breve.
            </p>
          </div>
        )}

        <div className="glassmorphism rounded-3xl p-8">
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Por que fazer parceria conosco?</h2>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-pink-600 font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Visibilidade de Marca</h3>
                    <p className="text-sm text-gray-600">
                      Alcance milhares de clientes fieis e apaixonados por moda
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Colaborações Exclusivas</h3>
                    <p className="text-sm text-gray-600">
                      Crie coleções especiais e campanhas personalizadas
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Suporte Dedicado</h3>
                    <p className="text-sm text-gray-600">
                      Equipe especializada para auxiliar em todas as etapas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    data-testid="partnership-name-input"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Seu nome"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="partnership-email-input"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    data-testid="partnership-company-input"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Nome da empresa"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  data-testid="partnership-message-input"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                  placeholder="Conte-nos sobre sua proposta de parceria..."
                  required
                />
              </div>

              <button
                type="submit"
                data-testid="partnership-submit-button"
                className="btn-primary w-full py-3 text-lg flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>Enviar Proposta</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnership;
