'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCalendarData } from '../../hooks/useCalendarData';

export default function TestCalendarAiPage() {
  const { user, isLoading } = useAuth();
  const { upcomingMeetings, pastMeetings } = useCalendarData();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
            <span className="text-gray-700">Loading authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">⚠️ Authentication Required</h1>
          <p className="text-gray-700 mb-4">Please sign in with Google first to access your calendar data.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors inline-block"
          >
            ← Go back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">📊 Calendar Data → AI Test</h1>
          
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">👤 Authenticated User</h2>
            <p className="text-blue-800">Welcome, {user.name}! Testing with your real calendar data.</p>
            <p className="text-blue-600 text-sm">Access token present: {user.accessToken ? '✅ Yes' : '❌ No'}</p>
          </div>

          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold text-green-900 mb-2">📅 Calendar Data Status</h2>
            <div className="space-y-2">
              <p className="text-green-800">✅ Upcoming meetings: {upcomingMeetings.length}</p>
              <p className="text-green-800">✅ Past meetings: {pastMeetings.length}</p>
            </div>
          </div>

          {/* Add a simple AI test button */}
          <div className="mb-6 p-4 bg-purple-50 rounded-lg">
            <h2 className="text-lg font-semibold text-purple-900 mb-2">🤖 AI Test Ready</h2>
            <p className="text-purple-800">Your authentication is working! You can now test AI integration.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
