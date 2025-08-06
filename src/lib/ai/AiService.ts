import OpenAI from 'openai';
import { CalendarEvent } from '../../types/calendar';

export class AiService {
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY,
      baseURL: 'https://api.perplexity.ai',
      dangerouslyAllowBrowser: true
    });
  }

  async generateSummary(meeting: CalendarEvent): Promise<string> {
    try {
      const prompt = this.createPrompt(meeting);
      const response = await this.client.chat.completions.create({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates professional concise meeting summaries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.3,
        stream: false
      });

      const content = response.choices?.[0]?.message?.content || response.choices?.[0]?.message || response.choices?.[0]?.text;
      if (content && typeof content === 'string' && content.trim().length > 0) {
        return content.trim();
      }
      return this.createFallback(meeting);
    } catch (error) {
      console.error('Error generating summary:', error);
      return this.createFallback(meeting);
    }
  }

  private createPrompt(meeting: CalendarEvent): string {
    const start = new Date(meeting.start).toLocaleString();
    const end = new Date(meeting.end).toLocaleString();
    const duration = this.calculateDurationMinutes(meeting.start, meeting.end);
    const attendees = meeting.attendees.length > 0 ? meeting.attendees.map(a => a.name || a.email).join(', ') : 'No attendees listed';
    const organizer = meeting.organizer?.displayName || meeting.organizer?.email || 'Unspecified';
    const location = meeting.location || 'Unspecified';

    return `
Please generate a professional concise summary for the following meeting details:

Title: ${meeting.title}
Start Time: ${start}
End Time: ${end}
Duration: ${duration} minutes
Attendees: ${attendees}
Organizer: ${organizer}
Location: ${location}
Description: ${meeting.description || 'No description'}
Meeting URL: ${meeting.meetingUrl || 'No URL'}

Provide the summary in one well-written paragraph.
    `;
  }

  private calculateDurationMinutes(start: string, end: string): number {
    return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  }

  private createFallback(meeting: CalendarEvent): string {
    const duration = this.calculateDurationMinutes(meeting.start, meeting.end);
    const attendees = meeting.attendees.length;
    return `${meeting.title}, a meeting with ${attendees} attendee${attendees !== 1 ? 's' : ''}, lasted for ${duration} minutes.`;
  }
}
