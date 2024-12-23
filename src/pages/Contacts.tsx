import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useContacts } from '../hooks/useContacts';
import { ContactList } from '../components/contacts/ContactList';
import { ContactFilter } from '../components/contacts/ContactFilter';
import { AddContactForm } from '../components/contacts/AddContactForm';
import { ContactCard } from '../components/contacts/ContactCard';
import { Contact } from '../types';

export default function Contacts() {
  const { data: contacts = [], isLoading, createContact, updateContact, deleteContact } = useContacts();
  const [activeType, setActiveType] = useState<Contact['type'] | 'all'>('all');
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

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

  const handleEditContact = async (contactData: Omit<Contact, 'id' | 'created_at'>) => {
    try {
      if (editingContact) {
        await updateContact.mutateAsync({ ...contactData, id: editingContact.id });
        console.log('Contato atualizado com sucesso');
        setEditingContact(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await deleteContact.mutateAsync(id);
      console.log('Contato excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando contatos...</div>
      </div>
    );
  }

  const filteredContacts = activeType === 'all' 
    ? contacts 
    : contacts.filter(contact => contact.type === activeType);

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

      <ContactFilter
        counts={counts}
        activeType={activeType}
        onTypeChange={setActiveType}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onEdit={setEditingContact}
            onDelete={handleDeleteContact}
          />
        ))}
      </div>

      {/* Modal de Adicionar Contato */}
      {isAddContactOpen && (
        <AddContactForm
          onSubmit={handleAddContact}
          onCancel={() => setIsAddContactOpen(false)}
        />
      )}

      {/* Modal de Editar Contato */}
      {editingContact && (
        <AddContactForm
          contact={editingContact}
          onSubmit={handleEditContact}
          onCancel={() => setEditingContact(null)}
        />
      )}
    </div>
  );
}