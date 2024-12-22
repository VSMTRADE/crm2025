import React from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useContacts } from '../../hooks/useContacts';
import { useTransactions } from '../../hooks/useTransactions';

export function Dashboard() {
  const { tasks = [] } = useTasks();
  const { data: contacts = [] } = useContacts();
  const { data: transactions = [] } = useTransactions();

  return (
    <div className="p-4">
      {/* Primeira linha - Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Total de Tarefas</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold">12</div>
            <div className="text-green-500 text-sm">+2</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Contatos Ativos</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold">48</div>
            <div className="text-green-500 text-sm">+5</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Receita Mensal</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold">R$ 12.450</div>
            <div className="text-green-500 text-sm">+8%</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-gray-500 text-sm">Tarefas Pendentes</h3>
          <div className="mt-2">
            <div className="text-2xl font-bold">6</div>
            <div className="text-red-500 text-sm">-1</div>
          </div>
        </div>
      </div>

      {/* Segunda linha - Visões gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Visão Geral das Tarefas</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">A Fazer</span>
              <span className="font-semibold">4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Em Andamento</span>
              <span className="font-semibold">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Concluídas</span>
              <span className="font-semibold">5</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Visão Geral dos Contatos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Clientes</span>
              <span className="font-semibold">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Parceiros</span>
              <span className="font-semibold">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Leads</span>
              <span className="font-semibold">32</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Visão Geral Financeira</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Receita</span>
              <span className="font-semibold text-green-600">R$ 24.500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Despesas</span>
              <span className="font-semibold text-red-600">R$ 12.050</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Lucro</span>
              <span className="font-semibold text-blue-600">R$ 12.450</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terceira linha - Eventos */}
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
