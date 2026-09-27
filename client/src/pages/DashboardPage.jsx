import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  FolderKanban,
  Calendar,
  ArrowRight,
  TrendingUp,
  Plus,
  Flame,
  CheckSquare,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { formatDate, isOverdue } from '../utils/formatDate';
import { DashboardStatsSkeleton } from '../components/common/LoadingSkeleton';
import TaskDetailsModal from '../components/tasks/TaskDetailsModal';
import TaskModal from '../components/tasks/TaskModal';

const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosClient.get('/analytics/dashboard');
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-64 animate-pulse" />
        <DashboardStatsSkeleton />
      </div>
    );
  }

  const stats = data?.stats || {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    dueTodayTasks: 0,
    dueThisWeekTasks: 0,
    completionPercentage: 0,
  };

  const chartData = data?.productivityChart || [];
  const recentTasks = data?.recentTasks || [];
  const upcomingDeadlines = data?.upcomingDeadlines || [];
  const projectsProgress = data?.projectsProgress || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Greeting & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'there'} 👋
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Here's what is happening with your tasks and projects today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/tasks')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors shadow-xs"
          >
            View All Tasks
          </button>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Task
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Total Tasks</span>
            <div className="p-2.5 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalTasks}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              {stats.dueThisWeekTasks} due this week
            </span>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Completed
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stats.completedTasks}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {stats.completionPercentage}%
              </span>
            </div>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              Overall completion rate
            </span>
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Pending
            </span>
            <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.pendingTasks}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              {stats.dueTodayTasks} due today
            </span>
          </div>
        </div>

        {/* Overdue Tasks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Overdue
            </span>
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.overdueTasks}
            </span>
            <span className="text-xs text-rose-500 font-medium block mt-1">
              Requires immediate focus
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Productivity Chart & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart (2 columns wide) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Productivity Trend (Last 7 Days)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Tasks completed vs newly created tasks
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                Completed
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                Created
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCompleted)"
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#94a3b8"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Deadlines Widget (1 column wide) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Upcoming Deadlines
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/calendar')}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Calendar
            </button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-72">
            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center">
                No pressing deadlines coming up!
              </p>
            ) : (
              upcomingDeadlines.map((task) => (
                <div
                  key={task._id}
                  onClick={() => setSelectedTaskId(task._id)}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-brand-500/40 dark:hover:border-brand-500/30 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-400">
                      {task.project?.name || 'Task'}
                    </span>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-1.5">
                    <Clock className="w-3 h-3" />
                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Recent Tasks
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Tasks recently updated across your workspaces
            </p>
          </div>
          <button
            onClick={() => onNavigate('/tasks')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            All Tasks
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 overflow-x-auto">
          {recentTasks.map((task) => (
            <div
              key={task._id}
              onClick={() => setSelectedTaskId(task._id)}
              className="py-3 px-2 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: task.project?.color || '#94a3b8' }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {task.project?.name || 'No Project'} • Due {formatDate(task.dueDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Progress Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Projects Progress
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Active milestones and completion status
            </p>
          </div>
          <button
            onClick={() => onNavigate('/projects')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            Manage Projects
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projectsProgress.map((p) => (
            <div
              key={p._id}
              onClick={() => onNavigate(`/tasks?project=${p._id}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs hover:border-brand-500/40 dark:hover:border-brand-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-lg"
                    style={{ backgroundColor: p.color || '#6366f1' }}
                  />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {p.name}
                  </h4>
                </div>
                <span className="text-xs font-bold" style={{ color: p.color || '#6366f1' }}>
                  {p.progress}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.progress}%`, backgroundColor: p.color || '#6366f1' }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>{p.completedTasks} completed</span>
                <span>{p.totalTasks} total</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Details Modal */}
      {selectedTaskId && (
        <TaskDetailsModal
          taskId={selectedTaskId}
          isOpen={!!selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
          onEditTask={(task) => {
            setTaskToEdit(task);
            setIsTaskModalOpen(true);
          }}
          onTaskUpdated={() => fetchDashboardData()}
          onTaskDeleted={() => fetchDashboardData()}
        />
      )}

      {/* Task Edit / Create Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        onTaskSaved={() => fetchDashboardData()}
      />
    </div>
  );
};

export default DashboardPage;
