'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle } from 'lucide-react';

// Separate component that uses useSearchParams
function AuthSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [hasProcessed, setHasProcessed] = useState(false);

  const processAuthentication = useCallback(() => {
    if (hasProcessed) return;
    
    const email = searchParams?.get('email');
    const name = searchParams?.get('name');
    const picture = searchParams?.get('picture');

    console.log('Processing auth with:', { email, name, picture });

    if (email && name) {
      setHasProcessed(true);
      
      const user = {
        email: decodeURIComponent(email),
        name: decodeURIComponent(name),
        picture: picture ? decodeURIComponent(picture) : 
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4285F4&color=fff`,
        accessToken: "mcp_oauth_authenticated",
        authMethod: "google_oauth_mcp"
      };

      setUser(user);

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setHasProcessed(true);
      console.error('Missing email or name in URL params');
      router.push('/?error=invalid_user_data');
    }
  }, [searchParams, setUser, router, hasProcessed]);

  useEffect(() => {
    processAuthentication();
  }, [processAuthentication]);

  const email = searchParams?.get('email');
  const name = searchParams?.get('name');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Successful!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Welcome, <span className="font-semibold">
              {name ? decodeURIComponent(name) : 'User'}
            </span>!
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800">
              ✅ Connected to Google Calendar<br/>
              ✅ MCP integration enabled<br/>
              ✅ Ready for AI insights
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Email: {email ? decodeURIComponent(email) : 'Not available'}</p>
            <p className="mt-2">
              {hasProcessed ? 'Redirecting to dashboard...' : 'Processing authentication...'}
            </p>
          </div>
          
          <div className="mt-6">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-200 border-t-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function AuthSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Authentication...
          </h2>
          <p className="text-gray-600">
            Please wait while we complete your sign-in.
          </p>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<AuthSuccessLoading />}>
      <AuthSuccessContent />
    </Suspense>
  );
}
