import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CalendarEvent } from '../types/calendar';

export const useCalendarData = () => {
  const { mcpService } = useAuth();
  const [upcomingMeetings, setUpcomingMeetings] = useState<CalendarEvent[]>([]);
  const [pastMeetings, setPastMeetings] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isVisible = useRef(true); // Track page visibility

  // Debounced data fetching
  const fetchCalendarData = async () => {
    if (!mcpService) return;

    try {
      setError(null);
      const [upcoming, past] = await Promise.all([
        mcpService.getUpcomingMeetings(5),
        mcpService.getPastMeetings(5)
      ]);
      
      setUpcomingMeetings(upcoming);
      setPastMeetings(past);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch calendar data');
      console.error('Calendar data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Page visibility handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisible.current = !document.hidden;
      
      if (document.hidden) {
        // Pause polling when page is not visible
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Resume polling when page becomes visible
        fetchCalendarData();
        startPolling();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [mcpService]);

  const startPolling = () => {
    if (intervalRef.current) return; // Avoid multiple intervals
    
    // Reduced polling frequency for better performance
    intervalRef.current = setInterval(() => {
      if (isVisible.current) {
        fetchCalendarData();
      }
    }, 10 * 60 * 1000); // Poll every 10 minutes instead of 5
  };

  useEffect(() => {
    if (mcpService) {
      fetchCalendarData();
      startPolling();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [mcpService]);

  return {
    upcomingMeetings,
    pastMeetings,
    isLoading,
    error,
    refetch: fetchCalendarData
  };
};
