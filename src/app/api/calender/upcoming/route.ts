import { NextRequest, NextResponse } from 'next/server';

function extractAccessToken(tokenData: any): string | null {
  // Handle the MCP nested structure: { normal: { access_token: "..." } }
  if (tokenData.normal && tokenData.normal.access_token) {
    return tokenData.normal.access_token;
  }
  // Fallback to other possible structures
  if (tokenData.access_token) return tokenData.access_token;
  if (tokenData.accessToken) return tokenData.accessToken;
  if (tokenData.token) return tokenData.token;
  if (tokenData.credentials && tokenData.credentials.access_token) {
    return tokenData.credentials.access_token;
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { maxResults } = await request.json();

    console.log('Fetching upcoming events via MCP tokens...');

    try {
      const fs = await import('fs');
      const path = require('path');
      const os = require('os');
      
      const tokenPath = path.join(os.homedir(), '.config', 'google-calendar-mcp', 'tokens.json');
      
      if (!fs.existsSync(tokenPath)) {
        console.log('Upcoming: Token file not found');
        return NextResponse.json({
          success: false,
          error: 'Not authenticated with Google Calendar MCP',
          needsAuth: true,
          events: []
        }, { status: 401 });
      }

      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      const accessToken = extractAccessToken(tokenData);
      
      if (!accessToken) {
        console.log('Upcoming: Access token missing. Available fields:', Object.keys(tokenData));
        console.log('Upcoming: Token structure:', JSON.stringify(tokenData, null, 2));
        return NextResponse.json({
          success: false,
          error: 'Invalid MCP tokens - access token missing',
          needsAuth: true,
          events: [],
          availableFields: Object.keys(tokenData)
        }, { status: 401 });
      }

      console.log('Upcoming: Access token found, making Google Calendar API call...');

      // Get upcoming events from Google Calendar
      const now = new Date();
      const futureDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days ahead

      const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
        `orderBy=startTime&singleEvents=true&timeMin=${now.toISOString()}&timeMax=${futureDate.toISOString()}&maxResults=${maxResults || 10}`;

      const response = await fetch(calendarUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Upcoming: Google Calendar API response:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upcoming: Google Calendar API error:', response.status, errorText);
        
        if (response.status === 401) {
          return NextResponse.json({
            success: false,
            error: 'Google Calendar access token expired',
            needsAuth: true,
            events: []
          }, { status: 401 });
        }
        
        return NextResponse.json({
          success: false,
          error: `Google Calendar API error: ${response.status}`,
          events: [],
          details: errorText
        }, { status: 500 });
      }

      const calendarData = await response.json();
      const events = calendarData.items || [];
      
      console.log(`Upcoming: Successfully fetched ${events.length} events`);
      
      // Log first event for debugging (if exists)
      if (events.length > 0) {
        console.log('Upcoming: First event sample:', {
          id: events[0].id,
          summary: events[0].summary,
          start: events[0].start
        });
      }
      
      return NextResponse.json({
        success: true,
        events: events,
        source: 'real_google_calendar_via_mcp',
        total: events.length,
        timeRange: 'upcoming_30_days'
      });

    } catch (error) {
      console.error('Upcoming: Error fetching calendar data:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch upcoming calendar events',
        message: error instanceof Error ? error.message : 'Unknown error',
        events: []
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Upcoming: API route error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Server error in upcoming events API',
        message: error instanceof Error ? error.message : 'Unknown error',
        events: []
      },
      { status: 500 }
    );
  }
}
