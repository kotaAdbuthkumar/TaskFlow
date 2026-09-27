import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Kanban,
  Calendar,
  BarChart3,
  Shield,
  ArrowRight,
  Zap,
  Users,
  Clock,
} from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col antialiased">
      {/* Navigation Header */}
      <header className="h-20 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
              Task<span className="text-brand-600 dark:text-brand-400">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('/register')}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-all"
            >
              Get Started Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
          <Zap className="w-4 h-4 fill-brand-500 text-brand-500" />
          Next-Generation Productivity & Task Tracking
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-6">
          Master your workflow with <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
            TaskFlow System
          </span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-8 leading-relaxed">
          Create, organize, prioritize, and complete tasks effortlessly. From dynamic Kanban boards and interactive calendars to productivity analytics and project milestone tracking.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3.5 mb-16">
          <button
            onClick={() => onNavigate('/login')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 active:scale-95 text-white text-base font-semibold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            Try Live Demo
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('/register')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-base font-semibold transition-all"
          >
            Create Free Account
          </button>
        </div>

        {/* App Dashboard Preview Mockup Card */}
        <div className="w-full rounded-3xl p-3 bg-gradient-to-b from-slate-200/50 to-slate-200/10 dark:from-slate-800/50 dark:to-slate-900/10 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 text-left border border-slate-100 dark:border-slate-800/80">
            {/* Top Bar Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">PRODUCTIVITY DASHBOARD</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Good morning, Alex 👋</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-200 dark:border-emerald-800">
                  92% Completion Rate
                </span>
                <span className="px-3 py-1 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 text-xs font-semibold rounded-lg border border-brand-200 dark:border-brand-800">
                  15 Active Tasks
                </span>
              </div>
            </div>

            {/* Quick Kanban preview columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-3">
                  <span>TO DO (4)</span>
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Calibrate ESP32 Sensors</div>
                  <div className="text-[11px] text-slate-400">IoT Project • Medium Priority</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 mb-3">
                  <span>IN PROGRESS (3)</span>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Build Portfolio Website</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Due Today • 4/5 steps</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3">
                  <span>COMPLETED (8)</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 line-through">Implement JWT Authentication</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Completed yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Designed for Peak Personal & Team Output
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Everything you need to break down complex projects into manageable steps and hit deadlines with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <Kanban className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Interactive Kanban Board</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Visualize task workflows from Todo to Done. Drag and drop cards seamlessly with immediate status updates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Visual Calendar View</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Plan out weeks and months. Click any date to instantly schedule tasks and prevent deadline bottlenecks.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Productivity Analytics</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track daily, weekly, and monthly completion trends with interactive Recharts visualizations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-600 dark:text-slate-400">
        TaskFlow – Professional Task Management System &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default LandingPage;
