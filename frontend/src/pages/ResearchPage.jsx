import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ResearchPage = () => {
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Research & Development</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our solution addresses real-world financial management challenges through comprehensive research and modern technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-6">Problems Identified</h3>
            <div className="space-y-4">
              {[
                'Lack of integrated financial planning tools',
                'Complex EMI calculations and tracking',
                'Poor investment portfolio management',
                'Inadequate expense categorization',
                'Limited financial literacy resources',
                'Fragmented financial data across platforms'
              ].map((problem, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-red-500/20 p-1 rounded-full mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  </div>
                  <p className="text-gray-300">{problem}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-lg">
            <h3 className="text-2xl font-semibold text-white mb-6">Our Solution</h3>
            <div className="space-y-4">
              {[
                'Unified dashboard for all financial activities',
                'Advanced EMI calculator with amortization',
                'Real-time investment tracking and analysis',
                'AI-powered expense categorization',
                'Educational resources and financial tips',
                'Secure data integration and management'
              ].map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="text-emerald-500 mt-1" size={20} />
                  <p className="text-gray-300">{solution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-white mb-8 text-center">Technology Stack</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'React + Tailwind + Vite', desc: 'Modern frontend framework with fast build tools' },
              { name: '.NET Core & Spring Boot', desc: 'Robust backend API with high performance' },
              { name: 'MSSQL Server & SQL Server', desc: 'Reliable data storage and management' },
              { name: 'AWS & JWT Auth', desc: 'Secure authentication with OTP verification' }
            ].map((tech, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                <h4 className="text-white font-semibold mb-2">{tech.name}</h4>
                <p className="text-gray-400 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Research Methodology</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">User Research</h4>
              <p className="text-gray-300 mb-4">
                Conducted surveys and interviews with 200+ individuals to understand their financial management pain points and requirements.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Market Analysis</h4>
              <p className="text-gray-300 mb-4">
                Analyzed existing financial management tools to identify gaps and opportunities for innovation.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Technical Feasibility</h4>
              <p className="text-gray-300 mb-4">
                Evaluated modern web technologies and frameworks to ensure scalability and performance.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-emerald-400 mb-3">Security Assessment</h4>
              <p className="text-gray-300 mb-4">
                Implemented industry-standard security practices including JWT authentication and data encryption.
              </p>
            </div>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ResearchPage;