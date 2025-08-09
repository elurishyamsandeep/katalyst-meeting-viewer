import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    console.log('Checking MCP authentication status...');

    try {
      const fs = await import('fs');
      const path = require('path');
      const os = require('os');
      
      const tokenPath = path.join(os.homedir(), '.config', 'google-calendar-mcp', 'tokens.json');
      
      console.log('Looking for tokens at:', tokenPath);
      
      if (!fs.existsSync(tokenPath)) {
        console.log('Token file not found at:', tokenPath);
        return NextResponse.json({
          success: false,
          error: 'MCP tokens not found',
          needsAuthentication: true,
          tokenPath: tokenPath
        }, { status: 401 });
      }

      const tokenFileContent = fs.readFileSync(tokenPath, 'utf8');
      console.log('Token file exists, size:', tokenFileContent.length, 'bytes');
      
      let tokenData;
      try {
        tokenData = JSON.parse(tokenFileContent);
      } catch (parseError) {
        console.error('Failed to parse token file:', parseError);
        return NextResponse.json({
          success: false,
          error: 'Invalid token file format',
          needsAuthentication: true
        }, { status: 401 });
      }

      console.log('Parsed token data keys:', Object.keys(tokenData));

      // Handle the nested structure: { normal: { access_token: "..." } }
      let accessToken = null;
      
      if (tokenData.normal && tokenData.normal.access_token) {
        accessToken = tokenData.normal.access_token;
        console.log('Found access token in normal.access_token field');
      } else if (tokenData.access_token) {
        accessToken = tokenData.access_token;
        console.log('Found access token in root access_token field');
      } else if (tokenData.accessToken) {
        accessToken = tokenData.accessToken;
        console.log('Found access token in root accessToken field');
      } else {
        console.log('No access token found. Available fields:', Object.keys(tokenData));
        return NextResponse.json({
          success: false,
          error: 'Access token not found in MCP tokens',
          needsAuthentication: true,
          availableFields: Object.keys(tokenData),
          tokenStructure: tokenData
        }, { status: 401 });
      }

      console.log('Access token found, length:', accessToken.length);
      console.log('Testing token with Google Calendar API...');

      // Test the token with Google Calendar API
      const testResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Google Calendar API test response:', testResponse.status);

      if (!testResponse.ok) {
        const errorText = await testResponse.text();
        console.error('Google Calendar API error:', testResponse.status, errorText);
        
        if (testResponse.status === 401) {
          console.log('Access token expired or invalid');
          return NextResponse.json({
            success: false,
            error: 'MCP access token expired or invalid. Please re-authenticate.',
            needsAuthentication: true,
            tokenExpired: true
          }, { status: 401 });
        }
        
        return NextResponse.json({
          success: false,
          error: `Google Calendar API error: ${testResponse.status}`,
          needsAuthentication: true,
          apiError: errorText
        }, { status: 401 });
      }

      const calendarInfo = await testResponse.json();
      console.log('Google Calendar API success, calendar:', calendarInfo.summary);

      return NextResponse.json({
        success: true,
        message: 'MCP authentication successful with real Google Calendar access',
        userInfo: {
          email: calendarInfo.id || 'authenticated-user@gmail.com',
          name: calendarInfo.summary || 'Google Calendar User',
          calendarName: calendarInfo.summary,
          picture: null
        },
        tokenExists: true,
        realAuthentication: true,
        calendarId: calendarInfo.id
      });

    } catch (error) {
      console.error('MCP authentication verification failed:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to verify MCP authentication',
        message: error instanceof Error ? error.message : 'Unknown error',
        needsAuthentication: false,
        technicalError: true
      }, { status: 500 });
    }

  } catch (error) {
    console.error('MCP authenticate API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error during MCP authentication verification',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
