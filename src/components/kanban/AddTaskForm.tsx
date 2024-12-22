import { useState } from 'react';
import { Task } from '../../types';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'created_at' | 'created_by'>) => void;
}

export function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medio' as Task['priority'],
    assigned_to: '',
    due_date: '',
    status: 'todo' as Task['status'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    const taskData = {
      ...formData,
      assigned_to: formData.assigned_to || undefined,
      due_date: formData.due_date || undefined,
    };
    
    console.log('Sending task data:', taskData);
    onAddTask(taskData);
    setFormData({
      title: '',
      description: '',
      priority: 'medio',
      assigned_to: '',
      due_date: '',
      status: 'todo',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Título
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Prioridade
        </label>
        <select
          name="priority"
          id="priority"
          required
          value={formData.priority}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
        </select>
      </div>

      <div>
        <label htmlFor="assigned_to" className="block text-sm font-medium text-gray-700">
          Atribuído a
        </label>
        <input
          type="text"
          name="assigned_to"
          id="assigned_to"
          value={formData.assigned_to}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
          Data de Entrega
        </label>
        <input
          type="date"
          name="due_date"
          id="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Criar Tarefa
        </button>
      </div>
    </form>
  );
}
