'use client';

import { useState } from 'react';
import { AiService } from '../lib/ai/AiService'; // Adjust path based on your structure
import { CalendarEvent } from '../types/calendar';

// Mock meeting data for testing
const mockMeeting: CalendarEvent = {
  id: 'test-meeting-1',
  title: 'Product Strategy Review',
  start: '2024-01-15T10:00:00Z',
  end: '2024-01-15T11:30:00Z',
  attendees: [
    { email: 'john@company.com', name: 'John Smith', responseStatus: 'accepted' },
    { email: 'sarah@company.com', name: 'Sarah Johnson', responseStatus: 'accepted' },
    { email: 'mike@company.com', name: 'Mike Chen', responseStatus: 'tentative' }
  ],
  description: 'Quarterly review of product roadmap, feature prioritization, and market analysis for Q2 planning.',
  location: 'Conference Room A',
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
  organizer: {
    email: 'john@company.com',
    displayName: 'John Smith'
  }
};

const mockMeetings: CalendarEvent[] = [
  mockMeeting,
  {
    id: 'test-meeting-2',
    title: 'Weekly Team Standup',
    start: '2024-01-14T09:00:00Z',
    end: '2024-01-14T09:30:00Z',
    attendees: [
      { email: 'team1@company.com', name: 'Alice Brown', responseStatus: 'accepted' },
      { email: 'team2@company.com', name: 'Bob Wilson', responseStatus: 'accepted' }
    ],
    description: 'Weekly progress updates and sprint planning discussion.',
    location: 'Virtual',
    organizer: {
      email: 'alice@company.com',
      displayName: 'Alice Brown'
    }
  },
  {
    id: 'test-meeting-3',
    title: 'Client Presentation Prep',
    start: '2024-01-13T14:00:00Z',
    end: '2024-01-13T15:00:00Z',
    attendees: [
      { email: 'presenter@company.com', name: 'Emma Davis', responseStatus: 'accepted' },
      { email: 'client@external.com', name: 'External Client', responseStatus: 'accepted' }
    ],
    description: 'Preparing presentation materials for upcoming client demo.',
    location: 'Meeting Room B',
    organizer: {
      email: 'emma@company.com',
      displayName: 'Emma Davis'
    }
  }
];

export default function TestAiPage() {
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [insightsResult, setInsightsResult] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [error, setError] = useState<string>('');

  const aiService = new AiService();

  const testSummaryGeneration = async () => {
    setIsLoadingSummary(true);
    setError('');
    setSummaryResult('');
    
    try {
      console.log('Testing meeting summary generation...');
      console.log('Input meeting:', mockMeeting);
      
      const summary = await aiService.generateSummary(mockMeeting);
      
      console.log('Generated summary:', summary);
      setSummaryResult(summary);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Summary generation failed:', err);
      setError(`Summary Error: ${errorMessage}`);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const testInsightsGeneration = async () => {
    setIsLoadingInsights(true);
    setError('');
    setInsightsResult('');
    
    try {
      console.log('Testing meeting insights generation...');
      console.log('Input meetings:', mockMeetings);
      
      // FIXED: Changed from analyzeMeetings to generateInsights
      const insights = await aiService.generateInsights(mockMeetings);
      
      console.log('Generated insights:', insights);
      setInsightsResult(insights);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Insights generation failed:', err);
      setError(`Insights Error: ${errorMessage}`);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const testApiConnection = async () => {
  console.log('Testing Groq API connection...');
  console.log('API Key present:', !!process.env.NEXT_PUBLIC_GROQ_API_KEY);
  console.log('API Key first 10 chars:', process.env.NEXT_PUBLIC_GROQ_API_KEY?.substring(0, 10));
  };


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Service Testing</h1>
          
          {/* API Connection Test */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">API Connection Check</h2>
            <button
              onClick={testApiConnection}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Check API Configuration
            </button>
            <p className="text-sm text-blue-700 mt-2">
              Check browser console for API key status
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold">Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Meeting Summary Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Meeting Summary Test</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Test Meeting Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Title:</strong> {mockMeeting.title}</p>
                <p><strong>Duration:</strong> 1.5 hours</p>
                <p><strong>Attendees:</strong> {mockMeeting.attendees.map(a => a.name).join(', ')}</p>
                <p><strong>Description:</strong> {mockMeeting.description}</p>
              </div>
            </div>

            <button
              onClick={testSummaryGeneration}
              disabled={isLoadingSummary}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoadingSummary && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{isLoadingSummary ? 'Generating Summary...' : 'Generate Meeting Summary'}</span>
            </button>

            {summaryResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Generated Summary:</h3>
                <p className="text-green-700">{summaryResult}</p>
              </div>
            )}
          </div>

          {/* Meeting Insights Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Meeting Insights Test</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Test Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Number of meetings:</strong> {mockMeetings.length}</p>
                <p><strong>Meeting types:</strong> {mockMeetings.map(m => m.title).join(', ')}</p>
                <p><strong>Total attendees:</strong> {mockMeetings.reduce((sum, m) => sum + m.attendees.length, 0)}</p>
              </div>
            </div>

            <button
              onClick={testInsightsGeneration}
              disabled={isLoadingInsights}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoadingInsights && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{isLoadingInsights ? 'Generating Insights...' : 'Generate Meeting Insights'}</span>
            </button>

            {insightsResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Generated Insights:</h3>
                <p className="text-blue-700">{insightsResult}</p>
              </div>
            )}
          </div>

          {/* Test Results Summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">Testing Checklist:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✅ API key configuration check</li>
              <li>✅ Meeting summary generation</li>
              <li>✅ Meeting insights generation</li>
              <li>✅ Error handling</li>
              <li>✅ Loading states</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
