export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  attendees: Attendee[];
  description: string;
  location: string;
  meetingUrl?: string;
  organizer?: {
    email: string;
    displayName?: string;
  };
}

export interface Attendee {
  email: string;
  name: string;
  responseStatus: 'accepted' | 'declined' | 'tentative' | 'needsAction';
}

export interface CalendarApiResponse {
  kind: string;
  etag: string;
  summary: string;
  items: any[];
}

export interface MeetingSummary {
  totalMeetings: number;
  totalHours: number;
  topAttendees: string[];
  meetingTypes: {
    video: number;
    inPerson: number;
    phone: number;
  };
}
