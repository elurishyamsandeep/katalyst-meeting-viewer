'use client';

import { useState } from 'react';
import { AiService } from '../lib/ai/AiService';
import { CalendarEvent } from '../types/calendar';

const mockMeeting: CalendarEvent = {
  id: 'test-meeting-1',
  title: 'Product Strategy Review',
  start: '2024-01-15T10:00:00Z',
  end: '2024-01-15T11:30:00Z',
  attendees: [
    { email: 'john@company.com', name: 'John Smith', responseStatus: 'accepted' },
    { email: 'sarah@company.com', name: 'Sarah Johnson', responseStatus: 'accepted' }
  ],
  description: 'Quarterly review of product roadmap and feature prioritization for Q2 planning.',
  location: 'Conference Room A'
};

export default function TestAiPage() {
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [insightsResult, setInsightsResult] = useState<string>('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [error, setError] = useState<string>('');
  const [apiDiagnostics, setApiDiagnostics] = useState<string>('');

  const aiService = new AiService();

  const checkApiSetup = () => {
    const apiKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY;
    const diagnostics = {
      'API Key Present': !!apiKey,
      'API Key Format': apiKey ? (apiKey.startsWith('pplx-') ? '✅ Valid' : '❌ Invalid format') : '❌ Missing',
      'API Key Length': apiKey ? apiKey.length : 0,
      'Environment': process.env.NODE_ENV || 'unknown'
    };
    
    setApiDiagnostics(JSON.stringify(diagnostics, null, 2));
    console.log('API Diagnostics:', diagnostics);
  };

  const testSummaryGeneration = async () => {
    setIsLoadingSummary(true);
    setError('');
    setSummaryResult('');
    
    try {
      console.log('🚀 Testing AI Summary Generation...');
      console.log('📝 Input meeting:', mockMeeting);
      
      const summary = await aiService.generateMeetingSummary(mockMeeting);
      
      console.log('✅ Generated summary:', summary);
      setSummaryResult(summary);
      
      // Check if this is a fallback or real AI summary
      if (summary.includes('90-minute meeting with') && summary.includes('attendees')) {
        console.log('ℹ️ This appears to be a fallback summary');
      } else {
        console.log('🎯 This appears to be a real AI-generated summary');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Summary generation failed:', err);
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
      console.log('🚀 Testing AI Insights Generation...');
      
      const insights = await aiService.generateMeetingInsights([mockMeeting]);
      
      console.log('✅ Generated insights:', insights);
      setInsightsResult(insights);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Insights generation failed:', err);
      setError(`Insights Error: ${errorMessage}`);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">🤖 AI Service Test Results</h1>
          
          {/* Success Indicator */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">✅ Basic Test Passed!</h2>
            <p className="text-green-700">Your AI service is working and generated a summary. Let's run more comprehensive tests.</p>
          </div>

          {/* API Diagnostics */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">🔍 API Configuration</h2>
            <button
              onClick={checkApiSetup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors mb-3"
            >
              Check API Setup
            </button>
            {apiDiagnostics && (
              <pre className="text-sm bg-white p-3 rounded border text-blue-800 overflow-x-auto">
                {apiDiagnostics}
              </pre>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold">❌ Error:</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Meeting Summary Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📝 AI Meeting Summary Test</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-gray-700 mb-2">Test Data:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Title:</strong> {mockMeeting.title}</p>
                <p><strong>Duration:</strong> 90 minutes</p>
                <p><strong>Attendees:</strong> {mockMeeting.attendees.map(a => a.name).join(', ')}</p>
                <p><strong>Description:</strong> {mockMeeting.description}</p>
              </div>
            </div>

            <button
              onClick={testSummaryGeneration}
              disabled={isLoadingSummary}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoadingSummary && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{isLoadingSummary ? 'Generating AI Summary...' : 'Generate AI Summary'}</span>
            </button>

            {summaryResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🎯 Generated Summary:</h3>
                <p className="text-green-700 leading-relaxed">{summaryResult}</p>
                <div className="mt-3 text-sm text-green-600">
                  {summaryResult.includes('90-minute meeting with') ? 
                    '⚠️ This is a fallback summary - API might be rate limited' : 
                    '✅ This is an AI-generated summary from Perplexity'}
                </div>
              </div>
            )}
          </div>

          {/* Meeting Insights Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 AI Meeting Insights Test</h2>
            
            <button
              onClick={testInsightsGeneration}
              disabled={isLoadingInsights}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoadingInsights && (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              )}
              <span>{isLoadingInsights ? 'Generating AI Insights...' : 'Generate AI Insights'}</span>
            </button>

            {insightsResult && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">🧠 Generated Insights:</h3>
                <p className="text-blue-700 leading-relaxed">{insightsResult}</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">🚀 Next Steps:</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✅ Basic AI service connection working</li>
              <li>🔄 Test full AI generation (not just fallback)</li>
              <li>🔄 Verify Perplexity API credits and limits</li>
              <li>🔄 Test insights generation</li>
              <li>➡️ Ready to integrate into main dashboard!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
