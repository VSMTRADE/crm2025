import { useTasks } from '../../hooks/useTasks';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RecentTasks() {
  const { tasks = [] } = useTasks();
  const recentTasks = tasks.slice(0, 5);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alto':
        return 'text-red-600 bg-red-50';
      case 'medio':
        return 'text-yellow-600 bg-yellow-50';
      case 'baixo':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'alto':
        return 'Alto';
      case 'medio':
        return 'Médio';
      case 'baixo':
        return 'Baixo';
      default:
        return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'text-green-600 bg-green-50';
      case 'in_progress':
        return 'text-blue-600 bg-blue-50';
      case 'todo':
        return 'text-yellow-600 bg-yellow-50';
      case 'backlog':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'done':
        return 'Concluída';
      case 'in_progress':
        return 'Em Andamento';
      case 'todo':
        return 'A Fazer';
      case 'backlog':
        return 'Pendente';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Tarefas Recentes
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentTasks.map((task) => (
          <div key={task.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}>
                  {getPriorityText(task.priority)}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                  {getStatusText(task.status)}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-900">{task.title}</p>
            </div>
            <div className="mt-2">
              <div className="sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <span>
                      {task.description
                        ? task.description.length > 100
                          ? task.description.substring(0, 100) + '...'
                          : task.description
                        : 'Sem descrição'}
                    </span>
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    {task.due_date
                      ? `Vence em ${format(new Date(task.due_date), "d 'de' MMMM", { locale: ptBR })}`
                      : 'Sem data de vencimento'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {recentTasks.length === 0 && (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            Nenhuma tarefa encontrada
          </div>
        )}
      </div>
    </div>
  );
}
