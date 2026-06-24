import React, { useState } from 'react';
import {
  CheckSquare,
  LayoutDashboard,
  Clock,
  PlayCircle,
  CheckCircle2,
  Archive,
  AlertTriangle,
  Flame,
  TrendingUp,
  ArrowDown,
  Tag,
  Menu,
  X,
  CalendarClock,
} from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { useCategories } from '../hooks/useCategories';
import CategoryManager from './CategoryManager';
import type { TodoStatus, TodoPriority } from '../types';

interface SidebarProps {
  selectedStatus?: TodoStatus;
  selectedPriority?: TodoPriority;
  selectedCategoryId?: string;
  onStatusChange: (status: TodoStatus | undefined) => void;
  onPriorityChange: (priority: TodoPriority | undefined) => void;
  onCategoryChange: (categoryId: string | undefined) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedStatus,
  selectedPriority,
  selectedCategoryId,
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: stats } = useStats();
  const { data: categories = [] } = useCategories();

  const statusItems: { value: TodoStatus | undefined; label: string; icon: React.ElementType; count?: number }[] = [
    { value: undefined, label: 'All Todos', icon: LayoutDashboard, count: stats?.total },
    { value: 'pending', label: 'Pending', icon: Clock, count: stats?.byStatus.pending },
    { value: 'in-progress', label: 'In Progress', icon: PlayCircle, count: stats?.byStatus['in-progress'] },
    { value: 'completed', label: 'Completed', icon: CheckCircle2, count: stats?.byStatus.completed },
    { value: 'archived', label: 'Archived', icon: Archive, count: stats?.byStatus.archived },
  ];

  const priorityItems: { value: TodoPriority | undefined; label: string; dotColor: string; count?: number }[] = [
    { value: undefined, label: 'All Priorities', dotColor: 'bg-gray-400', count: stats?.total },
    { value: 'urgent', label: 'Urgent', dotColor: 'bg-red-500', count: stats?.byPriority.urgent },
    { value: 'high', label: 'High', dotColor: 'bg-orange-500', count: stats?.byPriority.high },
    { value: 'medium', label: 'Medium', dotColor: 'bg-yellow-500', count: stats?.byPriority.medium },
    { value: 'low', label: 'Low', dotColor: 'bg-blue-500', count: stats?.byPriority.low },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-5 border-b border-indigo-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">P4P Todo</h1>
            <p className="text-indigo-300 text-xs mt-0.5">Task Manager</p>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-4 py-4 border-b border-indigo-800/60">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Overdue', value: stats?.overdue ?? 0, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
            { label: 'Due Today', value: stats?.dueToday ?? 0, icon: CalendarClock, color: 'text-orange-400', bg: 'bg-orange-500/10' },
            { label: 'Completed', value: stats?.completedToday ?? 0, icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10' },
            { label: 'Total', value: stats?.total ?? 0, icon: TrendingUp, color: 'text-indigo-300', bg: 'bg-indigo-500/10' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className={`${item.bg} rounded-lg p-2.5`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className={`w-3 h-3 ${item.color}`} />
                  <span className="text-xs text-indigo-300">{item.label}</span>
                </div>
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3 space-y-5">
        {/* Status filter */}
        <div>
          <p className="px-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1.5">
            Status
          </p>
          <nav className="space-y-0.5">
            {statusItems.map((item) => {
              const Icon = item.icon;
              const isActive = selectedStatus === item.value;
              return (
                <button
                  key={item.label}
                  onClick={() => onStatusChange(item.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-900/40'
                      : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-medium ${
                        isActive ? 'bg-white/20 text-white' : 'bg-indigo-800/60 text-indigo-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Priority filter */}
        <div>
          <p className="px-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1.5">
            Priority
          </p>
          <nav className="space-y-0.5">
            {priorityItems.map((item) => {
              const isActive = selectedPriority === item.value;
              const PriorityIcon = item.value === 'urgent'
                ? Flame
                : item.value === 'high'
                ? AlertTriangle
                : item.value === 'medium'
                ? TrendingUp
                : item.value === 'low'
                ? ArrowDown
                : LayoutDashboard;

              return (
                <button
                  key={item.label}
                  onClick={() => onPriorityChange(item.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-900/40'
                      : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.dotColor}`} />
                  <PriorityIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.count !== undefined && (
                    <span
                      className={`text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-medium ${
                        isActive ? 'bg-white/20 text-white' : 'bg-indigo-800/60 text-indigo-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Categories */}
        <div>
          <p className="px-2 text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            Categories
          </p>
          {categories.length === 0 ? (
            <p className="px-3 text-xs text-indigo-400 italic">No categories yet</p>
          ) : null}
          <CategoryManager
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={onCategoryChange}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-indigo-800/60">
        <p className="text-xs text-indigo-400 text-center">
          P4P Todo &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center text-white shadow-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#1e1b4b] transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-indigo-300 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-72 flex-shrink-0 bg-[#1e1b4b] border-r border-indigo-800/30 h-screen overflow-hidden sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
