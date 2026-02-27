import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Zap, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">About WalletWise</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A modern financial management solution designed for individuals who want to take control of their financial future.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center bg-slate-800/50 p-8 rounded-lg">
            <div className="bg-gradient-to-br from-emerald-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Our Mission</h3>
            <p className="text-gray-300">
              Empower users with intelligent financial tools to make informed decisions and achieve their financial goals through innovative technology and user-centric design.
            </p>
          </div>
          
          <div className="text-center bg-slate-800/50 p-8 rounded-lg">
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Who We Serve</h3>
            <p className="text-gray-300">
              Students managing their first budget, professionals planning investments, and businesses tracking expenses - we serve everyone on their financial journey.
            </p>
          </div>
          
          <div className="text-center bg-slate-800/50 p-8 rounded-lg">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Our Vision</h3>
            <p className="text-gray-300">
              To become the leading platform for personal financial management, making financial literacy accessible to everyone through cutting-edge technology.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Our Story</h2>
          <p className="text-gray-300 mb-4">
            WalletWise was born from the recognition that managing personal finances shouldn't be complicated or overwhelming. 
            Our team of developers and financial experts came together to create a solution that simplifies complex financial calculations 
            while providing powerful insights.
          </p>
          <p className="text-gray-300">
            Built as part of a CDAC Major Project, WalletWise represents the culmination of extensive research into user needs, 
            financial best practices, and modern web technologies. We believe that everyone deserves access to professional-grade 
            financial tools, regardless of their background or experience level.
          </p>
        </div>

        <div className="bg-slate-800/50 p-8 rounded-lg mt-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <img 
                src="/images/team/Sallik.png" 
                alt="Sallik Mulla" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-emerald-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full mx-auto mb-4 items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-2xl">SM</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Sallik Mulla</h3>
              <p className="text-emerald-400 text-sm mb-2">Full Stack Developer</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/images/team/Sudhansu.jpeg" 
                alt="Sudhansu Kapgate" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-purple-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-4 items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-2xl">SK</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Sudhansu Kapgate</h3>
              <p className="text-emerald-400 text-sm mb-2">Full Stack Developer</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/images/team/Isha.jpeg" 
                alt="Isha Gulhane" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-orange-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-2xl">IG</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Isha Gulhane</h3>
              <p className="text-emerald-400 text-sm mb-2">Full Stack Developer</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/images/team/Omkar.png" 
                alt="Omkar Nalawade" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-blue-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-2xl">ON</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Omkar Nalawade</h3>
              <p className="text-emerald-400 text-sm mb-2">Full Stack Developer</p>
            </div>
            
            <div className="text-center">
              <img 
                src="/images/team/Pooja.jpeg" 
                alt="Pooja Atarde" 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-teal-400"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full mx-auto mb-4 items-center justify-center" style={{display: 'none'}}>
                <span className="text-white font-bold text-2xl">PA</span>
              </div>
              <h3 className="text-white font-semibold mb-1">Pooja Atarde</h3>
              <p className="text-emerald-400 text-sm mb-2">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;