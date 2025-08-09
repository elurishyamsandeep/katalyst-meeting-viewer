'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { Calendar, Users } from 'lucide-react';

export function SignInPage() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<string>('');

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setAuthStatus('Redirecting to Google...');
    
    try {
      // Get OAuth URL from our API
      const response = await fetch('/api/auth/google', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (!result.success || !result.authUrl) {
        throw new Error('Failed to generate authentication URL');
      }

      // Redirect to Google OAuth (this will show account selection)
      window.location.href = result.authUrl;
      
    } catch (error) {
      console.error('Google Sign-in failed:', error);
      setAuthStatus(`Sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 -left-10 w-64 h-64 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-10 right-1/3 w-48 h-48 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      {/* Logo with hover animation */}
      <div className="absolute top-8 left-8 z-10 transform transition-all duration-300 hover:scale-110">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:rotate-6">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Katalyst AI
            </h1>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              Production MCP Integration
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          {/* Main card with subtle animations */}
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.02] animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3 animate-slide-down">Welcome to Katalyst</h2>
              <p className="text-xl text-gray-600 mb-8 animate-slide-down" style={{ animationDelay: '0.1s' }}>Smart Calendar Intelligence</p>
              <p className="text-gray-500 animate-slide-down" style={{ animationDelay: '0.2s' }}>Sign in with your Google account to get started</p>
            </div>
            
            <div className="space-y-6">
              {!isLoading ? (
                <>
                  {/* Animated Google Sign In Button */}
                  <div className="flex justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <button
                      onClick={handleGoogleSignIn}
                      className="group relative flex items-center justify-center h-14 bg-white border-2 border-gray-200 hover:border-blue-300 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden google-signin-btn"
                    >
                      {/* Google Logo - Always visible */}
                      <div className="flex-shrink-0 w-6 h-6 z-10 transition-transform duration-300 group-hover:scale-110">
                        <svg className="w-full h-full" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                      </div>
                      
                      {/* Text that slides in on hover */}
                      <div className="text-container overflow-hidden transition-all duration-500 ease-in-out">
                        <span className="text-gray-700 font-medium text-lg whitespace-nowrap px-3 transform transition-transform duration-500 ease-in-out">
                          Continue with Google
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Features List with staggered animation */}
                  <div className="space-y-3 mt-8">
                    <div className="flex items-center space-x-3 text-sm text-gray-600 transform transition-all duration-300 hover:translate-x-2 animate-slide-left" style={{ animationDelay: '0.4s' }}>
                      <Calendar className="w-5 h-5 text-blue-600 transform transition-transform duration-300 hover:rotate-12" />
                      <span>Access your Google Calendar events</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 transform transition-all duration-300 hover:translate-x-2 animate-slide-left" style={{ animationDelay: '0.5s' }}>
                      <Users className="w-5 h-5 text-purple-600 transform transition-transform duration-300 hover:scale-125" />
                      <span>AI-powered meeting insights</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-600 transform transition-all duration-300 hover:translate-x-2 animate-slide-left" style={{ animationDelay: '0.6s' }}>
                      <svg className="w-5 h-5 text-green-600 transform transition-transform duration-300 hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Secure MCP-based integration</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center space-y-4 py-8 animate-fade-in">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-200 border-t-blue-600"></div>
                    <div className="animate-ping absolute top-0 left-0 h-10 w-10 rounded-full bg-blue-400 opacity-20"></div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-700 font-medium animate-pulse">{authStatus}</p>
                    <p className="text-gray-500 text-sm mt-1 animate-bounce" style={{ animationDelay: '0.5s' }}>Please complete the process in the new window...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Security badge with hover effect */}
            <div className="mt-8 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl transform transition-all duration-300 hover:scale-105 animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg animate-bounce" style={{ animationDelay: '1s' }}>🔒</span>
                <p className="text-xs text-green-800 font-medium text-center">
                  <strong>Secure OAuth:</strong> Standard Google authentication with MCP calendar integration
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
