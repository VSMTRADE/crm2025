import { useTransactions } from '../../hooks/useTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RecentTransactions() {
  const { data: transactions = [] } = useTransactions();
  const recentTransactions = transactions.slice(0, 5);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'receita':
        return 'text-green-600 bg-green-50';
      case 'despesa':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido':
        return 'text-green-600 bg-green-50';
      case 'pendente':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelado':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Transações Recentes
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </div>
                <p className="text-sm font-medium text-gray-900">{transaction.title}</p>
              </div>
              <div className="flex items-center space-x-3">
                <p className={`text-sm font-medium ${transaction.type === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <span>{transaction.category}</span>
                    {transaction.description && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{transaction.description}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    {format(new Date(transaction.date), "d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {recentTransactions.length === 0 && (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            Nenhuma transação encontrada
          </div>
        )}
      </div>
    </div>
  );
}
