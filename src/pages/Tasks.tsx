import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { TaskColumn } from '../components/tasks/TaskColumn';
import { useTasks } from '../hooks/useTasks';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { AddTaskForm } from '../components/kanban/AddTaskForm';
import { Task } from '../types';
import { StrictModeDroppable } from '../components/dnd/StrictModeDroppable';
import { toast } from 'react-toastify';
import { TaskCard } from '../components/tasks/TaskCard';

const columns = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'todo', title: 'A Fazer' },
  { id: 'in_progress', title: 'Em Progresso' },
  { id: 'done', title: 'Concluído' },
] as const;

export default function Tasks() {
  const { tasks, isLoading, updateTaskStatus, createTask, editTask } = useTasks();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped in its original position
    if (!destination || (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )) {
      return;
    }

    console.log('Moving task:', {
      taskId: draggableId,
      from: source.droppableId,
      to: destination.droppableId,
      fromIndex: source.index,
      toIndex: destination.index
    });

    const newStatus = destination.droppableId as typeof columns[number]['id'];
    updateTaskStatus.mutate({
      taskId: draggableId,
      status: newStatus,
    });
  };

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'created_by'>) => {
    console.log('Adding task:', taskData);
    try {
      await createTask.mutateAsync({
        ...taskData,
        status: taskData.status || 'todo',
      });
      console.log('Task created successfully');
      setIsAddTaskOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = async (taskId: string, taskData: Partial<Task>) => {
    console.log('Editing task:', { taskId, taskData });
    try {
      await editTask.mutateAsync({ taskId, taskData });
      toast.success('Tarefa atualizada com sucesso');
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Erro ao atualizar tarefa: ' + (error as Error).message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tarefas</h1>
        <button 
          onClick={() => setIsAddTaskOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </button>
      </div>

      {isAddTaskOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Nova Tarefa</h2>
              <button
                onClick={() => setIsAddTaskOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <AddTaskForm onAddTask={handleAddTask} />
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div key={column.id} className="flex-1 min-w-[300px]">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">
                  {column.title} ({tasks.filter(task => task.status === column.id).length})
                </h3>
                <StrictModeDroppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[150px] transition-colors duration-200 ${
                        snapshot.isDraggingOver ? 'bg-indigo-50' : ''
                      }`}
                    >
                      {tasks
                        .filter(task => task.status === column.id)
                        .map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            index={index}
                            onEditTask={handleEditTask}
                          />
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </StrictModeDroppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}