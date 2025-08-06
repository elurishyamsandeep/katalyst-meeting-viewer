import { CalendarEvent } from '../../types/calendar';
import { formatDate, formatTime, calculateDuration } from '../../lib/utils/dateFormatters';

interface MeetingCardProps {
  meeting: CalendarEvent;
  isPast?: boolean;
}

export function MeetingCard({ meeting, isPast = false }: MeetingCardProps) {
  const duration = calculateDuration(meeting.start, meeting.end);
  const startDate = new Date(meeting.start);
  const attendeeCount = meeting.attendees.length;

  return (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      isPast 
        ? 'border-gray-200 bg-gray-50' 
        : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate mb-1">
            {meeting.title}
          </h4>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(startDate)}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{formatTime(startDate)} ({duration})</span>
            </div>
            
            {attendeeCount > 0 && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                <span>{attendeeCount} attendee{attendeeCount !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {meeting.location && (
            <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{meeting.location}</span>
            </div>
          )}

          {/* Simple description display - no labels, no AI mentions */}
          {meeting.description && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 line-clamp-2">
                {meeting.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 ml-4">
          {meeting.meetingUrl && !isPast && (
            <a
              href={meeting.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors"
            >
              Join
            </a>
          )}
          
          {isPast && (
            <div className="text-xs text-green-600 font-medium">
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
