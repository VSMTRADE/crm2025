import { Contact } from '../../types';

interface ContactFilterProps {
  activeType: Contact['type'] | 'all';
  onTypeChange: (type: Contact['type'] | 'all') => void;
  counts: {
    all: number;
    client: number;
    partner: number;
    lead: number;
  };
}

export function ContactFilter({ activeType, onTypeChange, counts }: ContactFilterProps) {
  const types = [
    { id: 'all', label: 'Todos os Contatos' },
    { id: 'client', label: 'Clientes' },
    { id: 'partner', label: 'Parceiros' },
    { id: 'lead', label: 'Leads' },
  ] as const;

  return (
    <div className="flex flex-wrap gap-2">
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
          {type.label} ({counts[type.id]})
        </button>
      ))}
    </div>
  );
}