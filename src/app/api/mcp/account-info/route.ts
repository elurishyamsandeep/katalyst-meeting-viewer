import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('Fetching current account information...');

    try {
      const fs = await import('fs');
      const path = require('path');
      const os = require('os');
      
      const tokenPath = path.join(os.homedir(), '.config', 'google-calendar-mcp', 'tokens.json');
      
      if (!fs.existsSync(tokenPath)) {
        return NextResponse.json({
          success: false,
          error: 'No account currently authenticated',
          hasAccount: false
        }, { status: 401 });
      }

      const tokenData = JSON.parse(fs.readFileSync(tokenPath, 'utf8'));
      const accessToken = tokenData.normal?.access_token;
      
      if (!accessToken) {
        return NextResponse.json({
          success: false,
          error: 'Invalid token data',
          hasAccount: false
        }, { status: 401 });
      }

      // Get account info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const calendarResponse = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary',
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!userInfoResponse.ok || !calendarResponse.ok) {
        return NextResponse.json({
          success: false,
          error: 'Failed to fetch account information',
          tokenExpired: true
        }, { status: 401 });
      }

      const userInfo = await userInfoResponse.json();
      const calendarInfo = await calendarResponse.json();

      return NextResponse.json({
        success: true,
        accountInfo: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          calendarName: calendarInfo.summary,
          calendarId: calendarInfo.id,
          verified: userInfo.verified_email
        },
        hasAccount: true,
        authenticatedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error fetching account info:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch account information',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Account info API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error during account info fetch',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
