import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
}

interface Negotiation {
  id: string;
  title: string;
  description: string;
  total_amount: number;
  number_of_installments: number;
  contact_id: string;
  created_at: string;
  contact: {
    name: string;
  };
  installments: {
    due_date: string;
  }[];
}

interface Installment {
  id: string;
  negotiation_id: string;
  installment_number: number;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid';
  paid_at: string | null;
}

export default function Negotiations() {
  const { user } = useAuth();
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_amount: '',
    number_of_installments: '',
    contact_id: '',
    first_due_date: null as Date | null,
  });

  useEffect(() => {
    fetchNegotiations();
    fetchContacts();
  }, []);

  const fetchNegotiations = async () => {
    try {
      const { data, error } = await supabase
        .from('negotiations')
        .select(`
          *,
          contact:contacts(name),
          installments!inner(due_date)
        `)
        .eq('installments.installment_number', 1)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching negotiations:', error);
        alert('Erro ao carregar negociações: ' + error.message);
        return;
      }

      setNegotiations(data || []);
    } catch (err) {
      console.error('Error in fetchNegotiations:', err);
      alert('Erro ao carregar negociações');
    }
  };

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching contacts:', error);
        alert('Erro ao carregar contatos: ' + error.message);
        return;
      }

      setContacts(data || []);
    } catch (err) {
      console.error('Error in fetchContacts:', err);
      alert('Erro ao carregar contatos');
    }
  };

  const handleOpenDialog = async (negotiation?: Negotiation) => {
    if (negotiation) {
      // Buscar a primeira parcela da negociação
      const { data: installmentData, error: installmentError } = await supabase
        .from('installments')
        .select('due_date')
        .eq('negotiation_id', negotiation.id)
        .eq('installment_number', 1)
        .single();

      if (installmentError) {
        console.error('Error fetching first installment:', installmentError);
      }

      // Ajusta a data para o fuso horário local
      const dueDate = installmentData ? new Date(installmentData.due_date + 'T12:00:00') : null;

      setSelectedNegotiation(negotiation);
      setFormData({
        title: negotiation.title,
        description: negotiation.description,
        total_amount: negotiation.total_amount.toString(),
        number_of_installments: negotiation.number_of_installments.toString(),
        contact_id: negotiation.contact_id,
        first_due_date: dueDate,
      });
    } else {
      setSelectedNegotiation(null);
      setFormData({
        title: '',
        description: '',
        total_amount: '',
        number_of_installments: '',
        contact_id: '',
        first_due_date: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNegotiation(null);
  };

  const createInstallments = async (negotiationId: string, totalAmount: number, numberOfInstallments: number, firstDueDate: Date) => {
    const installmentAmount = Number((totalAmount / numberOfInstallments).toFixed(2));
    const installments = [];

    for (let i = 0; i < numberOfInstallments; i++) {
      const dueDate = new Date(firstDueDate);
      dueDate.setMonth(dueDate.getMonth() + i);
      
      installments.push({
        negotiation_id: negotiationId,
        installment_number: i + 1,
        amount: i === numberOfInstallments - 1 
          ? Number((totalAmount - (installmentAmount * (numberOfInstallments - 1))).toFixed(2))
          : installmentAmount,
        due_date: format(dueDate, 'yyyy-MM-dd'),
        status: 'pending'
      });
    }

    const { error } = await supabase
      .from('installments')
      .insert(installments);

    if (error) {
      console.error('Error creating installments:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_due_date) {
      alert('Por favor, selecione a data do primeiro vencimento');
      return;
    }

    try {
      const negotiationData = {
        title: formData.title,
        description: formData.description,
        total_amount: Number(formData.total_amount),
        number_of_installments: Number(formData.number_of_installments),
        contact_id: formData.contact_id,
        user_id: user?.id,
      };

      if (selectedNegotiation) {
        // Atualiza a negociação
        const { error: updateError } = await supabase
          .from('negotiations')
          .update(negotiationData)
          .eq('id', selectedNegotiation.id);

        if (updateError) throw updateError;

        // Remove as parcelas antigas
        const { error: deleteError } = await supabase
          .from('installments')
          .delete()
          .eq('negotiation_id', selectedNegotiation.id);

        if (deleteError) throw deleteError;

        // Cria novas parcelas com as datas atualizadas
        await createInstallments(
          selectedNegotiation.id,
          Number(formData.total_amount),
          Number(formData.number_of_installments),
          formData.first_due_date
        );
      } else {
        const { data, error } = await supabase
          .from('negotiations')
          .insert(negotiationData)
          .select()
          .single();

        if (error) throw error;

        await createInstallments(
          data.id,
          Number(formData.total_amount),
          Number(formData.number_of_installments),
          formData.first_due_date
        );
      }

      handleCloseDialog();
      fetchNegotiations();
    } catch (error) {
      console.error('Error saving negotiation:', error);
      alert('Erro ao salvar negociação');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta negociação?')) {
      const { error } = await supabase
        .from('negotiations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting negotiation:', error);
        alert('Erro ao excluir negociação');
        return;
      }

      fetchNegotiations();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Negociações</h1>
        <button
          onClick={() => handleOpenDialog()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nova Negociação
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {negotiations.map((negotiation) => (
          <div key={negotiation.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">{negotiation.title}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenDialog(negotiation)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(negotiation.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{negotiation.description}</p>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-900">
                  Valor Total: R$ {negotiation.total_amount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">
                  {negotiation.number_of_installments}x de R$ {(negotiation.total_amount / negotiation.number_of_installments).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Contato: {negotiation.contact.name}
                </p>
                <p className="text-sm font-bold mt-2" style={{ color: '#690500' }}>
                  Vencimento: {format(new Date(negotiation.installments[0].due_date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {openDialog && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedNegotiation ? 'Editar Negociação' : 'Nova Negociação'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Título
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
                    Contato
                  </label>
                  <select
                    id="contact"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.contact_id}
                    onChange={(e) => setFormData({ ...formData, contact_id: e.target.value })}
                    required
                  >
                    <option value="">Selecione um contato</option>
                    {contacts.map((contact) => (
                      <option key={contact.id} value={contact.id}>
                        {contact.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
                      Valor Total
                    </label>
                    <input
                      type="number"
                      id="total_amount"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.total_amount}
                      onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                      required
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label htmlFor="installments" className="block text-sm font-medium text-gray-700">
                      Número de Parcelas
                    </label>
                    <input
                      type="number"
                      id="installments"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      value={formData.number_of_installments}
                      onChange={(e) => setFormData({ ...formData, number_of_installments: e.target.value })}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="first_due_date" className="block text-sm font-medium text-gray-700">
                    Data do Primeiro Vencimento
                  </label>
                  <input
                    type="date"
                    id="first_due_date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={formData.first_due_date ? format(formData.first_due_date, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value + 'T12:00:00') : null;
                      setFormData({ ...formData, first_due_date: date });
                    }}
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseDialog}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
