import { CalendarEvent, CalendarApiResponse } from '../../types/calendar';

export class GoogleCalendarService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async getUpcomingMeetings(maxResults: number = 5): Promise<CalendarEvent[]> {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `orderBy=startTime&singleEvents=true&timeMin=${now}&maxResults=${maxResults}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (response.status === 401) {
        throw new Error('Authentication failed: Please sign out and sign in again to grant calendar permissions.');
      }

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.message?.includes('insufficient authentication scopes')) {
          throw new Error('Calendar access not granted. Please sign out and sign in again to allow calendar access.');
        }
        throw new Error('Access denied to calendar. Please check your permissions.');
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Calendar API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Calendar API error: ${response.status} - ${response.statusText}`);
      }

      const data: CalendarApiResponse = await response.json();
      console.log('Calendar API Response:', data);
      
      return this.transformCalendarEvents(data.items || []);
    } catch (error) {
      console.error('Error fetching upcoming meetings:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch calendar events. Please try again.');
    }
  }

  async getPastMeetings(maxResults: number = 5): Promise<CalendarEvent[]> {
    const now = new Date().toISOString();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `orderBy=startTime&singleEvents=true&timeMax=${now}&timeMin=${oneWeekAgo}&maxResults=${maxResults}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (response.status === 401) {
        throw new Error('Authentication failed: Please sign out and sign in again to grant calendar permissions.');
      }

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.error?.message?.includes('insufficient authentication scopes')) {
          throw new Error('Calendar access not granted. Please sign out and sign in again to allow calendar access.');
        }
        throw new Error('Access denied to calendar. Please check your permissions.');
      }

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Calendar API Error Details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`Calendar API error: ${response.status} - ${response.statusText}`);
      }

      const data: CalendarApiResponse = await response.json();
      return this.transformCalendarEvents(data.items || []);
    } catch (error) {
      console.error('Error fetching past meetings:', error);
      
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch past calendar events. Please try again.');
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v1/tokeninfo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `access_token=${this.accessToken}`
      });

      if (response.ok) {
        const tokenInfo = await response.json();
        console.log('Token info:', tokenInfo);
        
        const hasCalendarScope = tokenInfo.scope?.includes('https://www.googleapis.com/auth/calendar.readonly');
        if (!hasCalendarScope) {
          console.warn('Calendar scope not found in token');
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }

  private transformCalendarEvents(events: any[]): CalendarEvent[] {
    return events.map(event => ({
      id: event.id,
      title: event.summary || 'Untitled Meeting',
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      attendees: event.attendees?.map((attendee: any) => ({
        email: attendee.email,
        name: attendee.displayName || attendee.email,
        responseStatus: attendee.responseStatus || 'needsAction'
      })) || [],
      description: event.description || '',
      location: event.location || '',
      meetingUrl: this.extractMeetingUrl(event),
      organizer: event.organizer ? {
        email: event.organizer.email,
        displayName: event.organizer.displayName
      } : undefined
    }));
  }

  private extractMeetingUrl(event: any): string | undefined {
    if (event.hangoutLink) return event.hangoutLink;
    
    if (event.conferenceData?.entryPoints) {
      const videoEntry = event.conferenceData.entryPoints.find(
        (ep: any) => ep.entryPointType === 'video'
      );
      if (videoEntry) return videoEntry.uri;
    }
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const description = event.description || '';
    const urls = description.match(urlRegex);
    
    if (urls) {
      const meetingUrl = urls.find((url: string) => 
        url.includes('zoom.us') || 
        url.includes('meet.google.com') || 
        url.includes('teams.microsoft.com') ||
        url.includes('webex.com') ||
        url.includes('gotomeeting.com')
      );
      if (meetingUrl) return meetingUrl;
    }
    
    return undefined;
  }
}
