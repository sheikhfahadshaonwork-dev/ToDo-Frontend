import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Tag,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useCreateTodo, useUpdateTodo } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import type { Todo, TodoStatus, TodoPriority, CreateTodoInput } from '../types';

interface TodoFormProps {
  todo?: Todo;
  onClose: () => void;
}

interface SubtaskDraft {
  id: string;
  title: string;
  completed: boolean;
}

interface FormState {
  title: string;
  description: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate: string;
  categoryId: string;
  tags: string[];
  notes: string;
  subtasks: SubtaskDraft[];
}

const defaultForm: FormState = {
  title: '',
  description: '',
  status: 'pending',
  priority: 'medium',
  dueDate: '',
  categoryId: '',
  tags: [],
  notes: '',
  subtasks: [],
};

let draftIdCounter = 0;
const genId = () => `draft_${++draftIdCounter}`;

const STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

const PRIORITY_OPTIONS: { value: TodoPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'text-blue-600' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
  { value: 'high', label: 'High', color: 'text-orange-600' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-600' },
];

const TodoForm: React.FC<TodoFormProps> = ({ todo, onClose }) => {
  const isEditing = Boolean(todo);
  const { data: categories = [] } = useCategories();
  const createTodo = useCreateTodo();
  const updateTodo = useUpdateTodo();

  const [form, setForm] = useState<FormState>(() => {
    if (todo) {
      return {
        title: todo.title,
        description: todo.description ?? '',
        status: todo.status,
        priority: todo.priority,
        dueDate: todo.dueDate ? todo.dueDate.split('T')[0] : '',
        categoryId: todo.categoryId ?? '',
        tags: todo.tags ?? [],
        notes: todo.notes ?? '',
        subtasks: todo.subtasks.map((s) => ({
          id: s._id,
          title: s.title,
          completed: s.completed,
        })),
      };
    }
    return defaultForm;
  });

  const [tagInput, setTagInput] = useState('');
  const [subtaskInput, setSubtaskInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const handleAddSubtask = () => {
    const title = subtaskInput.trim();
    if (!title) return;
    setForm((f) => ({
      ...f,
      subtasks: [...f.subtasks, { id: genId(), title, completed: false }],
    }));
    setSubtaskInput('');
  };

  const handleToggleSubtask = (id: string) => {
    setForm((f) => ({
      ...f,
      subtasks: f.subtasks.map((s) =>
        s.id === id ? { ...s, completed: !s.completed } : s
      ),
    }));
  };

  const handleRemoveSubtask = (id: string) => {
    setForm((f) => ({
      ...f,
      subtasks: f.subtasks.filter((s) => s.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError('Title is required');
      titleRef.current?.focus();
      return;
    }

    const payload: CreateTodoInput = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
      categoryId: form.categoryId || undefined,
      tags: form.tags,
      notes: form.notes.trim() || undefined,
    };

    try {
      if (isEditing && todo) {
        await updateTodo.mutateAsync({ id: todo._id, input: payload });
      } else {
        await createTodo.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  const isLoading = createTodo.isPending || updateTodo.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Todo' : 'Create New Todo'}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {isEditing ? 'Update your task details' : 'Add a new task to your list'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto scrollbar-content">
          <div className="px-6 py-5 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="label">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                ref={titleRef}
                type="text"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="What needs to be done?"
                className="input"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Add more details..."
                rows={3}
                className="input resize-none"
              />
            </div>

            {/* Status + Priority row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as TodoStatus }))
                  }
                  className="input"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      priority: e.target.value as TodoPriority,
                    }))
                  }
                  className="input"
                >
                  {PRIORITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due date + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="label">Category</label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, categoryId: e.target.value }))
                  }
                  className="input"
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="label flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag..."
                  className="input flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="btn-secondary px-3 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-indigo-200"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-indigo-400 hover:text-indigo-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Subtasks */}
            <div>
              <label className="label flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                Subtasks
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={subtaskInput}
                  onChange={(e) => setSubtaskInput(e.target.value)}
                  placeholder="Add a subtask..."
                  className="input flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!subtaskInput.trim()}
                  className="btn-secondary px-3 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {form.subtasks.length > 0 && (
                <div className="mt-2 space-y-1.5 bg-gray-50 rounded-lg p-3">
                  {form.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center gap-2 group"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleSubtask(subtask.id)}
                        className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                      >
                        {subtask.completed ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm ${
                          subtask.completed
                            ? 'line-through text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {subtask.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubtask(subtask.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Private notes, reminders..."
                rows={2}
                className="input resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !form.title.trim()}
              className="btn-primary min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : isEditing ? (
                'Update Todo'
              ) : (
                'Create Todo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;
