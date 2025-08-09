'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, TrendingUp, Flag, Users, Clock, MapPin, Video, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCalendarData } from '../../hooks/useCalendarData';
import { Header } from '../layout/Header';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export function Dashboard() {
  const { user, mcpService } = useAuth();
  const { upcomingMeetings, pastMeetings, isLoading, error } = useCalendarData();
  const [authenticationStatus, setAuthenticationStatus] = useState<'checking' | 'authenticated' | 'not_authenticated'>('checking');
  const [priorityHighlighted, setPriorityHighlighted] = useState<Set<string>>(new Set());
  const [meetingInsights, setMeetingInsights] = useState<Record<string, string>>({});

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/mcp/authenticate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'auth' })
        });

        const result = await response.json();
        
        if (result.success && result.realAuthentication) {
          setAuthenticationStatus('authenticated');
        } else {
          setAuthenticationStatus('not_authenticated');
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
        setAuthenticationStatus('not_authenticated');
      }
    };

    checkAuthStatus();
  }, []);

  // Generate AI insights for individual meetings
  useEffect(() => {
    const generateMeetingInsights = async () => {
      if (authenticationStatus === 'authenticated' && mcpService) {
        const allMeetings = [...upcomingMeetings, ...pastMeetings];
        
        for (const meeting of allMeetings.slice(0, 8)) {
          if (!meetingInsights[meeting.id]) {
            try {
              const insight = await mcpService.generateMeetingSummary(meeting);
              setMeetingInsights(prev => ({
                ...prev,
                [meeting.id]: insight
              }));
            } catch (error) {
              console.error(`Failed to generate insight for meeting ${meeting.id}:`, error);
            }
          }
        }
      }
    };

    if (upcomingMeetings.length > 0 || pastMeetings.length > 0) {
      generateMeetingInsights();
    }
  }, [upcomingMeetings, pastMeetings, mcpService, authenticationStatus]);

  if (authenticationStatus === 'not_authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Please Sign In to Access Your Calendar
            </h2>
            <button 
              onClick={() => window.location.href = '/'} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || authenticationStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
            <LoadingSpinner size="large" />
            <p className="mt-3 text-gray-600 text-sm">Loading your calendar data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl hover:scale-105">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              Failed to Load Calendar Data
            </h2>
            <p className="text-gray-600 mb-3 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatMeetingTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    
    return {
      date: format(start, 'MMM d'),
      time: format(start, 'h:mm a'),
      duration: `${duration}m`
    };
  };

  const togglePriorityHighlight = (meetingId: string) => {
    setPriorityHighlighted(prev => {
      const newSet = new Set(prev);
      if (newSet.has(meetingId)) {
        newSet.delete(meetingId);
      } else {
        newSet.add(meetingId);
      }
      return newSet;
    });
  };

  // Compact Meeting Card with Fixed Z-Index and Better Spacing
  const MeetingCard = ({ meeting, isPast = false }: { meeting: any; isPast?: boolean }) => {
    const timeInfo = formatMeetingTime(meeting.start, meeting.end);
    const insight = meetingInsights[meeting.id];
    const isHighlighted = priorityHighlighted.has(meeting.id);
    
    return (
      <div className={`relative bg-white rounded-lg border p-3 shadow-md transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] group cursor-pointer min-w-[280px] max-w-[300px] flex-shrink-0 hover:z-20 ${
        isHighlighted 
          ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50 shadow-red-100' 
          : 'border-gray-200 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50'
      }`}>
        
        {/* Priority Icon - Smaller and Better Positioned */}
        <div 
          className={`absolute top-2 right-2 cursor-pointer p-1 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-6 active:scale-95 z-30 ${
            isHighlighted ? 'bg-red-100 hover:bg-red-200' : 'bg-gray-100 hover:bg-red-100'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            togglePriorityHighlight(meeting.id);
          }}
          title="Mark as Priority"
        >
          <Flag 
            className={`w-3 h-3 transition-all duration-300 ${
              isHighlighted 
                ? 'text-red-600 fill-red-600 animate-pulse' 
                : 'text-gray-400 hover:text-red-500'
            }`} 
          />
        </div>

        {/* Meeting Content - Tighter Spacing */}
        <div className="pr-6">
          {/* Meeting Header - Compact */}
          <div className="mb-2">
            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">{meeting.title}</h3>
            <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
              <div className="flex items-center space-x-1 bg-blue-100 px-2 py-0.5 rounded-full">
                <Calendar className="w-3 h-3 text-blue-600" />
                <span className="font-medium text-blue-700">{timeInfo.date}</span>
              </div>
              <div className="flex items-center space-x-1 bg-green-100 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3 text-green-600" />
                <span className="font-medium text-green-700">{timeInfo.time}</span>
              </div>
            </div>
            {isPast && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-sm">
                ✅ Done
              </span>
            )}
          </div>

          {/* Meeting Details - More Compact */}
          <div className="space-y-1 mb-2">
            {meeting.location && (
              <div className="flex items-center space-x-1 text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                <MapPin className="w-3 h-3 text-purple-600 flex-shrink-0" />
                <span className="truncate font-medium">{meeting.location}</span>
              </div>
            )}
            
            {meeting.meetingUrl && (
              <div className="flex items-center space-x-1 bg-blue-50 px-2 py-1 rounded">
                <Video className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <a 
                  href={meeting.meetingUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-700 hover:text-blue-900 underline truncate font-medium transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  Join Meeting
                </a>
              </div>
            )}

            {meeting.attendees && meeting.attendees.length > 0 && (
              <div className="flex items-center space-x-1 text-xs text-gray-700 bg-orange-50 px-2 py-1 rounded">
                <Users className="w-3 h-3 text-orange-600" />
                <span className="font-medium text-orange-700">{meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* AI-Generated Insights - More Space, Better Layout */}
          {insight ? (
            <div className="mt-2 p-3 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-1 mb-2">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                <span className="text-xs font-semibold text-purple-700">AI Insight</span>
              </div>
              <div className="max-h-20 overflow-y-auto scrollbar-hide">
                <p className="text-xs text-gray-800 leading-relaxed font-medium">
                  {insight}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-1">
                <div className="animate-spin rounded-full h-3 w-3 border border-purple-200 border-t-purple-600"></div>
                <span className="text-xs text-gray-600 font-medium">Generating...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate meeting counts
  const priorityMeetings = [...upcomingMeetings, ...pastMeetings].filter(meeting => 
    priorityHighlighted.has(meeting.id)
  );

  // Compact Stats Card
  const StatsCard = ({ icon: Icon, title, count, color, bgColor, gradientFrom, gradientTo }: {
    icon: any;
    title: string;
    count: number;
    color: string;
    bgColor: string;
    gradientFrom: string;
    gradientTo: string;
  }) => (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg border border-white shadow-md p-4 transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02] group cursor-pointer relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full transform translate-x-6 -translate-y-6"></div>
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold text-white/90 mb-1">{title}</p>
          <p className="text-2xl font-black text-white">{count}</p>
        </div>
        <div className={`w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 transform group-hover:rotate-6 group-hover:scale-110`}>
          <Icon className={`w-4 h-4 text-white`} />
        </div>
      </div>
    </div>
  );

  // Horizontal Scroll Section - Reduced Space
  const HorizontalMeetingSection = ({ 
    title, 
    meetings, 
    icon: Icon, 
    iconColor, 
    badgeColor,
    badgeTextColor,
    isPast = false 
  }: {
    title: string;
    meetings: any[];
    icon: any;
    iconColor: string;
    badgeColor: string;
    badgeTextColor: string;
    isPast?: boolean;
  }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`w-6 h-6 ${badgeColor} rounded-lg flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${badgeColor} ${badgeTextColor} shadow-sm`}>
            {meetings.length}
          </span>
        </div>
      </div>
      
      {/* Fixed height container with proper z-index management */}
      <div className="relative z-10">
        <div className="overflow-x-auto scrollbar-hide pb-2" style={{ scrollPaddingTop: '20px', scrollPaddingBottom: '20px' }}>
          <div className="flex space-x-4" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
            {meetings.length > 0 ? (
              meetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} isPast={isPast} />
              ))
            ) : (
              <div className="min-w-[280px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border border-gray-300 p-6 text-center flex-shrink-0 shadow-md">
                <Icon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-medium">No {title.toLowerCase()} found</p>
                <p className="text-xs text-gray-500 mt-1">Check back later</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Scroll indicators */}
        {meetings.length > 2 && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none rounded-r-lg z-20"></div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Compact Welcome Section */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Your smart calendar with AI insights. Click the flag to prioritize meetings.
          </p>
        </div>

        {/* Compact Stats Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            icon={Calendar}
            title="Upcoming"
            count={upcomingMeetings.length}
            color="text-blue-600"
            bgColor="bg-blue-100"
            gradientFrom="from-blue-500"
            gradientTo="to-blue-600"
          />
          <StatsCard
            icon={TrendingUp}
            title="Past"
            count={pastMeetings.length}
            color="text-green-600"
            bgColor="bg-green-100"
            gradientFrom="from-green-500"
            gradientTo="to-emerald-600"
          />
          <StatsCard
            icon={Flag}
            title="Priority"
            count={priorityMeetings.length}
            color="text-red-600"
            bgColor="bg-red-100"
            gradientFrom="from-red-500"
            gradientTo="to-pink-600"
          />
        </div>

        {/* Priority Meetings */}
        {priorityMeetings.length > 0 && (
          <HorizontalMeetingSection
            title="🚩 Priority Meetings"
            meetings={priorityMeetings}
            icon={Flag}
            iconColor="text-white"
            badgeColor="bg-red-500"
            badgeTextColor="text-white"
            isPast={false}
          />
        )}

        {/* Upcoming Meetings */}
        <HorizontalMeetingSection
          title="📅 Upcoming Meetings"
          meetings={upcomingMeetings}
          icon={Calendar}
          iconColor="text-white"
          badgeColor="bg-blue-500"
          badgeTextColor="text-white"
          isPast={false}
        />

        {/* Past Meetings */}
        <HorizontalMeetingSection
          title="📈 Past Meetings"
          meetings={pastMeetings}
          icon={TrendingUp}
          iconColor="text-white"
          badgeColor="bg-green-500"
          badgeTextColor="text-white"
          isPast={true}
        />
      </main>
    </div>
  );
}
