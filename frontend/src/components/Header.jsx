import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-slate-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                WalletWise
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center justify-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors">
                About
              </Link>
              <Link to="/research" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors">
                Research
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white px-4 py-2 rounded-md text-lg font-medium transition-colors">
                Contact
              </Link>
              <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-md text-lg font-medium transition-colors">
                Login
              </Link>
              <Link to="/register" className="border border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-6 py-2 rounded-md text-lg font-medium transition-colors">
                Register
              </Link>
            </div>
          </div>
          
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-400 hover:text-white">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">
              About
            </Link>
            <Link to="/research" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">
              Research
            </Link>
            <Link to="/contact" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-lg font-medium">
              Contact
            </Link>
            <Link to="/login" className="bg-emerald-600 text-white block px-3 py-2 rounded-md text-lg font-medium">
              Login
            </Link>
            <Link to="/register" className="border border-emerald-600 text-emerald-400 block px-3 py-2 rounded-md text-lg font-medium">
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;