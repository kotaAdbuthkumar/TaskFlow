import React from 'react';
import { priorityConfig, statusConfig } from '../../utils/priorityColors';

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.Medium;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || statusConfig.Todo;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.badge}`}
    >
      {config.label}
    </span>
  );
};

export const TagBadge = ({ label, onRemove }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
      #{label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:text-rose-500 transition-colors ml-0.5"
          aria-label={`Remove tag ${label}`}
        >
          &times;
        </button>
      )}
    </span>
  );
};
