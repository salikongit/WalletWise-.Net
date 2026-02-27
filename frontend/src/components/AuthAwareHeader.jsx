import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { isAuthenticated, getRole } from '../utils/auth';

const AuthAwareHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const authenticated = isAuthenticated();
  const role = getRole();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-emerald-500/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform">
                WalletWise
              </Link>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center justify-center space-x-2">
              <Link to="/" className="relative px-6 py-3 text-white font-medium text-lg transition-all duration-300 hover:text-emerald-400 group">
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link to="/about" className="relative px-6 py-3 text-white font-medium text-lg transition-all duration-300 hover:text-emerald-400 group">
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link to="/research" className="relative px-6 py-3 text-white font-medium text-lg transition-all duration-300 hover:text-emerald-400 group">
                <span className="relative z-10">Research</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link to="/contact" className="relative px-6 py-3 text-white font-medium text-lg transition-all duration-300 hover:text-emerald-400 group">
                <span className="relative z-10">Contact</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              {authenticated ? (
                <Link 
                  to={role === 'Admin' ? '/admin/dashboard' : '/app/dashboard'} 
                  className="relative ml-4 px-8 py-3 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300"
                >
                  <span className="relative z-10">Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-blue-700 to-purple-700 rounded-xl opacity-0 hover:opacity-100 transition-opacity"></div>
                </Link>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link to="/login" className="relative px-8 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-emerald-500/25 hover:scale-105 transition-all duration-300">
                    <span className="relative z-10">Login</span>
                  </Link>
                  <Link to="/register" className="relative px-8 py-3 border-2 border-emerald-500 text-emerald-400 font-semibold text-lg rounded-xl hover:bg-emerald-500 hover:text-white transition-all duration-300">
                    <span className="relative z-10">Register</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="p-2 rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white hover:from-emerald-500/30 hover:to-blue-500/30 transition-all"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-slate-900/98 via-purple-900/98 to-slate-900/98 backdrop-blur-xl border-t border-emerald-500/20">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link to="/" className="block px-4 py-3 text-white font-medium text-lg hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
              Home
            </Link>
            <Link to="/about" className="block px-4 py-3 text-white font-medium text-lg hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
              About
            </Link>
            <Link to="/research" className="block px-4 py-3 text-white font-medium text-lg hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
              Research
            </Link>
            <Link to="/contact" className="block px-4 py-3 text-white font-medium text-lg hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all">
              Contact
            </Link>
            
            <div className="pt-4 border-t border-emerald-500/20">
              {authenticated ? (
                <Link 
                  to={role === 'Admin' ? '/admin/dashboard' : '/app/dashboard'} 
                  className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-lg rounded-lg text-center"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="space-y-3">
                  <Link to="/login" className="block w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-semibold text-lg rounded-lg text-center">
                    Login
                  </Link>
                  <Link to="/register" className="block w-full px-4 py-3 border-2 border-emerald-500 text-emerald-400 font-semibold text-lg rounded-lg text-center hover:bg-emerald-500 hover:text-white transition-all">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AuthAwareHeader;