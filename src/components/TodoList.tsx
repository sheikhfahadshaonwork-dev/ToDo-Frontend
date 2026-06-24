import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import TodoItem from './TodoItem';
import EmptyState from './EmptyState';
import type { Todo, TodoFilters } from '../types';

interface TodoListProps {
  filters: TodoFilters;
  onEditTodo: (todo: Todo) => void;
  onAddTodo: () => void;
}

const ITEMS_PER_PAGE = 20;

const SkeletonItem = () => (
  <div className="card p-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded bg-gray-200 mt-0.5 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 mt-2">
          <div className="h-5 bg-gray-200 rounded-full w-16" />
          <div className="h-5 bg-gray-200 rounded-full w-20" />
          <div className="h-5 bg-gray-200 rounded-full w-24" />
        </div>
      </div>
    </div>
  </div>
);

const TodoList: React.FC<TodoListProps> = ({ filters, onEditTodo, onAddTodo }) => {
  const [page, setPage] = useState(1);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [filters.status, filters.priority, filters.categoryId, filters.search, filters.sortBy, filters.sortOrder]);

  const { data, isLoading, isError, error } = useTodos({
    ...filters,
    page,
    limit: ITEMS_PER_PAGE,
  });

  const hasFilters = Boolean(
    filters.status ||
      filters.priority ||
      filters.categoryId ||
      filters.search
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card p-8 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-red-500 text-xl">!</span>
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">Failed to load todos</h3>
        <p className="text-sm text-gray-500">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  const todos = data?.data ?? [];
  const pagination = data?.pagination;

  if (todos.length === 0) {
    return (
      <EmptyState
        hasFilters={hasFilters}
        onAddTodo={hasFilters ? undefined : onAddTodo}
      />
    );
  }

  return (
    <div>
      {/* Count */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          Showing{' '}
          <span className="font-medium text-gray-700">{todos.length}</span> of{' '}
          <span className="font-medium text-gray-700">
            {pagination?.total ?? todos.length}
          </span>{' '}
          todos
        </p>
        {pagination && pagination.pages > 1 && (
          <p className="text-xs text-gray-400">
            Page {pagination.page} of {pagination.pages}
          </p>
        )}
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {todos.map((todo) => (
          <TodoItem key={todo._id} todo={todo} onEdit={onEditTodo} />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
              // Show first, last, and pages around current
              let pageNum: number;
              if (pagination.pages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
                if (i === 6) pageNum = pagination.pages;
              } else if (page >= pagination.pages - 3) {
                pageNum = pagination.pages - 6 + i;
              } else {
                const mapping = [1, 0, page - 1, page, page + 1, 0, pagination.pages];
                pageNum = mapping[i];
              }

              if (pageNum === 0) {
                return (
                  <span key={`ellipsis-${i}`} className="px-1 text-gray-400 text-sm">
                    …
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TodoList;
