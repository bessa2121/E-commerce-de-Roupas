import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Package } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="hero-gradient min-h-[90vh] flex items-center justify-center px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 glassmorphism rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">Nova Coleção 2025</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6" data-testid="hero-title">
            Elegância e Estilo
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Para Mulheres Modernas
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Descubra roupas exclusivas que realçam sua beleza natural. Contrate nossas modelos para eventos corporativos.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop" data-testid="explore-collection-button">
              <button className="btn-primary flex items-center justify-center space-x-2">
                <span>Explorar Coleção</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/models" data-testid="view-models-button">
              <button className="glassmorphism px-8 py-3 rounded-full font-medium text-gray-700 hover:scale-105 transition">
                Ver Modelos
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Por Que Escolher a Femme Style?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glassmorphism p-8 rounded-3xl text-center hover:scale-105 transition" data-testid="feature-quality">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 flex items-center justify-center">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Qualidade Premium</h3>
              <p className="text-gray-600">Peças selecionadas com tecidos de alta qualidade e acabamento impecável</p>
            </div>
            
            <div className="glassmorphism p-8 rounded-3xl text-center hover:scale-105 transition" data-testid="feature-models">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Modelos Profissionais</h3>
              <p className="text-gray-600">Contrate nossas modelos para campanhas, desfiles e eventos corporativos</p>
            </div>
            
            <div className="glassmorphism p-8 rounded-3xl text-center hover:scale-105 transition" data-testid="feature-partnership">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Parcerias Comerciais</h3>
              <p className="text-gray-600">Oportunidades de colaboração para empresas e marcas de moda</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 hero-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Pronta para Transformar seu Estilo?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Junte-se a milhares de mulheres que já escolheram a Femme Style
          </p>
          <Link to="/shop" data-testid="start-shopping-button">
            <button className="btn-primary text-lg px-10 py-4">
              Começar a Comprar
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
