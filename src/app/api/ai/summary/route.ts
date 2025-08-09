import { NextRequest, NextResponse } from 'next/server';
import { AiService } from '../../../../lib/ai/AiService';

export async function POST(request: NextRequest) {
  try {
    const { meeting } = await request.json();

    if (!meeting) {
      return NextResponse.json(
        { error: 'Invalid meeting data provided' },
        { status: 400 }
      );
    }

    const aiService = new AiService();
    const summary = await aiService.generateSummary(meeting);

    return NextResponse.json({
      success: true,
      summary,
      source: 'groq_ai_server_side'
    });

  } catch (error) {
    console.error('AI summary generation failed:', error);
    
    return NextResponse.json({
      success: false,
      summary: 'Summary temporarily unavailable. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
