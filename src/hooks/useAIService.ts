import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types/calendar';
import { MeetingSummary, MeetingInsights } from '../types/ai';
import { AiService } from '../lib/ai/AiService'; // Updated import - Groq only

export const useAIService = () => {
  const [summaries, setSummaries] = useState<Map<string, MeetingSummary>>(new Map());
  const [insights, setInsights] = useState<MeetingInsights | null>(null);

  // Create AiService instance (Groq-based)
  const aiService = new AiService();

  const generateSummary = useCallback(async (meeting: CalendarEvent) => {
    // Set loading state
    setSummaries(prev => new Map(prev).set(meeting.id, {
      meetingId: meeting.id,
      summary: '',
      generatedAt: new Date(),
      isLoading: true,
      error: null
    }));

    try {
      // Updated to use Groq-based AiService
      const summary = await aiService.generateSummary(meeting);
      
      setSummaries(prev => new Map(prev).set(meeting.id, {
        meetingId: meeting.id,
        summary,
        generatedAt: new Date(),
        isLoading: false,
        error: null
      }));
    } catch (error) {
      setSummaries(prev => new Map(prev).set(meeting.id, {
        meetingId: meeting.id,
        summary: '',
        generatedAt: new Date(),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate summary'
      }));
    }
  }, [aiService]);

  const generateInsights = useCallback(async (meetings: CalendarEvent[]) => {
    setInsights({
      insights: '',
      generatedAt: new Date(),
      isLoading: true,
      error: null
    });

    try {
      // Updated to use Groq-based AiService
      const insightsText = await aiService.generateInsights(meetings);
      
      setInsights({
        insights: insightsText,
        generatedAt: new Date(),
        isLoading: false,
        error: null
      });
    } catch (error) {
      setInsights({
        insights: '',
        generatedAt: new Date(),
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate insights'
      });
    }
  }, [aiService]);

  const getSummary = useCallback((meetingId: string) => {
    return summaries.get(meetingId);
  }, [summaries]);

  return {
    generateSummary,
    generateInsights,
    getSummary,
    insights,
    summaries
  };
};
