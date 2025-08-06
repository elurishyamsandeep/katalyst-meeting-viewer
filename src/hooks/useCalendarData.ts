import { useState, useEffect, useRef } from 'react';
import { CalendarEvent } from '../types/calendar';
import { GoogleCalendarService } from '../lib/google/calendar';
import { useAuth } from '../contexts/AuthContext';

export const useCalendarData = () => {
  const { user, logout } = useAuth();
  const [upcomingMeetings, setUpcomingMeetings] = useState<CalendarEvent[]>([]);
  const [pastMeetings, setPastMeetings] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Refs for managing intervals and cleanup
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMountedRef = useRef(true);

  const fetchCalendarData = async () => {
    if (!user?.accessToken || !isComponentMountedRef.current) {
      setError('No access token available. Please sign in again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const calendarService = new GoogleCalendarService(user.accessToken);
      
      // Validate token before making API calls
      const isValidToken = await calendarService.validateToken();
      if (!isValidToken) {
        setError('Calendar access not available. Please sign out and sign in again to grant calendar permissions.');
        return;
      }
      
      const [upcoming, past] = await Promise.all([
        calendarService.getUpcomingMeetings(5),
        calendarService.getPastMeetings(5)
      ]);

      // Only update state if component is still mounted
      if (isComponentMountedRef.current) {
        setUpcomingMeetings(upcoming);
        setPastMeetings(past);
        setLastUpdated(new Date());
        console.log('Calendar data updated:', { 
          upcoming: upcoming.length, 
          past: past.length,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error('Error fetching calendar data:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch calendar data';
      
      if (errorMessage.includes('Authentication failed') || 
          errorMessage.includes('Calendar access not granted')) {
        setError(`${errorMessage} Click the logout button and sign in again.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      if (isComponentMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Function to start polling
  const startPolling = () => {
    console.log('Starting calendar polling...');
    
    // Clear any existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    
    // Set up new polling interval (5 minutes = 300000ms)
    pollingIntervalRef.current = setInterval(() => {
      console.log('Auto-refreshing calendar events...');
      fetchCalendarData();
    }, 5 * 60 * 1000); // 5 minutes
  };

  // Function to stop polling
  const stopPolling = () => {
    console.log('Stopping calendar polling...');
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };

  // Handle page visibility changes (pause/resume polling)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, pausing polling...');
        stopPolling();
      } else {
        console.log('Page visible, resuming polling...');
        if (user?.accessToken && isComponentMountedRef.current) {
          fetchCalendarData(); // Immediate refresh when page becomes visible
          startPolling(); // Resume polling
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user?.accessToken]);

  // Main effect for initial data fetch and polling setup
  useEffect(() => {
    isComponentMountedRef.current = true;
    
    if (user?.accessToken) {
      // Initial fetch
      fetchCalendarData();
      
      // Start polling after initial fetch
      startPolling();
    } else {
      // Clear data if no user
      setUpcomingMeetings([]);
      setPastMeetings([]);
      setError(null);
      setLastUpdated(null);
    }

    // Cleanup function
    return () => {
      isComponentMountedRef.current = false;
      stopPolling();
    };
  }, [user?.accessToken]);

  // Manual refresh function
  const refreshNow = async () => {
    console.log('Manual refresh triggered...');
    await fetchCalendarData();
    
    // Restart polling timer after manual refresh
    if (user?.accessToken) {
      stopPolling();
      startPolling();
    }
  };

  return {
    upcomingMeetings,
    pastMeetings,
    isLoading,
    error,
    lastUpdated,
    refetch: refreshNow,
    handleReauth: logout,
    startPolling,
    stopPolling
  };
};
