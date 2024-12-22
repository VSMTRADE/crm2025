import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { CalendarEvent } from '../types';

export function useCalendarEvents() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as CalendarEvent[];
    },
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: Omit<CalendarEvent, 'id'>) => {
      console.log('Creating event with data:', eventData);
      
      // Format the dates as ISO strings
      const event = {
        ...eventData,
        start_time: new Date(eventData.start_time).toISOString(),
        end_time: new Date(eventData.end_time).toISOString(),
      };

      const { data, error } = await supabase
        .from('calendar_events')
        .insert([event])
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      console.log('Event created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (error) => {
      console.error('Error in createEvent mutation:', error);
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, data: eventData }: { id: string; data: Partial<CalendarEvent> }) => {
      console.log('Updating event:', id, 'with data:', eventData);
      
      // Format the dates as ISO strings if they exist
      const event = {
        ...eventData,
        ...(eventData.start_time && {
          start_time: new Date(eventData.start_time).toISOString(),
        }),
        ...(eventData.end_time && {
          end_time: new Date(eventData.end_time).toISOString(),
        }),
      };

      const { data, error } = await supabase
        .from('calendar_events')
        .update(event)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      console.log('Event updated:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (error) => {
      console.error('Error in updateEvent mutation:', error);
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting event:', id);
      
      const { error } = await supabase
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }

      console.log('Event deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (error) => {
      console.error('Error in deleteEvent mutation:', error);
    },
  });

  return {
    data,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}