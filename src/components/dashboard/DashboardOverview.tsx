import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useContacts } from '../../hooks/useContacts';
import { useTransactions } from '../../hooks/useTransactions';
import { useCalendar } from '../../hooks/useCalendar';
import { format, isToday, isTomorrow, isAfter, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function DashboardOverview() {
  const { tasks = [] } = useTasks();
  const { data: contacts = [] } = useContacts();
  const { data: transactions = [] } = useTransactions();
  const { events = [] } = useCalendar();

  // Cálculos para tarefas
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(task => task.status === 'backlog').length;
  const todoTasks = tasks.filter(task => task.status === 'todo').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const doneTasks = tasks.filter(task => task.status === 'done').length;

  // Cálculos para contatos
  const totalContacts = contacts.length;
  console.log('Todos os contatos:', contacts);
  
  const activeContacts = contacts.filter(contact => {
    console.log('Verificando contato:', contact);
    return contact.status === 'ativo';
  }).length;
  
  console.log('Contatos ativos:', activeContacts);
  const clients = contacts.filter(contact => contact.type === 'cliente').length;
  const partners = contacts.filter(contact => contact.type === 'parceiro').length;
  const leads = contacts.filter(contact => contact.type === 'lead').length;

  // Cálculos financeiros
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  console.log('Todas as transações:', transactions);

  const revenue = transactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);
  
  console.log('Receitas:', revenue);
  
  const expenses = transactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0);
  
  console.log('Despesas:', expenses);
  
  const profit = revenue - expenses;

  const pendingRevenue = transactions
    .filter(t => t.type === 'receita' && t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingExpenses = transactions
    .filter(t => t.type === 'despesa' && t.status === 'pendente')
    .reduce((sum, t) => sum + t.amount, 0);

  // Filtrar e ordenar próximos eventos
  const upcomingEvents = events
    .filter(event => isAfter(new Date(event.start_time), startOfDay(new Date())))
    .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
    .slice(0, 5); // Mostrar apenas os próximos 5 eventos

  const formatEventDate = (date: string) => {
    const eventDate = new Date(date);
    if (isToday(eventDate)) {
      return `Hoje às ${format(eventDate, 'HH:mm')}`;
    } else if (isTomorrow(eventDate)) {
      return `Amanhã às ${format(eventDate, 'HH:mm')}`;
    } else {
      return format(eventDate, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total de Tarefas</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold">{totalTasks}</div>
            <div className="text-green-500 text-sm">+2</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Contatos Ativos</h3>
          <div className="mt-2 flex items-baseline">
            <div className="text-2xl font-bold">{activeContacts}</div>
            <div className="ml-2 text-sm text-gray-600">de {totalContacts} contatos</div>
          </div>
          <div className="text-green-500 text-sm mt-1">
            {Math.round((activeContacts / totalContacts) * 100)}% ativos
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Receita Mensal</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(revenue)}</div>
            {pendingRevenue > 0 && (
              <div className="text-sm text-gray-500">
                +{formatCurrency(pendingRevenue)} a receber
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Tarefas Pendentes</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <div className="text-red-500 text-sm">-1</div>
          </div>
        </div>
      </div>

      {/* Visões Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Visão Geral das Tarefas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">A Fazer</span>
              <span className="font-semibold">{todoTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Em Andamento</span>
              <span className="font-semibold">{inProgressTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Concluídas</span>
              <span className="font-semibold">{doneTasks}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Visão Geral dos Contatos</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Clientes</span>
              <div>
                <span className="font-semibold">{clients}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((clients / totalContacts) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Parceiros</span>
              <div>
                <span className="font-semibold">{partners}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((partners / totalContacts) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Leads</span>
              <div>
                <span className="font-semibold">{leads}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((leads / totalContacts) * 100)}%)
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-gray-600">Ativos</span>
              <div>
                <span className="font-semibold">{activeContacts}</span>
                <span className="text-sm text-gray-500 ml-1">
                  ({Math.round((activeContacts / totalContacts) * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Visão Geral Financeira</h3>
          <div className="space-y-4">
            {/* Receitas */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Receitas</h4>
              <div className="flex justify-between items-baseline">
                <div className="text-xl font-semibold text-green-600">
                  {formatCurrency(revenue)}
                </div>
                {pendingRevenue > 0 && (
                  <div className="text-sm text-gray-500">
                    + {formatCurrency(pendingRevenue)} pendente
                  </div>
                )}
              </div>
            </div>

            {/* Despesas */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Despesas</h4>
              <div className="flex justify-between items-baseline">
                <div className="text-xl font-semibold text-red-600">
                  {formatCurrency(expenses)}
                </div>
                {pendingExpenses > 0 && (
                  <div className="text-sm text-gray-500">
                    + {formatCurrency(pendingExpenses)} pendente
                  </div>
                )}
              </div>
            </div>

            {/* Linha divisória */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Lucro */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Lucro</h4>
              <div className="flex justify-between items-baseline">
                <div className={`text-xl font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(profit)}
                </div>
                {(pendingRevenue > 0 || pendingExpenses > 0) && (
                  <div className="text-sm text-gray-500">
                    Projeção: {formatCurrency(profit + pendingRevenue - pendingExpenses)}
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico ou Indicadores */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Transações Concluídas</span>
                <span>
                  {transactions.filter(t => t.status === 'concluido').length} de {transactions.length}
                </span>
              </div>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ 
                    width: `${(transactions.filter(t => t.status === 'concluido').length / transactions.length) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Eventos */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Próximos Eventos</h3>
        <div className="space-y-4">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="flex flex-col">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-500">{formatEventDate(event.start_time)}</p>
                {event.meet_link && (
                  <a 
                    href={event.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 mt-1"
                  >
                    Entrar na Reunião
                  </a>
                )}
                {event.description && (
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                )}
                <div className="border-t border-gray-100 mt-3"></div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Nenhum evento programado</p>
          )}
        </div>
      </div>
    </div>
  );
}
