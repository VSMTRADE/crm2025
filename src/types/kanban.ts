export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'baixo' | 'medio' | 'alto';
  assignee?: string;
  dueDate?: Date;
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
}
