import { useState } from 'react';
import { Plus } from 'lucide-react';
import { addMonths, subMonths } from 'date-fns';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { CalendarHeader } from '../components/calendar/CalendarHeader';
import { CalendarGrid } from '../components/calendar/CalendarGrid';
import { AddEventForm } from '../components/calendar/AddEventForm';
import { EditEventForm } from '../components/calendar/EditEventForm';
import { CalendarEvent } from '../types';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const { data: events = [], isLoading, createEvent, updateEvent, deleteEvent } = useCalendarEvents();

  const handlePrevMonth = () => setCurrentDate(date => subMonths(date, 1));
  const handleNextMonth = () => setCurrentDate(date => addMonths(date, 1));

  const handleAddEvent = async (eventData: Omit<CalendarEvent, 'id'>) => {
    try {
      await createEvent.mutateAsync(eventData);
      console.log('Event created successfully');
      setIsAddEventOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleEditEvent = async (eventId: string, eventData: Partial<CalendarEvent>) => {
    try {
      await updateEvent.mutateAsync({ id: eventId, data: eventData });
      console.log('Event updated successfully');
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent.mutateAsync(eventId);
      console.log('Event deleted successfully');
      setEditingEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Calendário</h1>
        <button
          onClick={() => setIsAddEventOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </button>
      </div>

      {isAddEventOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Novo Evento</h2>
              <button
                onClick={() => setIsAddEventOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <AddEventForm onAddEvent={handleAddEvent} onCancel={() => setIsAddEventOpen(false)} />
          </div>
        </div>
      )}

      {editingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Editar Evento</h2>
              <button
                onClick={() => setEditingEvent(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <EditEventForm 
              event={editingEvent}
              onEditEvent={handleEditEvent}
              onDelete={handleDeleteEvent}
              onCancel={() => setEditingEvent(null)}
            />
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
        />
      </div>
    </div>
  );
}