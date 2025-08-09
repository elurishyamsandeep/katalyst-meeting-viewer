import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('Clearing MCP tokens for account switch...');

    try {
      const fs = await import('fs');
      const path = require('path');
      const os = require('os');
      
      const tokenPath = path.join(os.homedir(), '.config', 'google-calendar-mcp', 'tokens.json');
      
      if (fs.existsSync(tokenPath)) {
        // Create backup of current tokens before clearing
        const backupPath = tokenPath + '.backup.' + Date.now();
        fs.copyFileSync(tokenPath, backupPath);
        console.log('Current tokens backed up to:', backupPath);

        // Clear the tokens file
        fs.unlinkSync(tokenPath);
        console.log('Tokens file cleared successfully');
        
        return NextResponse.json({
          success: true,
          message: 'Tokens cleared successfully. Please re-authenticate with desired Google account.',
          backupPath: backupPath
        });
      } else {
        console.log('No tokens file found to clear');
        return NextResponse.json({
          success: true,
          message: 'No existing tokens found. Ready for new authentication.',
          alreadyCleared: true
        });
      }

    } catch (error) {
      console.error('Error clearing tokens:', error);
      
      return NextResponse.json({
        success: false,
        error: 'Failed to clear tokens',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Clear tokens API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error during token clearing',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
