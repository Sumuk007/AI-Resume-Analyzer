import React from 'react';
import { Brain, FileText, Zap, User, Settings } from 'lucide-react';

const Header = ({ serverStatus = 'checking' }) => {
  const getStatusConfig = () => {
    switch (serverStatus) {
      case 'live':
        return {
          color: 'bg-green-500',
          pulseColor: 'bg-green-400',
          text: 'Server Live',
          textColor: 'text-green-400'
        };
      case 'waking':
        return {
          color: 'bg-yellow-500',
          pulseColor: 'bg-yellow-400',
          text: 'Server Waking',
          textColor: 'text-yellow-400'
        };
      case 'offline':
        return {
          color: 'bg-red-500',
          pulseColor: 'bg-red-400',
          text: 'Server Offline',
          textColor: 'text-red-400'
        };
      default:
        return {
          color: 'bg-gray-500',
          pulseColor: 'bg-gray-400',
          text: 'Checking...',
          textColor: 'text-gray-400'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                ResumeAI
              </h1>
            </div>
          </div>

          {/* Server Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                {/* Main status circle */}
                <div className={`w-3 h-3 ${statusConfig.color} rounded-full`}></div>
                {/* Pulse animation for live status */}
                {serverStatus === 'live' && (
                  <div className={`absolute inset-0 w-3 h-3 ${statusConfig.pulseColor} rounded-full animate-ping opacity-75`}></div>
                )}
                {/* Slow pulse for waking status */}
                {serverStatus === 'waking' && (
                  <div className={`absolute inset-0 w-3 h-3 ${statusConfig.pulseColor} rounded-full animate-pulse opacity-75`}></div>
                )}
              </div>
              <span className={`text-sm font-medium ${statusConfig.textColor} hidden sm:block`}>
                {statusConfig.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
      </div>
    </header>
  );
};

export default Header;