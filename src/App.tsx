import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatsBar from './components/StatsBar';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import SearchBar from './components/SearchBar';
import SortControls from './components/SortControls';
import type { Todo, TodoStatus, TodoPriority, SortBy, SortOrder } from './types';

interface FilterState {
  status?: TodoStatus;
  priority?: TodoPriority;
  categoryId?: string;
  search: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [modalState, setModalState] = useState<{
    open: boolean;
    todo?: Todo;
  }>({ open: false });

  const openCreate = useCallback(() => setModalState({ open: true }), []);
  const openEdit = useCallback(
    (todo: Todo) => setModalState({ open: true, todo }),
    []
  );
  const closeModal = useCallback(() => setModalState({ open: false }), []);

  const handleStatusChange = useCallback((status: TodoStatus | undefined) => {
    setFilters((f) => ({ ...f, status }));
  }, []);

  const handlePriorityChange = useCallback(
    (priority: TodoPriority | undefined) => {
      setFilters((f) => ({ ...f, priority }));
    },
    []
  );

  const handleCategoryChange = useCallback(
    (categoryId: string | undefined) => {
      setFilters((f) => ({ ...f, categoryId }));
    },
    []
  );

  const handleSearchChange = useCallback((search: string) => {
    setFilters((f) => ({ ...f, search }));
  }, []);

  const handleSortByChange = useCallback((sortBy: SortBy) => {
    setFilters((f) => ({ ...f, sortBy }));
  }, []);

  const handleSortOrderChange = useCallback((sortOrder: SortOrder) => {
    setFilters((f) => ({ ...f, sortOrder }));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        selectedStatus={filters.status}
        selectedPriority={filters.priority}
        selectedCategoryId={filters.categoryId}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onCategoryChange={handleCategoryChange}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-content">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
          {/* Page header */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <div className="pl-12 lg:pl-0">
              <h2 className="text-2xl font-bold text-gray-900">
                {filters.status
                  ? filters.status === 'in-progress'
                    ? 'In Progress'
                    : filters.status.charAt(0).toUpperCase() +
                      filters.status.slice(1)
                  : filters.priority
                  ? `${filters.priority.charAt(0).toUpperCase()}${filters.priority.slice(1)} Priority`
                  : 'All Todos'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button
              onClick={openCreate}
              className="btn-primary shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Todo</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Stats bar */}
          <StatsBar />

          {/* Search + Sort toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <SearchBar
              value={filters.search}
              onChange={handleSearchChange}
            />
            <SortControls
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortByChange={handleSortByChange}
              onSortOrderChange={handleSortOrderChange}
            />
          </div>

          {/* Active filter pills */}
          {(filters.status ||
            filters.priority ||
            filters.categoryId ||
            filters.search) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.status && (
                <FilterPill
                  label={`Status: ${filters.status}`}
                  onRemove={() => handleStatusChange(undefined)}
                />
              )}
              {filters.priority && (
                <FilterPill
                  label={`Priority: ${filters.priority}`}
                  onRemove={() => handlePriorityChange(undefined)}
                />
              )}
              {filters.categoryId && (
                <FilterPill
                  label="Category filter active"
                  onRemove={() => handleCategoryChange(undefined)}
                />
              )}
              {filters.search && (
                <FilterPill
                  label={`Search: "${filters.search}"`}
                  onRemove={() => handleSearchChange('')}
                />
              )}
              <button
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    status: undefined,
                    priority: undefined,
                    categoryId: undefined,
                    search: '',
                  }))
                }
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Todo list */}
          <TodoList
            filters={{
              status: filters.status,
              priority: filters.priority,
              categoryId: filters.categoryId,
              search: filters.search || undefined,
              sortBy: filters.sortBy,
              sortOrder: filters.sortOrder,
            }}
            onEditTodo={openEdit}
            onAddTodo={openCreate}
          />
        </div>
      </main>

      {/* Floating Action Button (mobile) */}
      <button
        onClick={openCreate}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-30"
        aria-label="Add todo"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Todo Form Modal */}
      {modalState.open && (
        <TodoForm todo={modalState.todo} onClose={closeModal} />
      )}
    </div>
  );
};

interface FilterPillProps {
  label: string;
  onRemove: () => void;
}

const FilterPill: React.FC<FilterPillProps> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-indigo-200">
    {label}
    <button
      onClick={onRemove}
      className="text-indigo-400 hover:text-indigo-700 transition-colors"
    >
      ×
    </button>
  </span>
);

export default App;
