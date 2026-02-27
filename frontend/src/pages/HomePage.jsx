import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import AuthAwareHeader from '../components/AuthAwareHeader';
import Footer from '../components/Footer';
import { ChevronRight, TrendingUp, PieChart, Calculator, BarChart3 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Financial Dashboard Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Background Projects */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-10">
        <div className="absolute top-20 left-10 transform rotate-12">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <Calculator size={24} className="text-emerald-400 mb-2" />
            <div className="text-xs text-white">EMI Calculator</div>
          </div>
        </div>
        <div className="absolute top-40 right-20 transform -rotate-12">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <TrendingUp size={24} className="text-blue-400 mb-2" />
            <div className="text-xs text-white">Investment Tracker</div>
          </div>
        </div>
        <div className="absolute bottom-40 left-20 transform rotate-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <PieChart size={24} className="text-purple-400 mb-2" />
            <div className="text-xs text-white">Expense Analysis</div>
          </div>
        </div>
        <div className="absolute bottom-20 right-10 transform -rotate-6">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <BarChart3 size={24} className="text-orange-400 mb-2" />
            <div className="text-xs text-white">Financial Reports</div>
          </div>
        </div>
        <div className="absolute top-60 left-1/2 transform -translate-x-1/2 rotate-3">
          <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
            <div className="text-xs text-white">Budget Planning</div>
          </div>
        </div>
        <div className="absolute top-32 right-1/3 transform rotate-45">
          <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            <div className="text-xs text-white">Savings Goals</div>
          </div>
        </div>
      </div>

      <AuthAwareHeader />
      
      {/* Hero Section */}
      <main className="flex-1 pt-20 relative z-20">
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-full mb-8 animate-pulse">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                <span className="text-emerald-400 font-medium text-sm">CDAC Major Project 2026</span>
              </div>
              
              <h1 className="text-5xl sm:text-7xl font-bold text-white mb-8 leading-tight">
                Smart Financial
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-pulse"> 
                  Management
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
                Take control of your finances with WalletWise - a comprehensive personal finance manager 
                featuring <span className="text-emerald-400 font-semibold">EMI planning</span>, 
                <span className="text-blue-400 font-semibold"> investment tracking</span>, and 
                <span className="text-purple-400 font-semibold">intelligent expense management</span>.
              </p>
              
              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Link 
                  to="/explore-project" 
                  className="group relative px-10 py-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    Explore Project 
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                
                <Link 
                  to="/register" 
                  className="group relative px-10 py-4 border-2 border-emerald-500 text-emerald-400 font-bold text-lg rounded-2xl hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>
              
              {/* Feature Highlights */}
              <div className="grid md:grid-cols-3 gap-8 mt-20">
                <div className="group p-8 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl hover:border-emerald-500/40 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Calculator className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">EMI Calculator</h3>
                  <p className="text-gray-300 leading-relaxed">Advanced loan calculations with detailed amortization schedules and payment breakdowns.</p>
                </div>
                
                <div className="group p-8 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl hover:border-blue-500/40 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <TrendingUp className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Investment Tracking</h3>
                  <p className="text-gray-300 leading-relaxed">Real-time portfolio monitoring with SIP calculators and performance analytics.</p>
                </div>
                
                <div className="group p-8 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl hover:border-purple-500/40 transition-all duration-300 hover:scale-105">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <PieChart className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Expense Analysis</h3>
                  <p className="text-gray-300 leading-relaxed">Smart categorization and detailed insights into your spending patterns.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;