import React from 'react';
import { Brain, Mail, Github, Linkedin, Twitter, Heart, Shield, FileText, Zap } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-6 mx-auto">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className=" space-x-3 flex items-center justify-center">
                <a href="https://www.linkedin.com/in/sumuk/" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 ">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="mailto:sumukbhat007@gmail.com" className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 ">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400 text-sm">
              <span>© 2025 ResumeAI Analyzer Pro. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-1 text-slate-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>for job seekers worldwide</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/3 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-purple-500/3 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite 3s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;