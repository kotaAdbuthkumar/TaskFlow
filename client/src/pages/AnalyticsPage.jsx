import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  Zap,
  FolderKanban,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { priorityConfig } from '../utils/priorityColors';

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosClient.get('/analytics/productivity');
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
        </div>
      </div>
    );
  }

  const { metrics, tasksByPriority, tasksByStatus, tasksByProject, weeklyData, monthlyData } = data;

  const PRIORITY_COLORS = {
    Urgent: '#f43f5e',
    High: '#f97316',
    Medium: '#3b82f6',
    Low: '#94a3b8',
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Productivity Analytics
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Detailed metrics and visual reports on your task performance and milestones.
        </p>
      </div>

      {/* Top Stat Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-brand-600 dark:text-brand-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </span>
            <Award className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {metrics.completionRate}%
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {metrics.completedTasks} of {metrics.totalTasks} tasks resolved
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tasks Completed
            </span>
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {metrics.completedTasks}
          </span>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Total historical completed items
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overdue Tasks
            </span>
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {metrics.overdueTasks}
          </span>
          <p className="text-xs text-rose-500 font-medium mt-1">
            Tasks past due date requiring action
          </p>
        </div>
      </div>

      {/* Row 1: Weekly & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Completion Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tasks Completed per Week
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Weekly progress over the past 4 weeks
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trend Line Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Monthly Productivity Trend
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Completions over the past 6 months
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Priority Distribution & Project Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tasks by Priority (Donut Chart) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tasks by Priority
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Distribution of tasks across priority tiers
            </p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByPriority}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {tasksByPriority.map((entry) => (
                    <Cell
                      key={entry.priority}
                      fill={PRIORITY_COLORS[entry.priority] || '#94a3b8'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Project */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-3xl shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Tasks by Project
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Workload and completion status by category
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={tasksByProject}
                margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pending" stackId="a" fill="#6366f1" name="Pending" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
