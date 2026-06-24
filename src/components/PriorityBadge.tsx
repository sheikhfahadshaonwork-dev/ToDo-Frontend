import React from 'react';
import type { TodoPriority } from '../types';

interface PriorityBadgeProps {
  priority: TodoPriority;
  size?: 'sm' | 'md';
}

const priorityConfig: Record<
  TodoPriority,
  { label: string; className: string; dot: string }
> = {
  low: {
    label: 'Low',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
    dot: 'bg-blue-500',
  },
  medium: {
    label: 'Medium',
    className: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
    dot: 'bg-yellow-500',
  },
  high: {
    label: 'High',
    className: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
    dot: 'bg-orange-500',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-red-50 text-red-700 ring-1 ring-red-200',
    dot: 'bg-red-500',
  },
};

const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'sm',
}) => {
  const config = priorityConfig[priority];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span
      className={`badge ${config.className} ${textSize} font-medium`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      {config.label}
    </span>
  );
};

export default PriorityBadge;
