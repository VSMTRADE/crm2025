import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { Transaction } from '../../types';

interface FinancialSummaryCardsProps {
  transactions: Transaction[];
}

export function FinancialSummaryCards({ transactions }: FinancialSummaryCardsProps) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const cards = [
    {
      title: 'Saldo Total',
      amount: balance,
      icon: DollarSign,
      color: balance >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Total de Receitas',
      amount: income,
      icon: TrendingUp,
      color: 'text-green-600',
    },
    {
      title: 'Total de Despesas',
      amount: expenses,
      icon: TrendingDown,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{card.title}</h3>
            <card.icon className={`h-6 w-6 ${card.color}`} />
          </div>
          <p className={`text-2xl font-semibold ${card.color}`}>
            {formatCurrency(card.amount)}
          </p>
        </div>
      ))}
    </div>
  );
}