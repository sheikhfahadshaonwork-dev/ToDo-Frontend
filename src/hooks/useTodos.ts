import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as api from '../services/api';
import type { TodoFilters, CreateTodoInput, UpdateTodoInput } from '../types';

export const TODO_QUERY_KEY = 'todos';

// ─── Queries ──────────────────────────────────────────────────────────────────
export const useTodos = (filters: TodoFilters = {}) => {
  return useQuery({
    queryKey: [TODO_QUERY_KEY, filters],
    queryFn: () => api.getTodos(filters),
    staleTime: 30_000,
  });
};

export const useTodo = (id: string) => {
  return useQuery({
    queryKey: [TODO_QUERY_KEY, id],
    queryFn: () => api.getTodo(id),
    enabled: !!id,
    staleTime: 30_000,
  });
};

// ─── Mutations ────────────────────────────────────────────────────────────────
export const useCreateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTodoInput) => api.createTodo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) =>
      api.updateTodo(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useToggleTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.toggleTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

// ─── Subtask Mutations ────────────────────────────────────────────────────────
export const useCreateSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ todoId, title }: { todoId: string; title: string }) =>
      api.createSubtask(todoId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
  });
};

export const useToggleSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      todoId,
      subtaskId,
    }: {
      todoId: string;
      subtaskId: string;
    }) => api.toggleSubtask(todoId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
  });
};

export const useDeleteSubtask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      todoId,
      subtaskId,
    }: {
      todoId: string;
      subtaskId: string;
    }) => api.deleteSubtask(todoId, subtaskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TODO_QUERY_KEY] });
    },
  });
};
