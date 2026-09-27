import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout
import Layout from './components/layout/Layout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  // Internal routing state synced with URL pathname & search
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [searchParams, setSearchParams] = useState(() => new URLSearchParams(window.location.search));

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setSearchParams(new URLSearchParams(window.location.search));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to) => {
    const [path, search] = to.split('?');
    window.history.pushState({}, '', to);
    setCurrentPath(path);
    setSearchParams(new URLSearchParams(search || ''));
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Loading TaskFlow...
          </span>
        </div>
      </div>
    );
  }

  // Unauthenticated routes
  if (!isAuthenticated) {
    if (currentPath === '/login') {
      return <LoginPage onNavigate={navigate} />;
    }
    if (currentPath === '/register') {
      return <RegisterPage onNavigate={navigate} />;
    }
    if (currentPath === '/forgot-password') {
      return <ForgotPasswordPage onNavigate={navigate} />;
    }
    if (currentPath === '/reset-password') {
      return (
        <ResetPasswordPage
          onNavigate={navigate}
          initialToken={searchParams.get('token') || ''}
        />
      );
    }
    return <LandingPage onNavigate={navigate} />;
  }

  // If authenticated and visiting landing/auth pages, default to dashboard
  let effectivePath = currentPath;
  if (['/', '/login', '/register', '/forgot-password', '/reset-password'].includes(currentPath)) {
    effectivePath = '/dashboard';
  }

  // Render authenticated page within App Layout shell
  return (
    <Layout
      currentPath={effectivePath}
      onNavigate={navigate}
      onTaskCreated={() => {
        // Refresh event
      }}
    >
      {effectivePath === '/dashboard' && <DashboardPage onNavigate={navigate} />}

      {effectivePath === '/tasks' && (
        <TasksPage
          initialProjectFilter={searchParams.get('project')}
          initialSearchQuery={searchParams.get('search') || ''}
        />
      )}

      {effectivePath === '/kanban' && (
        <TasksPage initialProjectFilter={searchParams.get('project')} />
      )}

      {effectivePath === '/calendar' && (
        <TasksPage initialProjectFilter={searchParams.get('project')} />
      )}

      {effectivePath === '/projects' && <ProjectsPage onNavigate={navigate} />}

      {effectivePath === '/analytics' && <AnalyticsPage />}

      {effectivePath === '/notifications' && <NotificationsPage onNavigate={navigate} />}

      {(effectivePath === '/profile' || effectivePath === '/settings') && <ProfilePage />}

      {effectivePath === '/admin' && <AdminPage onNavigate={navigate} />}
    </Layout>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
