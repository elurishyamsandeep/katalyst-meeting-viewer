'use client';

import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { createUserFromGoogleResponse, storeUserCredentials } from '../../lib/google/auth';

export function SignInPage() {
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState({ google: false, apple: false, linkedin: false });

  const googleLogin = useGoogleLogin({
    scope: [
      'openid',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar.readonly'
    ].join(' '),
    onSuccess: async (tokenResponse) => {
      console.log('Google OAuth Success:', tokenResponse);
      setIsLoading(prev => ({ ...prev, google: true }));
      
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        console.log('Complete user info:', userInfo);
        
        const user = createUserFromGoogleResponse(userInfo, tokenResponse.access_token);
        setUser(user);
        storeUserCredentials(user);
        
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        alert('Google login failed. Please try again.');
      } finally {
        setIsLoading(prev => ({ ...prev, google: false }));
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      alert('Google login failed. Please check your connection and try again.');
      setIsLoading(prev => ({ ...prev, google: false }));
    },
  });

  const handleDummyLogin = (provider: string) => {
    alert(`${provider} login is a demo button only. Use Google to sign in.`);
  };

  const CustomGoogleLoginButton = () => (
    <div className="flex justify-center">
      <button
        onClick={() => googleLogin()}
        disabled={isLoading.google}
        className="group relative flex items-center justify-start w-14 h-14 rounded-full bg-white border-2 border-gray-200 hover:border-blue-300 transition-all duration-700 ease-out hover:w-60 hover:rounded-full shadow-lg hover:shadow-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center transition-all duration-700 ease-out group-hover:left-5">
          <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>

        <div className="absolute left-14 top-1/2 transform -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-out delay-300">
          <span className="text-gray-700 font-medium whitespace-nowrap text-base">
            Continue with Google
          </span>
        </div>

        {isLoading.google && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full transition-all duration-700">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200 border-t-blue-600"></div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/0 to-purple-50/0 group-hover:from-blue-50/20 group-hover:via-blue-50/10 group-hover:to-purple-50/20 rounded-full transition-all duration-700 ease-out -z-10"></div>
      </button>
    </div>
  );

  const CustomAppleLoginButton = () => (
    <div className="flex justify-center">
      <button
        onClick={() => handleDummyLogin('Apple')}
        className="group relative flex items-center justify-start w-14 h-14 rounded-full bg-black hover:bg-gray-900 border-2 border-gray-800 hover:border-gray-600 transition-all duration-700 ease-out hover:w-56 hover:rounded-full shadow-lg hover:shadow-xl overflow-hidden"
      >
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center transition-all duration-700 ease-out group-hover:left-5">
          <svg className="w-6 h-6 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
          </svg>
        </div>
        <div className="absolute left-14 top-1/2 transform -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-out delay-300">
          <span className="text-white font-medium whitespace-nowrap text-base">
            Continue with Apple
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800/0 via-gray-700/0 to-gray-600/0 group-hover:from-gray-800/20 group-hover:via-gray-700/10 group-hover:to-gray-600/20 rounded-full transition-all duration-700 ease-out -z-10"></div>
      </button>
    </div>
  );

  const CustomLinkedInLoginButton = () => (
    <div className="flex justify-center">
      <button
        onClick={() => handleDummyLogin('LinkedIn')}
        className="group relative flex items-center justify-start w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 border-2 border-blue-500 hover:border-blue-400 transition-all duration-700 ease-out hover:w-64 hover:rounded-full shadow-lg hover:shadow-xl overflow-hidden"
      >
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center transition-all duration-700 ease-out group-hover:left-5">
          <svg className="w-6 h-6 flex-shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </div>
        <div className="absolute left-14 top-1/2 transform -translate-y-1/2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-out delay-300">
          <span className="text-white font-medium whitespace-nowrap text-base">
            Continue with LinkedIn
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700/0 via-blue-600/0 to-blue-500/0 group-hover:from-blue-700/20 group-hover:via-blue-600/10 group-hover:to-blue-500/20 rounded-full transition-all duration-700 ease-out -z-10"></div>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="absolute top-8 left-8 z-10">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
              Katalyst AI
            </h1>
            <p className="text-xs text-gray-400 font-light mt-0.5">
              assignment
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome</h2>
              <p className="text-xl text-gray-600 mb-8">Let's sign in</p>
              <p className="text-gray-500">Choose your preferred authentication method</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="w-full sm:w-auto flex justify-center">
                  <CustomGoogleLoginButton />
                </div>
                <div className="w-full sm:w-auto flex justify-center">
                  <CustomAppleLoginButton />
                </div>
                <div className="w-full sm:w-auto flex justify-center">
                  <CustomLinkedInLoginButton />
                </div>
              </div>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">Secure Authentication</span>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  <span className="text-green-600 font-semibold">✓ Google:</span> Full OAuth with Calendar access • 
                  <span className="text-gray-400"> Apple/LinkedIn:</span> Demo only
                </p>
              </div>
            </div>

            <div className="mt-8 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">🚀</span>
                <p className="text-xs text-amber-800 font-medium text-center">
                  <strong>Live Demo:</strong> Katalyst AI Assignment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
