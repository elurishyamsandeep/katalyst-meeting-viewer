// Server-side only AI service
export class AiService {
  private groq: any = null;

  constructor() {
    // Only initialize Groq on server-side
    if (typeof window === 'undefined') {
      try {
        const { Groq } = require('groq-sdk');
        this.groq = new Groq({
          apiKey: process.env.NEXT_PUBLIC_GROQ_API_KEY,
        });
      } catch (error) {
        console.warn('Groq SDK not available on server-side:', error);
      }
    }
  }

  async generateSummary(meeting: any): Promise<string> {
    if (typeof window !== 'undefined') {
      throw new Error('AiService can only be used server-side. Use API routes instead.');
    }

    if (!this.groq) {
      throw new Error('Groq not initialized on server-side');
    }

    try {
      const prompt = `Generate a concise summary for this meeting:
      Title: ${meeting.title}
      Duration: ${meeting.start} to ${meeting.end}
      Attendees: ${meeting.attendees?.map((a: any) => a.name).join(', ')}
      Description: ${meeting.description}
      
      Provide a brief, actionable summary.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 150,
      });

      return completion.choices[0]?.message?.content || 'Summary could not be generated.';
    } catch (error) {
      console.error('Error generating summary:', error);
      throw error;
    }
  }

  async generateInsights(meetings: any[]): Promise<string> {
    if (typeof window !== 'undefined') {
      throw new Error('AiService can only be used server-side. Use API routes instead.');
    }

    if (!this.groq) {
      throw new Error('Groq not initialized on server-side');
    }

    try {
      const prompt = `Analyze these ${meetings.length} meetings and provide insights:
      ${meetings.map(m => `- ${m.title} (${m.attendees?.length || 0} attendees)`).join('\n')}
      
      Provide patterns, trends, and actionable recommendations.`;

      const completion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192',
        temperature: 0.7,
        max_tokens: 200,
      });

      return completion.choices[0]?.message?.content || 'Insights could not be generated.';
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  }
}
