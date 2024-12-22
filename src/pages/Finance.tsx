import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { FinancialSummaryCards } from '../components/finance/FinancialSummaryCards';
import { TransactionFilter } from '../components/finance/TransactionFilter';
import { TransactionList } from '../components/finance/TransactionList';
import { AddTransactionForm } from '../components/finance/AddTransactionForm';
import { Transaction } from '../types';

export default function Finance() {
  const { data: transactions = [], isLoading, createTransaction } = useTransactions();
  const [activeType, setActiveType] = useState<Transaction['type'] | 'all'>('all');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      await createTransaction.mutateAsync(transactionData);
      console.log('Transaction created successfully');
      setIsAddTransactionOpen(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando transações...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Finanças</h1>
        <button 
          onClick={() => setIsAddTransactionOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </button>
      </div>

      {isAddTransactionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Nova Transação</h2>
              <button
                onClick={() => setIsAddTransactionOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <AddTransactionForm
              onAddTransaction={handleAddTransaction}
              onCancel={() => setIsAddTransactionOpen(false)}
            />
          </div>
        </div>
      )}

      <FinancialSummaryCards transactions={transactions} />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <TransactionFilter
            activeType={activeType}
            onTypeChange={setActiveType}
          />
        </div>

        <TransactionList
          transactions={transactions}
          type={activeType === 'all' ? undefined : activeType}
        />
      </div>
    </div>
  );
}