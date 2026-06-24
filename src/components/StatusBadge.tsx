import React from 'react';
import type { TodoStatus } from '../types';

interface StatusBadgeProps {
  status: TodoStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<
  TodoStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  },
  'in-progress': {
    label: 'In Progress',
    className: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  },
  archived: {
    label: 'Archived',
    className: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'sm' }) => {
  const config = statusConfig[status];
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span className={`badge ${config.className} ${textSize} font-medium`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
