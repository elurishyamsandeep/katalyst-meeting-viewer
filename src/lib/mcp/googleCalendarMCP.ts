import { CalendarEvent } from '../../types/calendar';

export class GoogleCalendarMCP {
  private credentialsPath: string;
  private isInitialized: boolean = false;

  constructor(credentialsPath?: string) {
    this.credentialsPath = credentialsPath || process.env.GOOGLE_OAUTH_CREDENTIALS_PATH || './gcp-oauth.keys.json';
  }

  async initialize(): Promise<boolean> {
    try {
      console.log('Google Calendar MCP initialized');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize MCP:', error);
      return false;
    }
  }

  async getUpcomingMeetings(maxResults: number = 5): Promise<CalendarEvent[]> {
    if (!this.isInitialized) {
      throw new Error('MCP not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch('/api/calender/upcoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxResults })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`MCP API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      return this.transformToCalendarEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching upcoming meetings via MCP:', error);
      throw error;
    }
  }

  async getPastMeetings(maxResults: number = 5): Promise<CalendarEvent[]> {
    if (!this.isInitialized) {
      throw new Error('MCP not initialized. Call initialize() first.');
    }

    try {
      const response = await fetch('/api/calender/past', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maxResults })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`MCP API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      return this.transformToCalendarEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching past meetings via MCP:', error);
      throw error;
    }
  }

  // Use API routes for AI instead of direct Groq calls
  async generateAIInsights(meetings: CalendarEvent[]): Promise<string> {
    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetings })
      });

      if (!response.ok) {
        console.warn(`AI API Error: ${response.status}`);
        return 'AI insights temporarily unavailable - using MCP for calendar data successfully.';
      }

      const data = await response.json();
      return data.insights || 'AI insights generated from real calendar data via MCP.';
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return `AI insights temporarily unavailable. Successfully loaded ${meetings.length} real calendar events via MCP.`;
    }
  }

  async generateMeetingSummary(meeting: CalendarEvent): Promise<string> {
    try {
      const response = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meeting })
      });

      if (!response.ok) {
        console.warn(`AI API Error: ${response.status}`);
        return `Meeting: ${meeting.title} - Summary temporarily unavailable.`;
      }

      const data = await response.json();
      return data.summary || `Meeting: ${meeting.title} - Summary generated from real calendar data.`;
    } catch (error) {
      console.error('Error generating meeting summary:', error);
      return `Meeting: ${meeting.title} - Summary temporarily unavailable.`;
    }
  }

  async validateConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/calender/validate', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch (error) {
      console.error('MCP connection validation failed:', error);
      return false;
    }
  }

  private transformToCalendarEvents(events: any[]): CalendarEvent[] {
    return events.map(event => ({
      id: event.id || '',
      title: event.summary || 'Untitled Meeting',
      start: event.start?.dateTime || event.start?.date || '',
      end: event.end?.dateTime || event.end?.date || '',
      attendees: event.attendees?.map((attendee: any) => ({
        email: attendee.email || '',
        name: attendee.displayName || attendee.email || '',
        responseStatus: attendee.responseStatus || 'needsAction'
      })) || [],
      description: event.description || '',
      location: event.location || '',
      meetingUrl: this.extractMeetingUrl(event),
      organizer: event.organizer ? {
        email: event.organizer.email || '',
        displayName: event.organizer.displayName || ''
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
      return meetingUrl;
    }
    
    return undefined;
  }
}
