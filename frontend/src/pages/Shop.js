import { useState, useEffect } from 'react';
import { axiosInstance } from '../App';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';
import { toast } from 'sonner';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'vestidos', label: 'Vestidos' },
    { value: 'blusas', label: 'Blusas' },
    { value: 'calcas', label: 'Calças' },
    { value: 'saias', label: 'Saias' },
    { value: 'casacos', label: 'Casacos' },
    { value: 'bodies', label: 'Bodies' },
    { value: 'esportivo', label: 'Esportivo' },
  ];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const url = selectedCategory === 'all' ? '/products' : `/products?category=${selectedCategory}`;
      const response = await axiosInstance.get(url);
      setProducts(response.data);
    } catch (error) {
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4" data-testid="shop-title">
            Nossa Coleção
          </h1>
          <p className="text-lg text-gray-600">Descubra peças exclusivas selecionadas especialmente para você</p>
        </div>

        <div className="mb-8 flex items-center justify-center flex-wrap gap-3">
          <Filter className="w-5 h-5 text-gray-600" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              data-testid={`category-${cat.value}`}
              className={`px-6 py-2 rounded-full font-medium transition ${
                selectedCategory === cat.value
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'glassmorphism text-gray-700 hover:scale-105'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">Carregando produtos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} data-testid={`product-card-${product.id}`}>
                <div className="product-card glassmorphism rounded-2xl overflow-hidden">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                      data-testid={`product-image-${product.id}`}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1" data-testid={`product-name-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                    <p className="text-xl font-bold text-pink-600" data-testid={`product-price-${product.id}`}>
                      R$ {product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-20 text-gray-600" data-testid="no-products-message">
            Nenhum produto encontrado nesta categoria
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
