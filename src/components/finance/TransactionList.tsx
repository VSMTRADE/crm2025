import { Transaction } from '../../types';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  type?: Transaction['type'];
}

export function TransactionList({ transactions, type }: TransactionListProps) {
  const filteredTransactions = type
    ? transactions.filter(t => t.type === type)
    : transactions;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4">
      {filteredTransactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              transaction.type === 'receita' 
                ? 'bg-green-100' 
                : 'bg-red-100'
            }`}>
              {transaction.type === 'receita' 
                ? <ArrowUpRight className="w-5 h-5 text-green-600" />
                : <ArrowDownRight className="w-5 h-5 text-red-600" />
              }
            </div>
            <div>
              <p className="font-medium text-gray-900">{transaction.title}</p>
              <p className="text-sm text-gray-500">{transaction.category}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-medium ${
              transaction.type === 'receita' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {transaction.type === 'receita' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(transaction.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}