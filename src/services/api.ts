import axios, { AxiosError } from 'axios';
import type {
  Todo,
  Category,
  Stats,
  PaginatedResponse,
  ApiResponse,
  TodoFilters,
  CreateTodoInput,
  UpdateTodoInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  Subtask,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4002',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Healthcheck ──────────────────────────────────────────────────────────────
export const healthcheck = async (): Promise<{ status: string }> => {
  const { data } = await api.get('/api/healthcheck/get');
  return data;
};

// ─── Todos ────────────────────────────────────────────────────────────────────
export const getTodos = async (
  filters: TodoFilters = {}
): Promise<PaginatedResponse<Todo>> => {
  const params: Record<string, string | number> = {};
  if (filters.status) params.status = filters.status;
  if (filters.priority) params.priority = filters.priority;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.search) params.search = filters.search;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;

  const { data } = await api.get<PaginatedResponse<Todo>>('/api/todos', { params });
  return data;
};

export const getTodo = async (id: string): Promise<Todo> => {
  const { data } = await api.get<ApiResponse<Todo>>(`/api/todos/${id}`);
  return data.data;
};

export const createTodo = async (input: CreateTodoInput): Promise<Todo> => {
  const { data } = await api.post<ApiResponse<Todo>>('/api/todos', input);
  return data.data;
};

export const updateTodo = async (
  id: string,
  input: UpdateTodoInput
): Promise<Todo> => {
  const { data } = await api.put<ApiResponse<Todo>>(`/api/todos/${id}`, input);
  return data.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await api.delete(`/api/todos/${id}`);
};

export const toggleTodo = async (id: string): Promise<Todo> => {
  const { data } = await api.patch<ApiResponse<Todo>>(`/api/todos/${id}/toggle`);
  return data.data;
};

// ─── Subtasks ─────────────────────────────────────────────────────────────────
export const createSubtask = async (
  todoId: string,
  title: string
): Promise<Todo> => {
  const { data } = await api.post<ApiResponse<Todo>>(
    `/api/todos/${todoId}/subtasks`,
    { title }
  );
  return data.data;
};

export const toggleSubtask = async (
  todoId: string,
  subtaskId: string
): Promise<Todo> => {
  const { data } = await api.patch<ApiResponse<Todo>>(
    `/api/todos/${todoId}/subtasks/${subtaskId}/toggle`
  );
  return data.data;
};

export const deleteSubtask = async (
  todoId: string,
  subtaskId: string
): Promise<Subtask> => {
  const { data } = await api.delete<ApiResponse<Subtask>>(
    `/api/todos/${todoId}/subtasks/${subtaskId}`
  );
  return data.data;
};

// ─── Categories ───────────────────────────────────────────────────────────────
export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get<ApiResponse<Category[]>>('/api/categories');
  return data.data;
};

export const getCategory = async (id: string): Promise<Category> => {
  const { data } = await api.get<ApiResponse<Category>>(`/api/categories/${id}`);
  return data.data;
};

export const createCategory = async (
  input: CreateCategoryInput
): Promise<Category> => {
  const { data } = await api.post<ApiResponse<Category>>('/api/categories', input);
  return data.data;
};

export const updateCategory = async (
  id: string,
  input: UpdateCategoryInput
): Promise<Category> => {
  const { data } = await api.put<ApiResponse<Category>>(
    `/api/categories/${id}`,
    input
  );
  return data.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/api/categories/${id}`);
};

// ─── Stats ────────────────────────────────────────────────────────────────────
export const getStats = async (): Promise<Stats> => {
  const { data } = await api.get<ApiResponse<Stats>>('/api/stats');
  return data.data;
};

export default api;
