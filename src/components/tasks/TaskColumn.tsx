import { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { StrictModeDroppable } from '../../components/dnd/StrictModeDroppable';

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onEditTask: (taskId: string, taskData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

export function TaskColumn({ title, tasks, status, onEditTask, onDeleteTask }: TaskColumnProps) {
  return (
    <div className="flex-1 min-w-[300px]">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-4">
          {title} ({tasks.length})
        </h3>
        <StrictModeDroppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[150px] transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-indigo-50' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </div>
    </div>
  );
}