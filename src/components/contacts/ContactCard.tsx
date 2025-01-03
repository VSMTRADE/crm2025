import { Contact } from '../../types';
import { Building2, Mail, Phone, Edit2, Trash2 } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onEdit, onDelete }: ContactCardProps) {
  const typeColors = {
    client: 'bg-green-100 text-green-800',
    partner: 'bg-blue-100 text-blue-800',
    lead: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900">{contact.name}</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded ${typeColors[contact.type]}`}>
            {contact.type === 'partner' ? 'parceiro' : contact.type === 'client' ? 'cliente' : 'lead'}
          </span>
          <button
            onClick={() => onEdit(contact)}
            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
            title="Editar contato"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este contato?')) {
                onDelete(contact.id);
              }
            }}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Excluir contato"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>{contact.email}</span>
        </div>
        
        {contact.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>{contact.phone}</span>
          </div>
        )}
        
        {contact.company && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span>{contact.company}</span>
          </div>
        )}
      </div>
    </div>
  );
}