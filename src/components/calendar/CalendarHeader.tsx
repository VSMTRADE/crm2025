import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dateLocale } from '../../lib/date';

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({ currentDate, onPrevMonth, onNextMonth }: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <button
        onClick={onPrevMonth}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
      
      <h2 className="text-lg font-semibold text-gray-900">
        {format(currentDate, 'MMMM yyyy', { locale: dateLocale })}
      </h2>
      
      <button
        onClick={onNextMonth}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <ChevronRight className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
}