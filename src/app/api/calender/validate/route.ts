import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Use the 'version' command to test if MCP is working
    const { stdout, stderr } = await execAsync('npx @cocal/google-calendar-mcp version', {
      env: {
        ...process.env,
        GOOGLE_OAUTH_CREDENTIALS: process.env.GOOGLE_OAUTH_CREDENTIALS_PATH
      },
      timeout: 10000 // 10 second timeout
    });

    if (stderr && !stderr.includes('warning')) {
      throw new Error(`MCP Error: ${stderr}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Google Calendar MCP is available',
      version: stdout.trim()
    });

  } catch (error) {
    console.error('Validation failed:', error);
    return NextResponse.json(
      { 
        error: 'MCP validation failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
