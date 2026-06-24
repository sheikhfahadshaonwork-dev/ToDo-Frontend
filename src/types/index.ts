export type TodoStatus = 'pending' | 'in-progress' | 'completed' | 'archived';
export type TodoPriority = 'low' | 'medium' | 'high' | 'urgent';
export type SortBy = 'createdAt' | 'dueDate' | 'priority' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface Subtask {
  _id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  categoryId?: string;
  category?: Category;
  tags: string[];
  subtasks: Subtask[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Stats {
  total: number;
  byStatus: {
    pending: number;
    'in-progress': number;
    completed: number;
    archived: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  overdue: number;
  completedToday: number;
  dueToday: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TodoFilters {
  status?: TodoStatus;
  priority?: TodoPriority;
  categoryId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: TodoStatus;
  priority?: TodoPriority;
  dueDate?: string;
  categoryId?: string;
  tags?: string[];
  notes?: string;
}

export interface UpdateTodoInput extends Partial<CreateTodoInput> {
  subtasks?: Subtask[];
}

export interface CreateCategoryInput {
  name: string;
  color: string;
  icon: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}
