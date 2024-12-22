import { useState } from 'react';
import { KanbanTask, KanbanColumn } from '../../types/kanban';

const initialColumns: KanbanColumn[] = [
  {
    id: 'todo',
    title: 'A Fazer',
    tasks: []
  },
  {
    id: 'in-progress',
    title: 'Em Progresso',
    tasks: []
  },
  {
    id: 'done',
    title: 'Concluído',
    tasks: []
  }
];

export default function KanbanBoard() {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

  const handleDragStart = (e: React.DragEvent, taskId: string, sourceColumn: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('sourceColumn', sourceColumn);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const sourceColumnId = e.dataTransfer.getData('sourceColumn');

    if (sourceColumnId === targetColumnId) return;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const sourceColumn = newColumns.find(col => col.id === sourceColumnId);
      const targetColumn = newColumns.find(col => col.id === targetColumnId);
      const taskToMove = sourceColumn?.tasks.find(task => task.id === taskId);

      if (sourceColumn && targetColumn && taskToMove) {
        sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== taskId);
        targetColumn.tasks = [...targetColumn.tasks, { ...taskToMove, status: targetColumnId as KanbanTask['status'] }];
      }

      return newColumns;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quadro Kanban</h1>
      <div className="flex gap-4">
        {columns.map(column => (
          <div
            key={column.id}
            className="bg-gray-100 p-4 rounded-lg w-80"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <h2 className="font-semibold mb-4">{column.title}</h2>
            <div className="space-y-2">
              {column.tasks.map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  className="bg-white p-3 rounded shadow cursor-move"
                >
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <span className="text-xs text-gray-500">{task.assignee}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
