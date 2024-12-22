import { useTasks } from '../../hooks/useTasks';
import { useContacts } from '../../hooks/useContacts';
import { useTransactions } from '../../hooks/useTransactions';

export function DashboardContent() {
  const { tasks = [] } = useTasks();
  const { data: contacts = [] } = useContacts();
  const { data: transactions = [] } = useTransactions();

  // Cálculos
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'backlog').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const doneTasks = tasks.filter(task => task.status === 'done').length;

  const clients = contacts.filter(contact => contact.type === 'cliente').length;
  const partners = contacts.filter(contact => contact.type === 'parceiro').length;
  const leads = contacts.filter(contact => contact.type === 'lead').length;

  const revenue = transactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0);
  const profit = revenue - expenses;

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {/* Cartão de Tarefas */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Tarefas</h3>
        <div className="text-3xl font-bold text-gray-900">{totalTasks}</div>
        <div className="text-sm text-green-600 mt-2">+2 novas</div>
      </div>

      {/* Cartão de Contatos */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Contatos Ativos</h3>
        <div className="text-3xl font-bold text-gray-900">{contacts.length}</div>
        <div className="text-sm text-green-600 mt-2">+5 novos</div>
      </div>

      {/* Cartão de Receita */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Receita Mensal</h3>
        <div className="text-3xl font-bold text-gray-900">
          R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
        <div className="text-sm text-green-600 mt-2">+8%</div>
      </div>

      {/* Cartão de Tarefas Pendentes */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Tarefas Pendentes</h3>
        <div className="text-3xl font-bold text-gray-900">{pendingTasks}</div>
        <div className="text-sm text-red-600 mt-2">-1</div>
      </div>

      {/* Visão Geral das Tarefas */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Visão Geral das Tarefas</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>A Fazer</span>
            <span className="font-semibold">{todoTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Em Andamento</span>
            <span className="font-semibold">{inProgressTasks}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Concluídas</span>
            <span className="font-semibold">{doneTasks}</span>
          </div>
        </div>
      </div>

      {/* Visão Geral dos Contatos */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Visão Geral dos Contatos</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Clientes</span>
            <span className="font-semibold">{clients}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Parceiros</span>
            <span className="font-semibold">{partners}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Leads</span>
            <span className="font-semibold">{leads}</span>
          </div>
        </div>
      </div>

      {/* Visão Geral Financeira */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Visão Geral Financeira</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Receita</span>
            <span className="font-semibold text-green-600">
              R$ {revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Despesas</span>
            <span className="font-semibold text-red-600">
              R$ {expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span>Lucro</span>
            <span className="font-semibold text-blue-600">
              R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Próximos Eventos */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
        <div className="space-y-4">
          <div>
            <div className="font-medium">Reunião com Cliente</div>
            <div className="text-sm text-gray-500">Hoje às 14:00</div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              Entrar na Reunião
            </a>
          </div>
          <div>
            <div className="font-medium">Revisão do Projeto</div>
            <div className="text-sm text-gray-500">Amanhã às 10:00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
