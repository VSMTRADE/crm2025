import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Transaction } from '../types';

export function useTransactions() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data as Transaction[];
    },
  });

  const createTransaction = useMutation({
    mutationFn: async (transactionData: Omit<Transaction, 'id'>) => {
      console.log('Creating transaction with data:', transactionData);

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }

      console.log('Transaction created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      console.error('Error in createTransaction mutation:', error);
    },
  });

  return {
    data,
    isLoading,
    createTransaction,
  };
}