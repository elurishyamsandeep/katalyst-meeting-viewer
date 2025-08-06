export interface MeetingSummary {
  meetingId: string;
  summary: string;
  generatedAt: Date;
  isLoading: boolean;
  error: string | null;
}

export interface MeetingInsights {
  insights: string;
  generatedAt: Date;
  isLoading: boolean;
  error: string | null;
}
