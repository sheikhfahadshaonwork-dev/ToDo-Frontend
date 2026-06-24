import React from 'react';
import type { Category } from '../types';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  size = 'sm',
}) => {
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <span
      className={`badge ${textSize} font-medium`}
      style={{
        backgroundColor: `${category.color}18`,
        color: category.color,
        boxShadow: `inset 0 0 0 1px ${category.color}40`,
      }}
    >
      <span className="flex-shrink-0">{category.icon}</span>
      {category.name}
    </span>
  );
};

export default CategoryBadge;
