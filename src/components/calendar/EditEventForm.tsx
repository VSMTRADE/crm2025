import { useState } from 'react';
import { CalendarEvent } from '../../types';

interface EditEventFormProps {
  event: CalendarEvent;
  onEditEvent: (eventId: string, event: Partial<CalendarEvent>) => Promise<void>;
  onDelete?: (eventId: string) => Promise<void>;
  onCancel: () => void;
}

export function EditEventForm({ event, onEditEvent, onDelete, onCancel }: EditEventFormProps) {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    start_time: new Date(event.start_time).toISOString().slice(0, 16),
    end_time: new Date(event.end_time).toISOString().slice(0, 16),
    meet_link: event.meet_link || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onEditEvent(event.id, formData);
      onCancel();
    } catch (error) {
      console.error('Erro ao editar evento:', error);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await onDelete(event.id);
        onCancel();
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
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
        <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
          Início
        </label>
        <input
          type="datetime-local"
          name="start_time"
          id="start_time"
          required
          value={formData.start_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
          Término
        </label>
        <input
          type="datetime-local"
          name="end_time"
          id="end_time"
          required
          value={formData.end_time}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="meet_link" className="block text-sm font-medium text-gray-700">
          Link da Reunião
        </label>
        <input
          type="url"
          name="meet_link"
          id="meet_link"
          placeholder="https://meet.google.com/xxx-yyyy-zzz"
          value={formData.meet_link}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <p className="mt-1 text-sm text-gray-500">
          Cole aqui o link do Google Meet (opcional)
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex justify-center py-2 px-4 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Excluir
        </button>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  );
}
