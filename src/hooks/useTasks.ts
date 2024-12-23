import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Task } from '../types';

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
  });

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: Task['status'] }) => {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createTask = useMutation({
    mutationFn: async (taskData: Omit<Task, 'id' | 'created_at' | 'created_by'>) => {
      console.log('Creating task with data:', JSON.stringify(taskData, null, 2));

      // Create a temporary ID for created_by since we don't have auth yet
      const tempUserId = '00000000-0000-0000-0000-000000000000';
      
      // Convert priority values if needed
      const convertPriority = (priority: string) => {
        console.log('Converting priority:', priority);
        const priorityMap: { [key: string]: string } = {
          'low': 'baixo',
          'medium': 'medio',
          'high': 'alto',
          'baixa': 'baixo',
          'media': 'medio',
          'alta': 'alto'
        };
        const convertedPriority = priorityMap[priority.toLowerCase()] || priority;
        console.log('Converted priority:', convertedPriority);
        return convertedPriority;
      };
      
      const taskToCreate = {
        ...taskData,
        priority: convertPriority(taskData.priority),
        created_by: tempUserId,
        due_date: taskData.due_date 
          ? new Date(taskData.due_date + 'T12:00:00').toISOString()
          : null,
      };

      console.log('Sending to Supabase:', JSON.stringify(taskToCreate, null, 2));
      
      const { data, error } = await supabase
        .from('tasks')
        .insert([taskToCreate])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      console.log('Task created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error in createTask mutation:', error);
    },
  });

  const editTask = useMutation({
    mutationFn: async ({ taskId, taskData }: { taskId: string; taskData: Partial<Task> }) => {
      console.log('Editing task:', { taskId, taskData });
      
      // Ajustar a data para meio-dia do dia selecionado (evita problemas com fuso horário)
      const formattedData = {
        ...taskData,
        due_date: taskData.due_date 
          ? new Date(taskData.due_date + 'T12:00:00').toISOString()
          : null,
      };
      
      console.log('Formatted data:', formattedData);
      
      const { data, error } = await supabase
        .from('tasks')
        .update(formattedData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) {
        console.error('Error editing task:', error);
        throw error;
      }

      console.log('Task edited:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Error in editTask mutation:', error);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    tasks,
    isLoading,
    updateTaskStatus,
    createTask,
    editTask,
    deleteTask,
  };
}