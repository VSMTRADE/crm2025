import { useContacts } from '../../hooks/useContacts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function RecentContacts() {
  const { data: contacts = [] } = useContacts();
  const recentContacts = contacts.slice(0, 5);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cliente':
        return 'text-green-600 bg-green-50';
      case 'parceiro':
        return 'text-blue-600 bg-blue-50';
      case 'lead':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'text-green-600 bg-green-50';
      case 'inativo':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Contatos Recentes
        </h3>
      </div>
      <div className="divide-y divide-gray-200">
        {recentContacts.map((contact) => (
          <div key={contact.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(contact.type)}`}>
                  {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                </div>
                <p className="text-sm font-medium text-gray-900">{contact.name}</p>
              </div>
              <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </div>
            </div>
            <div className="mt-2">
              <div className="sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <span>{contact.email}</span>
                    {contact.phone && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{contact.phone}</span>
                      </>
                    )}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>
                    Adicionado em {format(new Date(contact.created_at), "d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {recentContacts.length === 0 && (
          <div className="px-4 py-5 sm:px-6 text-center text-gray-500">
            Nenhum contato encontrado
          </div>
        )}
      </div>
    </div>
  );
}
