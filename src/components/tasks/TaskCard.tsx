import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Task } from '../../types';
import { EditTaskForm } from '../kanban/EditTaskForm';

interface TaskCardProps {
  task: Task;
  index: number;
  onEditTask: (taskId: string, taskData: Partial<Task>) => void;
}

export function TaskCard({ task, index, onEditTask }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const priorityColors = {
    baixo: 'bg-blue-100 text-blue-800',
    medio: 'bg-yellow-100 text-yellow-800',
    alto: 'bg-red-100 text-red-800'
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
          } hover:shadow-md cursor-pointer`}
          onClick={() => setIsEditing(true)}
        >
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
              {task.priority === 'baixo' ? 'Baixo' : task.priority === 'medio' ? 'Médio' : 'Alto'}
            </span>
            {task.due_date && (
              <span className="text-xs text-gray-500">
                {new Date(task.due_date).toLocaleDateString('pt-BR')}
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