import { useTasks } from '../../hooks/useTasks';
import { useContacts } from '../../hooks/useContacts';
import { useTransactions } from '../../hooks/useTransactions';
import { Task } from '../../types';

export function DashboardStats() {
  const { tasks = [] } = useTasks();
  const { data: contacts = [] } = useContacts();
  const { data: transactions = [] } = useTransactions();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalContacts = contacts.length;
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Tasks Card */}
      <div className="bg-purple-50 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-purple-600 truncate">Total de Tarefas</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-purple-900">{totalTasks}</div>
                  <div className="ml-2 text-sm text-purple-600">
                    ({completedTasks} concluídas)
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Contacts Card */}
      <div className="bg-blue-50 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-blue-600 truncate">Total de Contatos</dt>
                <dd className="text-2xl font-semibold text-blue-900">{totalContacts}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="bg-emerald-50 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-emerald-600 truncate">Receita Total</dt>
                <dd className="text-2xl font-semibold text-emerald-900">
                  R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks by Status */}
      <div className="bg-orange-50 overflow-hidden rounded-lg shadow">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-orange-600 truncate">Tarefas por Status</dt>
                <dd className="mt-1">
                  <div className="space-y-1 text-sm">
                    {Object.entries(
                      tasks.reduce((acc, task) => {
                        acc[task.status] = (acc[task.status] || 0) + 1;
                        return acc;
                      }, {} as Record<Task['status'], number>)
                    ).map(([status, count]) => {
                      const statusTranslations: Record<string, string> = {
                        'backlog': 'Pendente',
                        'todo': 'A Fazer',
                        'in_progress': 'Em Andamento',
                        'done': 'Concluída'
                      };
                      return (
                        <div key={status} className="flex justify-between text-orange-800">
                          <span className="capitalize">{statusTranslations[status]}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
