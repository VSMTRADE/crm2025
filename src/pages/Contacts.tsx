import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import { ContactList } from '../components/contacts/ContactList';
import { ContactFilter } from '../components/contacts/ContactFilter';
import { AddContactForm } from '../components/contacts/AddContactForm';
import { Contact } from '../types';

export default function Contacts() {
  const { data: contacts = [], isLoading, createContact } = useContacts();
  const [activeType, setActiveType] = useState<Contact['type'] | 'all'>('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  const counts = {
    all: contacts.length,
    client: contacts.filter(c => c.type === 'client').length,
    partner: contacts.filter(c => c.type === 'partner').length,
    lead: contacts.filter(c => c.type === 'lead').length,
  };

  const handleAddContact = async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    try {
      await createContact.mutateAsync(contactData);
      console.log('Contato criado com sucesso');
      setIsAddContactOpen(false);
    } catch (error) {
      console.error('Erro ao criar contato:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando contatos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Contatos</h1>
        <button 
          onClick={() => setIsAddContactOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Contato
        </button>
      </div>

      {isAddContactOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-medium">Novo Contato</h2>
              <button
                onClick={() => setIsAddContactOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
            <AddContactForm 
              onAddContact={handleAddContact}
              onCancel={() => setIsAddContactOpen(false)}
            />
          </div>
        </div>
      )}

      <ContactFilter
        activeType={activeType}
        onTypeChange={setActiveType}
        counts={counts}
      />

      <ContactList
        contacts={contacts}
        type={activeType === 'all' ? undefined : activeType}
      />
    </div>
  );
}