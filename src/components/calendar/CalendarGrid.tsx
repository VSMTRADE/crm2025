import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from 'date-fns';
import { CalendarDay } from './CalendarDay';
import { CalendarEvent } from '../../types';
import { dateLocale } from '../../lib/date';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({ currentDate, events, onEventClick }: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const weekDays = eachDayOfInterval({
    start: calendarStart,
    end: endOfWeek(calendarStart),
  });

  return (
    <div>
      <div className="grid grid-cols-7 gap-px mb-1">
        {weekDays.map((day) => (
          <div key={day.toString()} className="text-sm font-medium text-gray-900 text-center py-2">
            {format(day, 'EEEEEE', { locale: dateLocale })}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map((day) => {
          const dayEvents = events.filter((event) => {
            const eventDate = new Date(event.start_time);
            return (
              eventDate.getDate() === day.getDate() &&
              eventDate.getMonth() === day.getMonth() &&
              eventDate.getFullYear() === day.getFullYear()
            );
          });

          return (
            <CalendarDay
              key={day.toString()}
              date={day}
              events={dayEvents}
              isCurrentMonth={isSameMonth(day, currentDate)}
              isToday={isToday(day)}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
}