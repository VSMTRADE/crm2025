import { Transaction } from '../../types';

interface TransactionFilterProps {
  activeType: Transaction['type'] | 'all';
  onTypeChange: (type: Transaction['type'] | 'all') => void;
}

export function TransactionFilter({ activeType, onTypeChange }: TransactionFilterProps) {
  const types = [
    { id: 'all', label: 'Todas as Transações' },
    { id: 'income', label: 'Receitas' },
    { id: 'expense', label: 'Despesas' },
  ] as const;

  return (
    <div className="flex gap-2">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeChange(type.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeType === type.id
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
}