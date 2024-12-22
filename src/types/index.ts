export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'usuario';
}

export interface Contact {
  id: string;
  type: 'cliente' | 'parceiro' | 'lead';
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'ativo' | 'inativo';
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'backlog' | 'todo' | 'in_progress' | 'done';
  priority: 'baixo' | 'medio' | 'alto';
  assigned_to?: string;
  due_date?: string;
  contact_id?: string;
  created_by: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  title: string;
  type: 'receita' | 'despesa';
  amount: number;
  description: string;
  category: string;
  date: string;
  contact_id?: string;
  status: 'pendente' | 'concluido' | 'cancelado';
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  google_event_id?: string;
  contact_id?: string;
  meet_link?: string;
  created_by: string;
  created_at: string;
}