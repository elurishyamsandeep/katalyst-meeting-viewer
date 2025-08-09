import { NextRequest, NextResponse } from 'next/server';
import { AiService } from '../../../../lib/ai/AiService';

export async function POST(request: NextRequest) {
  try {
    const { meetings } = await request.json();

    if (!meetings || !Array.isArray(meetings)) {
      return NextResponse.json(
        { error: 'Invalid meetings data provided' },
        { status: 400 }
      );
    }

    const aiService = new AiService();
    const insights = await aiService.generateInsights(meetings);

    return NextResponse.json({
      success: true,
      insights,
      source: 'groq_ai_server_side'
    });

  } catch (error) {
    console.error('AI insights generation failed:', error);
    
    // Fallback response
    return NextResponse.json({
      success: false,
      insights: 'AI insights temporarily unavailable. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
