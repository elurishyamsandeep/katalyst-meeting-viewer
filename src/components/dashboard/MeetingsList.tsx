import { CalendarEvent } from '../../types/calendar';
import { MeetingCard } from './MeetingCard';

interface MeetingsListProps {
  title: string;
  meetings: CalendarEvent[];
  emptyMessage: string;
  isPast?: boolean;
}

export function MeetingsList({ title, meetings, emptyMessage, isPast = false }: MeetingsListProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        {meetings.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <MeetingCard 
                key={meeting.id} 
                meeting={meeting} 
                isPast={isPast}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
