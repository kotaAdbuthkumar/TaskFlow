import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { priorityConfig } from '../../utils/priorityColors';

const CalendarView = ({
  tasks = [],
  onTaskClick,
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of current month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Number of days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Number of days in previous month
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Group tasks by day (YYYY-MM-DD)
  const tasksByDate = {};
  tasks.forEach((task) => {
    if (task.dueDate) {
      const dateKey = task.dueDate.split('T')[0];
      if (!tasksByDate[dateKey]) {
        tasksByDate[dateKey] = [];
      }
      tasksByDate[dateKey].push(task);
    }
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Calendar cells generation
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
      tasks: tasksByDate[dateStr] || [],
    });
  }

  // 2. Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    // Format YYYY-MM-DD in local time
    const yyyy = cellDate.getFullYear();
    const mm = String(cellDate.getMonth() + 1).padStart(2, '0');
    const dd = String(cellDate.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
      tasks: tasksByDate[dateStr] || [],
    });
  }

  // 3. Next month leading days to complete grid (42 cells: 6 rows of 7)
  const remainingCells = 42 - calendarCells.length;
  for (let nextD = 1; nextD <= remainingCells; nextD++) {
    const nextDate = new Date(year, month + 1, nextD);
    const dateStr = nextDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum: nextD,
      isCurrentMonth: false,
      tasks: tasksByDate[dateStr] || [],
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors border-l border-slate-200 dark:border-slate-700"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Names Header */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Calendar Day Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarCells.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => onDateClick && onDateClick(cell.dateStr)}
            className={`min-h-[105px] sm:min-h-[115px] p-2 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col group relative ${
              cell.isToday
                ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-500/60 ring-2 ring-brand-500/20'
                : cell.isCurrentMonth
                ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/70 dark:border-slate-800 hover:border-brand-300 dark:hover:border-slate-700'
                : 'bg-transparent border-transparent opacity-40 hover:opacity-75'
            }`}
          >
            {/* Date Number & Quick Add */}
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                  cell.isToday
                    ? 'bg-brand-600 text-white shadow-xs'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {cell.dayNum}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDateClick && onDateClick(cell.dateStr);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-opacity"
                title={`Add task on ${cell.dateStr}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tasks in this day */}
            <div className="space-y-1 flex-1 overflow-y-auto max-h-[75px]">
              {cell.tasks.slice(0, 3).map((task) => {
                const priorityDot = priorityConfig[task.priority]?.dot || 'bg-slate-400';
                const isCompleted = task.status === 'Completed';

                return (
                  <div
                    key={task._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick && onTaskClick(task);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium truncate flex items-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] ${
                      isCompleted
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 line-through'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700/80'
                    }`}
                    title={task.title}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityDot}`} />
                    <span className="truncate">{task.title}</span>
                  </div>
                );
              })}

              {cell.tasks.length > 3 && (
                <div className="text-[10px] text-slate-400 font-semibold px-1">
                  +{cell.tasks.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
