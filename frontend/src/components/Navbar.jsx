import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Radio, PlayCircle, Heart, MapPin, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCurrentUser();
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: null },
    { name: 'Live', path: '/live', icon: Radio },
    { name: 'Media', path: '/media', icon: PlayCircle },
    { name: 'Prayer Wall', path: '/prayer-wall', icon: Heart },
    { name: 'Locations', path: '/locations', icon: MapPin },
    { name: 'Give', path: '/give', icon: DollarSign },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-crm-purple/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-crm-purple via-crm-purple-light to-crm-purple-lighter rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg glow-purple">
              C
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold bg-gradient-to-r from-crm-purple to-crm-purple-dark bg-clip-text text-transparent">CRM</div>
              <div className="text-xs text-crm-purple-dark">2033</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-crm-purple text-white shadow-md glow-purple'
                    : 'text-gray-700 hover:bg-crm-purple-lighter hover:text-crm-purple-dark'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.name}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/portal"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/portal')
                      ? 'bg-crm-purple text-white shadow-md'
                      : 'text-gray-700 hover:bg-crm-purple-lighter hover:text-crm-purple-dark'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{user.full_name?.split(' ')[0] || 'Portal'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-crm-purple hover:bg-crm-purple-lighter transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-crm-purple to-crm-purple-dark hover:shadow-lg hover:scale-105 transition-all duration-200 glow-purple"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-crm-purple hover:bg-crm-purple-lighter transition"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-crm-purple/20 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-crm-purple text-white shadow-md'
                    : 'text-gray-700 hover:bg-crm-purple-lighter hover:text-crm-purple-dark'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {link.icon && <link.icon className="w-5 h-5" />}
                  <span>{link.name}</span>
                </div>
              </Link>
            ))}
            
            <div className="border-t border-crm-purple/20 my-2"></div>
            
            {user ? (
              <>
                <Link
                  to="/portal"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-crm-purple-lighter hover:text-crm-purple-dark transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5" />
                    <span>{user.full_name || 'Portal'}</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-crm-purple hover:bg-crm-purple-lighter transition-all duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-crm-purple to-crm-purple-dark hover:shadow-lg transition-all duration-200 text-center"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
