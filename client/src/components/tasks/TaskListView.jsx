import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  CheckSquare,
  MessageSquare,
  AlertCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDate, isOverdue } from '../../utils/formatDate';
import EmptyState from '../common/EmptyState';

const TaskListView = ({
  tasks = [],
  onTaskClick,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  onOpenCreateTask,
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Try adjusting your search criteria or create a new task."
        actionLabel="Create Task"
        onAction={onOpenCreateTask}
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/30 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4 w-12 text-center">Status</th>
              <th className="py-3.5 px-4">Task</th>
              <th className="py-3.5 px-4">Project</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Due Date</th>
              <th className="py-3.5 px-4">Subtasks</th>
              <th className="py-3.5 px-4">Assignee</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
            {tasks.map((task) => {
              const isDone = task.status === 'Completed';
              const overdue = isOverdue(task.dueDate, task.status);
              const totalSub = task.subtasks?.length || 0;
              const compSub = task.subtasks?.filter((s) => s.completed).length || 0;

              return (
                <tr
                  key={task._id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  {/* Quick Complete Toggle */}
                  <td
                    className="py-4 px-4 text-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(task);
                    }}
                  >
                    <button
                      className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
                      title={isDone ? 'Mark as Todo' : 'Mark as Completed'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50 dark:fill-emerald-950/50" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </td>

                  {/* Task Title & Tags */}
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                      {task.title}
                    </div>
                    {task.tags && task.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-1 flex-wrap">
                        {task.tags.slice(0, 2).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  {/* Project */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {task.project ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: task.project.color || '#6366f1' }}
                        />
                        {task.project.name}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <PriorityBadge priority={task.priority} />
                  </td>

                  {/* Due Date */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div
                      className={`text-xs font-medium flex items-center gap-1.5 ${
                        overdue
                          ? 'text-rose-600 dark:text-rose-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {overdue && <AlertCircle className="w-3.5 h-3.5" />}
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </td>

                  {/* Subtasks Progress */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {totalSub > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <CheckSquare className="w-3.5 h-3.5" />
                        {compSub}/{totalSub}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {task.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            task.assignedTo.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(task.assignedTo.name)}`
                          }
                          alt={task.assignedTo.name}
                          className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <span className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-[100px] truncate">
                          {task.assignedTo.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">Unassigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-4 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Edit task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskListView;
