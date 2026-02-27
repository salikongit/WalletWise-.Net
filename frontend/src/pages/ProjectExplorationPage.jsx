import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Shield, BarChart3, Calculator, TrendingUp, 
  PieChart, Users, Zap, CheckCircle, Star, Award
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProjectExplorationPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      <main className="flex-1 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Link to="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Explore <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">WalletWise</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover the comprehensive features and capabilities that make WalletWise your ultimate financial management companion.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Shield, 
                title: 'Secure Authentication', 
                desc: 'OTP-based login with JWT tokens for maximum security',
                color: 'from-emerald-500 to-blue-600'
              },
              { 
                icon: BarChart3, 
                title: 'Data Visualization', 
                desc: 'Interactive charts and comprehensive financial reports',
                color: 'from-purple-500 to-pink-600'
              },
              { 
                icon: Calculator, 
                title: 'EMI Planning', 
                desc: 'Advanced loan calculators with amortization schedules',
                color: 'from-orange-500 to-red-600'
              },
              { 
                icon: TrendingUp, 
                title: 'Investment Tracking', 
                desc: 'Real-time portfolio management and analysis tools',
                color: 'from-blue-500 to-indigo-600'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all group">
                <div className={`bg-gradient-to-br ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Highlights */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Award className="text-emerald-400" size={28} />
              Project Achievements
            </h3>
            <div className="space-y-4">
              {[
                'CDAC Major Project - Final Year Capstone',
                'Full-stack web application with modern architecture',
                'Comprehensive financial management solution',
                'Industry-standard security implementation',
                'Responsive design for all devices',
                'Real-time data processing and visualization'
              ].map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star className="text-yellow-500 mt-1" size={16} />
                  <p className="text-gray-300">{achievement}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={28} />
              Technical Excellence
            </h3>
            <div className="space-y-4">
              {[
                'React 18 with modern hooks and context',
                '.NET Core 6 Web API with Entity Framework',
                'SQL Server database with optimized queries',
                'JWT authentication with OTP verification',
                'Tailwind CSS for responsive design',
                'Recharts for interactive data visualization'
              ].map((tech, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 mt-1" size={16} />
                  <p className="text-gray-300">{tech}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Deep Dive */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Feature Deep Dive</h2>
          <div className="space-y-8">
            <div className="bg-slate-800/50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <PieChart className="text-emerald-400" size={32} />
                <h3 className="text-xl font-semibold text-white">Financial Dashboard</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Get a comprehensive overview of your financial health with our intuitive dashboard. Track income, expenses, 
                savings, and investments all in one place with beautiful visualizations.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-emerald-400 font-medium mb-2">Income Tracking</h4>
                  <p className="text-gray-400 text-sm">Monitor all income sources with categorization</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-emerald-400 font-medium mb-2">Expense Analysis</h4>
                  <p className="text-gray-400 text-sm">Detailed expense breakdown with smart categorization</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-emerald-400 font-medium mb-2">Savings Goals</h4>
                  <p className="text-gray-400 text-sm">Set and track progress towards financial goals</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Calculator className="text-blue-400" size={32} />
                <h3 className="text-xl font-semibold text-white">EMI & Loan Management</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Plan your loans effectively with our advanced EMI calculator. Generate amortization schedules, 
                compare loan options, and track your loan payments over time.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-blue-400 font-medium mb-2">EMI Calculator</h4>
                  <p className="text-gray-400 text-sm">Calculate EMI for home, car, and personal loans</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-blue-400 font-medium mb-2">Amortization Schedule</h4>
                  <p className="text-gray-400 text-sm">Detailed payment breakdown over loan tenure</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="text-purple-400" size={32} />
                <h3 className="text-xl font-semibold text-white">Investment Planning</h3>
              </div>
              <p className="text-gray-300 mb-4">
                Make informed investment decisions with our comprehensive planning tools. Calculate SIP returns, 
                plan lumpsum investments, and track your portfolio performance.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-purple-400 font-medium mb-2">SIP Calculator</h4>
                  <p className="text-gray-400 text-sm">Plan systematic investment plans with projected returns</p>
                </div>
                <div className="bg-slate-700/50 p-4 rounded">
                  <h4 className="text-purple-400 font-medium mb-2">Portfolio Tracking</h4>
                  <p className="text-gray-400 text-sm">Monitor investment performance and allocation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-emerald-600/20 to-blue-600/20 p-8 rounded-lg border border-emerald-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-gray-300 mb-6">
            Join thousands of users who have already transformed their financial management with WalletWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Get Started Now
            </Link>
            <Link 
              to="/login" 
              className="border border-emerald-600 text-emerald-400 hover:bg-emerald-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectExplorationPage;