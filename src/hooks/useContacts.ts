import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Contact } from '../types';

export function useContacts() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Contact[];
    },
  });

  const createContact = useMutation({
    mutationFn: async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
      console.log('Creating contact with data:', contactData);
      
      // Ensure all required fields are present
      const contact = {
        name: contactData.name,
        email: contactData.email,
        type: contactData.type,
        status: contactData.status,
        phone: contactData.phone || null,
        company: contactData.company || null,
      };

      const { data, error } = await supabase
        .from('contacts')
        .insert([contact])
        .select()
        .single();

      if (error) {
        console.error('Error creating contact:', error);
        throw error;
      }

      console.log('Contact created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (error) => {
      console.error('Error in createContact mutation:', error);
    },
  });

  return {
    data,
    isLoading,
    createContact,
  };
}