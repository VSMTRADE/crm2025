import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DollarSign, TrendingUp, TrendingDown, Plus, Pencil, Trash2 } from 'lucide-react';
import { TransactionForm } from '../components/finance/TransactionForm';
import { toast } from 'react-toastify';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'receita' | 'despesa';
  date: string;
  category: string;
  description?: string;
  status: 'pendente' | 'concluido' | 'cancelado';
  created_at: string;
  updated_at: string;
}

export default function Finance() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'year'>('month');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const queryClient = useQueryClient();

  // Buscar transações
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Verificar constraint antes de qualquer operação
  const checkConstraint = async () => {
    const { data, error } = await supabase
      .rpc('check_constraint_definition', {
        table_name: 'transactions',
        constraint_name: 'transactions_status_check'
      });
    
    if (error) {
      console.error('Erro ao verificar constraint:', error);
    } else {
      console.log('Definição atual da constraint:', data);
    }
  };

  // Mutações
  const createTransaction = useMutation({
    mutationFn: async (newTransaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
      try {
        // Log dos dados recebidos
        console.log('Dados recebidos do formulário:', {
          ...newTransaction
        });

        const transactionData = {
          ...newTransaction,
          description: newTransaction.description || newTransaction.title
        };

        // Log dos dados que serão enviados
        console.log('Dados que serão enviados:', JSON.stringify(transactionData, null, 2));
        
        const { data, error } = await supabase
          .from('transactions')
          .insert([transactionData])
          .select()
          .single();

        if (error) {
          console.error('Erro detalhado do Supabase:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
            errorData: error
          });
          throw error;
        }

        return data;
      } catch (error) {
        console.error('Stack trace completo:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setIsFormOpen(false);
      toast.success('Transação criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro na mutação:', error);
      toast.error('Erro ao criar transação: ' + error.message);
    }
  });

  const updateTransaction = useMutation({
    mutationFn: async (transaction: Transaction) => {
      const updateData = {
        title: transaction.title,
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date,
        category: transaction.category,
        status: transaction.status || 'pendente'
      };

      console.log('Atualizando dados:', updateData);

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', transaction.id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar transação:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      setEditingTransaction(null);
      toast.success('Transação atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar transação: ' + error.message);
    }
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação excluída com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao excluir transação: ' + error.message);
    }
  });

  // Calcular totais
  const calculateTotals = () => {
    if (!transactions) return { income: 0, expense: 0 };

    const now = new Date();
    const startDate = new Date();
    if (selectedPeriod === 'month') {
      startDate.setMonth(now.getMonth());
      startDate.setDate(1);
    } else {
      startDate.setMonth(0);
      startDate.setDate(1);
    }

    return transactions.reduce(
      (acc, transaction) => {
        const transactionDate = new Date(transaction.date);
        if (transactionDate >= startDate && transactionDate <= now) {
          if (transaction.type === 'receita') {
            acc.income += transaction.amount;
          } else {
            acc.expense += transaction.amount;
          }
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  };

  const totals = calculateTotals();
  const balance = totals.income - totals.expense;

  // Formatar valor em reais
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleSubmit = async (data: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingTransaction) {
      await updateTransaction.mutateAsync({ ...data, id: editingTransaction.id, created_at: editingTransaction.created_at, updated_at: editingTransaction.updated_at });
    } else {
      await createTransaction.mutateAsync(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      await deleteTransaction.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modal de Formulário */}
      {(isFormOpen || editingTransaction) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">
                {editingTransaction ? 'Editar Transação' : 'Nova Transação'}
              </h2>
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTransaction(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <TransactionForm
              transaction={editingTransaction || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingTransaction(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Financeiro</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPeriod === 'month'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setSelectedPeriod('year')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPeriod === 'year'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Este Ano
            </button>
          </div>
          
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Saldo */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Saldo
                  </dt>
                  <dd className={`text-lg font-semibold ${
                    balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(balance)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Receitas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Receitas
                  </dt>
                  <dd className="text-lg font-semibold text-green-600">
                    {formatCurrency(totals.income)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Despesas */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Despesas
                  </dt>
                  <dd className="text-lg font-semibold text-red-600">
                    {formatCurrency(totals.expense)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Transações */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Transações Recentes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Carregando...
                  </td>
                </tr>
              ) : transactions?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma transação encontrada
                  </td>
                </tr>
              ) : (
                transactions?.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.category}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'receita' ? '+' : '-'}{' '}
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}