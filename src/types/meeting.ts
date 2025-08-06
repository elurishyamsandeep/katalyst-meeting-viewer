export interface Meeting {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  attendees: string[];
  description?: string;
  location?: string;
  duration: number; // in minutes
}

export interface User {
  email: string;
  name: string;
  picture: string;
  accessToken: string;
}
