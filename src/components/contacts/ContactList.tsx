import { Contact } from '../../types';
import { ContactCard } from './ContactCard';

interface ContactListProps {
  contacts: Contact[];
  type?: Contact['type'];
}

export function ContactList({ contacts, type }: ContactListProps) {
  const filteredContacts = type 
    ? contacts.filter(contact => contact.type === type)
    : contacts;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredContacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}