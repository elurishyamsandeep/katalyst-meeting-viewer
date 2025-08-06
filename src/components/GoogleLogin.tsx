'use client';

import { GoogleLogin as GoogleOAuthLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Calendar, Users, Video, Sparkles, Shield, Zap } from 'lucide-react';

export function GoogleLogin() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    
    setIsLoading(true);
    try {
      const mockUser = {
        email: "demo@katalyst.com",
        name: "Alex Rivera",
        picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&facepad=2&auto=format",
        accessToken: credentialResponse.credential
      };

      setUser(mockUser);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('google_access_token', credentialResponse.credential);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    console.error('Google login failed');
  };

  const features = [
    { icon: Calendar, title: "Smart Scheduling", desc: "AI-powered meeting optimization" },
    { icon: Users, title: "Team Insights", desc: "Understand your collaboration patterns" },
    { icon: Video, title: "Seamless Calls", desc: "One-click video conferencing" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding & Features */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">K</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Katalyst
              </h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Transform Your Meeting Experience
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Connect your Google Calendar and unlock AI-powered insights for smarter, more productive meetings.
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Real-time Sync</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <div className="lg:justify-self-center">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-md w-full">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get Started</h3>
              <p className="text-gray-600">Connect your Google Calendar to begin</p>
            </div>
            
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4 py-8">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <span className="text-gray-600 font-medium">Connecting your account...</span>
              </div>
            ) : (
              <div className="space-y-6">
                <GoogleOAuthLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                  width="100%"
                />
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our{' '}
                    <a href="#" className="text-blue-600 hover:underline">Terms</a> and{' '}
                    <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            )}

            {/* Demo Badge */}
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 text-center">
                🚀 <strong>Demo Mode:</strong> This is a prototype for Katalyst assignment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
