import React, { useState } from 'react';
import {
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Hash,
  CheckSquare,
  Square,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { format, isToday, isPast, parseISO } from 'date-fns';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import CategoryBadge from './CategoryBadge';
import {
  useToggleTodo,
  useDeleteTodo,
  useToggleSubtask,
} from '../hooks/useTodos';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const toggleTodo = useToggleTodo();
  const deleteTodo = useDeleteTodo();
  const toggleSubtask = useToggleSubtask();

  const isCompleted = todo.status === 'completed';
  const isArchived = todo.status === 'archived';

  const dueDateInfo = todo.dueDate
    ? (() => {
        const d = parseISO(todo.dueDate);
        const overdue = !isCompleted && isPast(d) && !isToday(d);
        const dueToday = !isCompleted && isToday(d);
        return {
          text: format(d, 'MMM d, yyyy'),
          overdue,
          dueToday,
        };
      })()
    : null;

  const completedSubtasks = todo.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = todo.subtasks.length;

  const handleToggle = () => {
    toggleTodo.mutate(todo._id);
  };

  const handleDelete = () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
      return;
    }
    deleteTodo.mutate(todo._id);
  };

  const handleToggleSubtask = (subtaskId: string) => {
    toggleSubtask.mutate({ todoId: todo._id, subtaskId });
  };

  return (
    <div
      className={`group card hover:shadow-md transition-all duration-200 overflow-hidden ${
        isArchived ? 'opacity-60' : ''
      }`}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            disabled={toggleTodo.isPending}
            className={`mt-0.5 flex-shrink-0 transition-all duration-200 rounded ${
              isCompleted
                ? 'text-green-500 hover:text-green-600'
                : 'text-gray-300 hover:text-indigo-500'
            }`}
            title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
          >
            {toggleTodo.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            ) : isCompleted ? (
              <CheckSquare className="w-5 h-5" />
            ) : (
              <Square className="w-5 h-5" />
            )}
          </button>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-start gap-2">
              <h3
                className={`text-sm font-semibold leading-snug flex-1 min-w-0 ${
                  isCompleted
                    ? 'line-through text-gray-400'
                    : 'text-gray-900'
                }`}
              >
                {todo.title}
              </h3>
            </div>

            {/* Description */}
            {todo.description && (
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {todo.description}
              </p>
            )}

            {/* Meta badges */}
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <PriorityBadge priority={todo.priority} />
              <StatusBadge status={todo.status} />
              {todo.category && <CategoryBadge category={todo.category} />}

              {/* Due date */}
              {dueDateInfo && (
                <span
                  className={`badge text-xs font-medium ${
                    dueDateInfo.overdue
                      ? 'bg-red-50 text-red-700 ring-1 ring-red-200'
                      : dueDateInfo.dueToday
                      ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'
                  }`}
                >
                  {dueDateInfo.overdue && (
                    <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  )}
                  <CalendarDays className="w-3 h-3 flex-shrink-0" />
                  {dueDateInfo.overdue
                    ? `Overdue · ${dueDateInfo.text}`
                    : dueDateInfo.dueToday
                    ? `Due today`
                    : dueDateInfo.text}
                </span>
              )}

              {/* Tags */}
              {todo.tags.map((tag) => (
                <span
                  key={tag}
                  className="badge bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200 text-xs"
                >
                  <Hash className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}

              {/* Subtask progress */}
              {totalSubtasks > 0 && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className={`badge text-xs font-medium cursor-pointer transition-colors ${
                    completedSubtasks === totalSubtasks
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <CheckSquare className="w-3 h-3" />
                  {completedSubtasks}/{totalSubtasks} subtasks
                  {expanded ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => onEdit(todo)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteTodo.isPending}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                deleteConfirm
                  ? 'text-white bg-red-500 hover:bg-red-600'
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
              title={deleteConfirm ? 'Click again to confirm' : 'Delete'}
            >
              {deleteTodo.isPending ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Subtasks panel */}
      {expanded && totalSubtasks > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 animate-slide-up">
          {/* Progress bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">Progress</span>
              <span className="text-xs text-gray-500">
                {Math.round((completedSubtasks / totalSubtasks) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{
                  width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            {todo.subtasks.map((subtask) => (
              <div
                key={subtask._id}
                className="flex items-center gap-2.5"
              >
                <button
                  onClick={() => handleToggleSubtask(subtask._id)}
                  className={`flex-shrink-0 transition-colors ${
                    subtask.completed
                      ? 'text-green-500 hover:text-green-600'
                      : 'text-gray-300 hover:text-indigo-500'
                  }`}
                >
                  {subtask.completed ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <span
                  className={`text-sm flex-1 ${
                    subtask.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-700'
                  }`}
                >
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
