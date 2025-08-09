import { NextRequest, NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

const oauth2Client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/google/callback`
);

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=oauth_cancelled`);
    }

    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=no_code`);
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error('Invalid tokens received from Google');
    }

    // Save tokens in MCP format
    const mcpTokens = {
      normal: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: tokens.expiry_date
      }
    };

    // Store tokens in MCP location
    const fs = await import('fs');
    const path = require('path');
    const os = require('os');
    
    const tokenDir = path.join(os.homedir(), '.config', 'google-calendar-mcp');
    const tokenPath = path.join(tokenDir, 'tokens.json');
    
    if (!fs.existsSync(tokenDir)) {
      fs.mkdirSync(tokenDir, { recursive: true });
    }
    
    fs.writeFileSync(tokenPath, JSON.stringify(mcpTokens, null, 2));
    console.log('Tokens saved successfully to MCP location');

    // Get user info
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data: userInfo } = await oauth2.userinfo.get();

    // Redirect to success page
    const successUrl = new URL(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/success`);
    successUrl.searchParams.set('email', userInfo.email || '');
    successUrl.searchParams.set('name', userInfo.name || '');
    successUrl.searchParams.set('picture', userInfo.picture || '');
    
    return NextResponse.redirect(successUrl.toString());

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=auth_failed`);
  }
}
