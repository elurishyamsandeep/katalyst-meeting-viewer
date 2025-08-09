import { useState } from 'react';

export const useAIService = () => {
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async (meetings: any[]) => {
    setIsLoading(true);
    try {
      // Use API route instead of direct AiService
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetings })
      });

      const data = await response.json();
      setInsights(data.insights || 'Insights unavailable');
      return data.insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Failed to generate insights');
      return 'Failed to generate insights';
    } finally {
      setIsLoading(false);
    }
  };

  return {
    insights,
    isLoading,
    generateInsights
  };
};
