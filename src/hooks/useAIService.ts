import { useState, useCallback } from 'react';
import { CalendarEvent } from '../types/calendar';
import { MeetingSummary, MeetingInsights } from '../types/ai';
import { perplexityAI } from '../lib/ai/perplexityService';

export const useAIService = () => {
  const [summaries, setSummaries] = useState<Map<string, MeetingSummary>>(new Map());
  const [insights, setInsights] = useState<MeetingInsights | null>(null);

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
      const summary = await perplexityAI.generateMeetingSummary(meeting);
      
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
  }, []);

  const generateInsights = useCallback(async (meetings: CalendarEvent[]) => {
    setInsights({
      insights: '',
      generatedAt: new Date(),
      isLoading: true,
      error: null
    });

    try {
      const insightsText = await perplexityAI.generateMeetingInsights(meetings);
      
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
  }, []);

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
