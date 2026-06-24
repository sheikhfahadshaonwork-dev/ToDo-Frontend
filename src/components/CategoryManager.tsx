import React, { useState } from 'react';
import { Plus, Check, Pencil, Trash2, X } from 'lucide-react';
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '../hooks/useCategories';
import type { Category } from '../types';

const PRESET_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#64748b', // slate
];

const PRESET_ICONS = ['📋', '🏠', '💼', '🎯', '📚', '🔧', '💡', '🚀', '❤️', '⭐', '🎨', '🏋️'];

interface CategoryManagerProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory: (id: string | undefined) => void;
}

interface CategoryFormState {
  name: string;
  color: string;
  icon: string;
}

const defaultForm: CategoryFormState = {
  name: '',
  color: '#6366f1',
  icon: '📋',
};

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryFormState>(defaultForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const handleStartAdd = () => {
    setForm(defaultForm);
    setIsAdding(true);
    setEditingId(null);
  };

  const handleStartEdit = (category: Category) => {
    setForm({ name: category.name, color: category.color, icon: category.icon });
    setEditingId(category._id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleSubmitAdd = async () => {
    if (!form.name.trim()) return;
    await createCategory.mutateAsync({
      name: form.name.trim(),
      color: form.color,
      icon: form.icon,
    });
    setIsAdding(false);
    setForm(defaultForm);
  };

  const handleSubmitEdit = async () => {
    if (!editingId || !form.name.trim()) return;
    await updateCategory.mutateAsync({
      id: editingId,
      input: { name: form.name.trim(), color: form.color, icon: form.icon },
    });
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleDelete = async (id: string) => {
    await deleteCategory.mutateAsync(id);
    if (selectedCategoryId === id) onSelectCategory(undefined);
    setDeleteConfirmId(null);
  };

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className="mt-1">
      {/* Category list */}
      <div className="space-y-0.5">
        {categories.map((cat) => (
          <div key={cat._id}>
            {editingId === cat._id ? (
              <CategoryForm
                form={form}
                onChange={setForm}
                onSubmit={handleSubmitEdit}
                onCancel={handleCancel}
                isLoading={updateCategory.isPending}
              />
            ) : (
              <div
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                  selectedCategoryId === cat._id
                    ? 'bg-indigo-500/20 text-white'
                    : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() =>
                  onSelectCategory(
                    selectedCategoryId === cat._id ? undefined : cat._id
                  )
                }
              >
                <span className="text-base leading-none">{cat.icon}</span>
                <span className="flex-1 text-sm font-medium truncate">
                  {cat.name}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {deleteConfirmId === cat._id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cat._id);
                        }}
                        className="text-red-400 hover:text-red-300 p-0.5 rounded text-xs"
                        title="Confirm delete"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(null);
                        }}
                        className="text-indigo-300 hover:text-white p-0.5 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(cat);
                        }}
                        className="text-indigo-300 hover:text-white p-0.5 rounded"
                        title="Edit category"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(cat._id);
                        }}
                        className="text-indigo-300 hover:text-red-400 p-0.5 rounded"
                        title="Delete category"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="mt-2">
          <CategoryForm
            form={form}
            onChange={setForm}
            onSubmit={handleSubmitAdd}
            onCancel={handleCancel}
            isLoading={createCategory.isPending}
          />
        </div>
      )}

      {/* Add button */}
      {!isFormOpen && (
        <button
          onClick={handleStartAdd}
          className="mt-2 flex items-center gap-2 w-full px-3 py-2 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-all duration-150 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add category
        </button>
      )}
    </div>
  );
};

interface CategoryFormProps {
  form: CategoryFormState;
  onChange: (form: CategoryFormState) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  form,
  onChange,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  return (
    <div className="bg-white/10 rounded-lg p-3 space-y-2 animate-slide-up">
      {/* Name input */}
      <input
        type="text"
        placeholder="Category name"
        value={form.name}
        onChange={(e) => onChange({ ...form, name: e.target.value })}
        className="w-full rounded-md bg-white/20 border border-white/20 px-2.5 py-1.5 text-sm text-white placeholder-indigo-300 focus:outline-none focus:border-white/50 focus:bg-white/25"
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
          if (e.key === 'Escape') onCancel();
        }}
        autoFocus
      />

      {/* Icon picker */}
      <div>
        <p className="text-xs text-indigo-300 mb-1">Icon</p>
        <div className="flex flex-wrap gap-1">
          {PRESET_ICONS.map((icon) => (
            <button
              key={icon}
              onClick={() => onChange({ ...form, icon })}
              className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all ${
                form.icon === icon
                  ? 'bg-white/30 ring-1 ring-white/60'
                  : 'hover:bg-white/20'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div>
        <p className="text-xs text-indigo-300 mb-1">Color</p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...form, color })}
              className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${
                form.color === color ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onSubmit}
          disabled={!form.name.trim() || isLoading}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-md bg-indigo-500 hover:bg-indigo-400 disabled:opacity-50 px-2.5 py-1.5 text-xs font-medium text-white transition-colors"
        >
          <Check className="w-3 h-3" />
          {isLoading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onCancel}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategoryManager;
