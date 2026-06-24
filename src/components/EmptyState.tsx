import React from 'react';
import { ClipboardList, Plus } from 'lucide-react';

interface EmptyStateProps {
  hasFilters?: boolean;
  onAddTodo?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ hasFilters, onAddTodo }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
          <ClipboardList className="w-12 h-12 text-indigo-400" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
          <span className="text-purple-500 text-lg">✓</span>
        </div>
      </div>

      {hasFilters ? (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No todos match your filters
          </h3>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            Try adjusting your search or filter criteria to find what you're
            looking for, or clear all filters to see everything.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your task list is empty
          </h3>
          <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
            Get started by creating your first todo. Stay organized and track
            your progress with priorities, categories, and subtasks.
          </p>
          {onAddTodo && (
            <button
              onClick={onAddTodo}
              className="mt-6 btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create your first todo
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyState;
