import { format } from 'date-fns';
import { CalendarEvent } from '../../types';
import { dateLocale } from '../../lib/date';

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarDay({ date, events, isCurrentMonth, isToday, onEventClick }: CalendarDayProps) {
  return (
    <div
      className={`min-h-[100px] p-2 border border-gray-200 ${
        !isCurrentMonth ? 'bg-gray-50' : 'bg-white'
      }`}
    >
      <div className="flex justify-between items-center mb-1">
        <span
          className={`text-sm ${
            isToday
              ? 'bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center'
              : isCurrentMonth
              ? 'text-gray-900'
              : 'text-gray-400'
          }`}
        >
          {format(date, 'd')}
        </span>
      </div>
      
      <div className="space-y-1">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className="text-xs p-1 bg-indigo-50 text-indigo-700 rounded cursor-pointer hover:bg-indigo-100"
          >
            <div className="font-medium truncate">{event.title}</div>
            <div className="text-indigo-500">
              {format(new Date(event.start_time), 'HH:mm', { locale: dateLocale })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}