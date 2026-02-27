import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">W</span>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                WalletWise
              </h3>
            </div>
            <p className="text-gray-400 text-lg">
              Smart financial management for a better tomorrow.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 text-xl">Quick Links</h4>
            <div className="space-y-3">
              <Link to="/" className="text-gray-400 hover:text-white block transition-colors text-lg">Home</Link>
              <Link to="/about" className="text-gray-400 hover:text-white block transition-colors text-lg">About</Link>
              <Link to="/research" className="text-gray-400 hover:text-white block transition-colors text-lg">Research</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white block transition-colors text-lg">Contact</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 text-xl">Legal</h4>
            <div className="space-y-3">
              <a href="#" className="text-gray-400 hover:text-white block transition-colors text-lg">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white block transition-colors text-lg">Terms of Service</a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-6 text-xl">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="text-emerald-400" size={20} />
                <span className="text-gray-400 text-lg">contact@walletwise.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-emerald-400" size={20} />
                <span className="text-gray-400 text-lg">+91 7896541230</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-emerald-400" size={20} />
                <span className="text-gray-400 text-lg">Mumbai, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-lg">
            © 2026 WalletWise. All rights reserved. Built for CDAC Major Project.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;