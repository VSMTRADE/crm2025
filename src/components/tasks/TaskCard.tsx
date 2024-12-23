import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../../types';
import { EditTaskForm } from '../kanban/EditTaskForm';
import { Trash2, Edit2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  index: number;
  onEditTask: (taskId: string, taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskCard({ task, index, onEditTask, onDeleteTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const priorityColors = {
    baixo: 'bg-blue-100 text-blue-800',
    medio: 'bg-yellow-100 text-yellow-800',
    alto: 'bg-red-100 text-red-800'
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para o card
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      onDeleteTask(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita que o clique propague para o card
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
        <EditTaskForm
          task={task}
          onEditTask={(taskId, taskData) => {
            onEditTask(taskId, taskData);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3 transition-shadow duration-200 mb-5 ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-indigo-500 ring-opacity-50' : ''
          } hover:shadow-md`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                title="Editar tarefa"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Excluir tarefa"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}

          <div className="flex items-center justify-between">
            <span
              className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {task.due_date && (
              <span className="text-xs text-gray-500">
                {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
          {task.assigned_to && (
            <div className="text-xs text-gray-500">
              Atribuído a: {task.assigned_to}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}