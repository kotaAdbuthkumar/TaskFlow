import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Kanban,
  BarChart3,
  Bell,
  Settings,
  ShieldAlert,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Sidebar = ({
  currentPath,
  onNavigate,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Kanban', path: '/kanban', icon: Kanban },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    ...(isAdmin
      ? [{ label: 'Admin Panel', path: '/admin', icon: ShieldAlert, adminBadge: true }]
      : []),
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleNavClick = (path) => {
    onNavigate(path);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800/80">
          <div
            onClick={() => handleNavClick('/dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 fill-white" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  Task<span className="text-brand-600 dark:text-brand-400">Flow</span>
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Productivity System
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}

                {/* Badge Indicator */}
                {!isCollapsed && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-brand-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
                {!isCollapsed && item.adminBadge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    Admin
                  </span>
                )}
                {isCollapsed && item.badge > 0 && (
                  <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout Bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div
            onClick={() => handleNavClick('/profile')}
            className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isCollapsed ? 'justify-center p-1' : ''
            }`}
          >
            <img
              src={
                user?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user?.name || 'User')}`
              }
              alt={user?.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-500/20"
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-snug">
                  {user?.name || 'TaskFlow User'}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                  {user?.email || 'user@taskflow.com'}
                </p>
              </div>
            )}
          </div>

          {/* Action Row */}
          {!isCollapsed && (
            <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-2">
              <button
                onClick={() => handleNavClick('/profile')}
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 font-medium"
              >
                <User className="w-3.5 h-3.5" />
                Profile
              </button>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 hover:text-rose-600 dark:hover:text-rose-400 font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
