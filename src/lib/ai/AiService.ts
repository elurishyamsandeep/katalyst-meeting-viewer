import { Groq } from 'groq-sdk';
import { CalendarEvent } from '../../types/calendar';

export class AiService {
  private client: Groq;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      throw new Error('Groq API key is required. Please set NEXT_PUBLIC_GROQ_API_KEY or GROQ_API_KEY in your environment variables.');
    }

    this.client = new Groq({
      apiKey: apiKey,
    });
  }

  async generateSummary(meeting: CalendarEvent): Promise<string> {
    try {
      const prompt = this.createPrompt(meeting);
      
      const response = await this.client.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
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
        stream: false,
      });

      const content = response.choices?.[0]?.message?.content;
      
      if (content && content.trim().length > 0) {
        return content.trim();
      }
      
      return this.createFallback(meeting);
    } catch (error) {
      console.error('Groq API error generating summary:', error);
      return this.createFallback(meeting);
    }
  }

  async generateInsights(meetings: CalendarEvent[]): Promise<string> {
    try {
      const prompt = this.createInsightsPrompt(meetings);
      
      const response = await this.client.chat.completions.create({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that analyzes meeting patterns and provides actionable insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 400,
        temperature: 0.3,
        stream: false,
      });

      const content = response.choices?.[0]?.message?.content;
      
      if (content && content.trim().length > 0) {
        return content.trim();
      }
      
      return this.createInsightsFallback(meetings);
    } catch (error) {
      console.error('Groq API error generating insights:', error);
      return this.createInsightsFallback(meetings);
    }
  }

  private createPrompt(meeting: CalendarEvent): string {
    const start = new Date(meeting.start).toLocaleString();
    const end = new Date(meeting.end).toLocaleString();
    const duration = this.calculateDurationMinutes(meeting.start, meeting.end);
    const attendees = meeting.attendees.length > 0 
      ? meeting.attendees.map(a => a.name || a.email).join(', ') 
      : 'No attendees listed';
    const organizer = meeting.organizer?.displayName || meeting.organizer?.email || 'Unspecified';
    const location = meeting.location || 'Virtual';

    return `
Generate a professional meeting summary for:

Title: ${meeting.title}
Date: ${start} - ${end}
Duration: ${duration} minutes
Attendees: ${attendees}
Organizer: ${organizer}
Location: ${location}
Description: ${meeting.description || 'No description provided'}
${meeting.meetingUrl ? `Meeting URL: ${meeting.meetingUrl}` : ''}

Provide a concise, professional summary in one paragraph highlighting key details and purpose.
    `.trim();
  }

  private createInsightsPrompt(meetings: CalendarEvent[]): string {
    const meetingDetails = meetings.map(meeting => {
      const duration = this.calculateDurationMinutes(meeting.start, meeting.end);
      const attendeeCount = meeting.attendees.length;
      const date = new Date(meeting.start).toLocaleDateString();
      return `• ${meeting.title}: ${duration} min, ${attendeeCount} attendees, ${date}`;
    }).join('\n');

    const totalDuration = meetings.reduce((sum, meeting) => 
      sum + this.calculateDurationMinutes(meeting.start, meeting.end), 0
    );
    const totalAttendees = meetings.reduce((sum, m) => sum + m.attendees.length, 0);
    const avgDuration = Math.round(totalDuration / meetings.length);
    const avgAttendees = Math.round(totalAttendees / meetings.length);

    return `
Analyze these meetings and provide actionable insights:

MEETINGS:
${meetingDetails}

STATISTICS:
• Total meetings: ${meetings.length}
• Total time: ${totalDuration} minutes
• Average duration: ${avgDuration} minutes
• Average attendees: ${avgAttendees}
• Total participants: ${totalAttendees}

Provide 2-3 insights about meeting efficiency, patterns, and recommendations for improvement.
    `.trim();
  }

  private calculateDurationMinutes(start: string, end: string): number {
    return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  }

  private createFallback(meeting: CalendarEvent): string {
    const duration = this.calculateDurationMinutes(meeting.start, meeting.end);
    const attendees = meeting.attendees.length;
    return `${meeting.title}: ${duration}-minute meeting with ${attendees} attendee${attendees !== 1 ? 's' : ''}.`;
  }

  private createInsightsFallback(meetings: CalendarEvent[]): string {
    const totalDuration = meetings.reduce((sum, meeting) => 
      sum + this.calculateDurationMinutes(meeting.start, meeting.end), 0
    );
    const avgAttendees = Math.round(meetings.reduce((sum, m) => sum + m.attendees.length, 0) / meetings.length);
    const avgDuration = Math.round(totalDuration / meetings.length);
    
    return `Meeting analysis: ${meetings.length} meetings totaling ${totalDuration} minutes. Average duration: ${avgDuration} minutes with ${avgAttendees} attendees per meeting. Consider optimizing meeting efficiency.`;
  }
}
