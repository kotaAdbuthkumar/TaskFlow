import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react';
import TaskCard from './TaskCard';

const KanbanBoard = ({
  tasks = [],
  onStatusChange,
  onTaskClick,
  onQuickAddTask,
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    {
      id: 'Todo',
      title: 'To Do',
      icon: CircleDot,
      color: 'bg-slate-500',
      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'In Progress',
      title: 'In Progress',
      icon: Clock,
      color: 'bg-amber-500',
      badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    },
    {
      id: 'Completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    },
  ];

  const handleDragStart = (e, task) => {
    setDraggedTaskId(task._id);
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (columnId) => {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    setDragOverColumn(null);
    setDraggedTaskId(null);

    if (taskId && onStatusChange) {
      onStatusChange(taskId, columnId);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start pb-8">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const Icon = column.icon;
        const isTarget = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={() => handleDragLeave(column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
            className={`flex flex-col bg-slate-100/60 dark:bg-slate-900/40 rounded-3xl p-4 border transition-all duration-200 min-h-[500px] ${
              isTarget
                ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 dark:bg-brand-950/10'
                : 'border-slate-200/70 dark:border-slate-800'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${column.color}`} />
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                  {column.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${column.badgeClass}`}>
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => onQuickAddTask && onQuickAddTask(column.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards Container */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={onTaskClick}
                  onDragStart={handleDragStart}
                  isDraggable={true}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                  <span>No tasks in {column.title}</span>
                  <button
                    onClick={() => onQuickAddTask && onQuickAddTask(column.id)}
                    className="mt-2 text-brand-600 dark:text-brand-400 font-medium hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add task
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
