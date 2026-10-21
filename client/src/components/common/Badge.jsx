import React from 'react';
import { getStatusBadgeStyle } from '../../utils/formatters';

export const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  showDot = true,
  className = ''
}) => {
  let styleClasses = 'bg-slate-100 text-slate-700 border-slate-200';
  let dotColor = 'bg-slate-400';
  let label = children;

  if (status) {
    const config = getStatusBadgeStyle(status);
    styleClasses = config.bg;
    dotColor = config.dot;
    if (!children) label = config.label;
  } else if (variant === 'teal') {
    styleClasses = 'bg-teal-50 text-teal-700 border-teal-200';
    dotColor = 'bg-teal-500';
  } else if (variant === 'emerald') {
    styleClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (variant === 'purple') {
    styleClasses = 'bg-purple-50 text-purple-700 border-purple-200';
    dotColor = 'bg-purple-500';
  } else if (variant === 'blue') {
    styleClasses = 'bg-blue-50 text-blue-700 border-blue-200';
    dotColor = 'bg-blue-500';
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs ${sizes[size] || sizes.md} ${styleClasses} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor} flex-shrink-0`} />
      )}
      <span>{label}</span>
    </span>
  );
};
