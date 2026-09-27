import React from 'react';
import { Calendar, CheckSquare, MessageSquare, Clock, AlertCircle } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/formatDate';

const TaskCard = ({
  task,
  onClick,
  onDragStart,
  isDraggable = true,
}) => {
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart && onDragStart(e, task)}
      onClick={() => onClick && onClick(task)}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md hover:border-brand-500/50 dark:hover:border-brand-500/40 transition-all duration-200 cursor-pointer active:scale-[0.99] select-none"
    >
      {/* Top Header: Project & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        {task.project ? (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 max-w-[140px] truncate">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: task.project.color || '#6366f1' }}
            />
            {task.project.name}
          </span>
        ) : (
          <span />
        )}
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2 leading-snug line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress Bar (if task has subtasks) */}
      {totalSubtasks > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {completedSubtasks}/{totalSubtasks} steps
            </span>
            <span>{Math.round((completedSubtasks / totalSubtasks) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        {/* Due Date */}
        <div
          className={`flex items-center gap-1 font-medium ${
            overdue
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {overdue ? <AlertCircle className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
          <span>{formatDate(task.dueDate)}</span>
        </div>

        {/* Right: Comments & Assignee */}
        <div className="flex items-center gap-2.5">
          {task.comments?.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <MessageSquare className="w-3 h-3" />
              {task.comments.length}
            </span>
          )}

          {task.assignedTo && (
            <img
              src={
                task.assignedTo.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(task.assignedTo.name)}`
              }
              alt={task.assignedTo.name}
              title={`Assigned to ${task.assignedTo.name}`}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
