import React from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  PlayCircle,
  CalendarClock,
} from 'lucide-react';
import { useStats } from '../hooks/useStats';

const StatsBar: React.FC = () => {
  const { data: stats, isLoading } = useStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="card p-4 animate-pulse"
          >
            <div className="h-3 bg-gray-200 rounded w-2/3 mb-3" />
            <div className="h-7 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total',
      value: stats?.total ?? 0,
      icon: CheckSquare,
      iconClass: 'text-indigo-500',
      bgClass: 'bg-indigo-50',
      valueClass: 'text-indigo-700',
    },
    {
      label: 'Pending',
      value: stats?.byStatus.pending ?? 0,
      icon: Clock,
      iconClass: 'text-gray-500',
      bgClass: 'bg-gray-50',
      valueClass: 'text-gray-700',
    },
    {
      label: 'In Progress',
      value: stats?.byStatus['in-progress'] ?? 0,
      icon: PlayCircle,
      iconClass: 'text-blue-500',
      bgClass: 'bg-blue-50',
      valueClass: 'text-blue-700',
    },
    {
      label: 'Completed',
      value: stats?.byStatus.completed ?? 0,
      icon: CheckSquare,
      iconClass: 'text-green-500',
      bgClass: 'bg-green-50',
      valueClass: 'text-green-700',
    },
    {
      label: 'Overdue',
      value: stats?.overdue ?? 0,
      icon: AlertTriangle,
      iconClass: 'text-red-500',
      bgClass: 'bg-red-50',
      valueClass: 'text-red-700',
    },
    {
      label: 'Due Today',
      value: stats?.dueToday ?? 0,
      icon: CalendarClock,
      iconClass: 'text-orange-500',
      bgClass: 'bg-orange-50',
      valueClass: 'text-orange-700',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="card p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {card.label}
              </span>
              <div className={`w-7 h-7 rounded-lg ${card.bgClass} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${card.iconClass}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.valueClass}`}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsBar;
