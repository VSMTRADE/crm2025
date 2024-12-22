import { memo } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  id: string;
}

const TaskColumn = memo(({ title, tasks, id }: TaskColumnProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg min-w-[300px] w-full">
      <h3 className="font-medium text-gray-900 mb-4">{title} ({tasks.length})</h3>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[200px] transition-colors duration-200 ${
              snapshot.isDraggingOver ? 'bg-indigo-50' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
});

TaskColumn.displayName = 'TaskColumn';

export { TaskColumn };