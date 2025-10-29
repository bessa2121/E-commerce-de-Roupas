import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Heart, Calendar, Package, Handshake, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="glassmorphism sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2" data-testid="logo-link">
            <Heart className="w-6 h-6 text-pink-500" fill="#ec4899" />
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
              Femme Style
            </span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/shop" className="text-gray-700 hover:text-pink-500 transition" data-testid="shop-link">
              Loja
            </Link>
            <Link to="/models" className="text-gray-700 hover:text-pink-500 transition" data-testid="models-link">
              Modelos
            </Link>
            <Link to="/partnership" className="text-gray-700 hover:text-pink-500 transition" data-testid="partnership-link">
              Parcerias
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/cart" data-testid="cart-link">
                  <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-pink-500 cursor-pointer transition" />
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger data-testid="user-menu-trigger">
                    <User className="w-6 h-6 text-gray-700 hover:text-pink-500 cursor-pointer transition" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => navigate('/my-orders')} data-testid="my-orders-link">
                      <Package className="w-4 h-4 mr-2" />
                      Meus Pedidos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/my-bookings')} data-testid="my-bookings-link">
                      <Calendar className="w-4 h-4 mr-2" />
                      Minhas Reservas
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} data-testid="logout-button">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth" data-testid="login-link">
                <button className="btn-primary text-sm">
                  Entrar
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
