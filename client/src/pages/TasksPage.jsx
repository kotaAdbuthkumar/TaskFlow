import React, { useState, useEffect, useCallback } from 'react';
import {
  List,
  Kanban as KanbanIcon,
  Calendar as CalendarIcon,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import TaskListView from '../components/tasks/TaskListView';
import KanbanBoard from '../components/tasks/KanbanBoard';
import CalendarView from '../components/tasks/CalendarView';
import TaskModal from '../components/tasks/TaskModal';
import TaskDetailsModal from '../components/tasks/TaskDetailsModal';
import ConfirmModal from '../components/common/ConfirmModal';
import { useToast } from '../context/ToastContext';

const TasksPage = ({ initialProjectFilter = null, initialSearchQuery = '' }) => {
  const { success, error } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban' | 'calendar'

  // Filter & Search states
  const [search, setSearch] = useState(initialSearchQuery);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState(initialProjectFilter || 'all');
  const [dueDateFilter, setDueDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [projectsList, setProjectsList] = useState([]);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Modals
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [prefilledDate, setPrefilledDate] = useState(null);
  const [prefilledStatus, setPrefilledStatus] = useState('Todo');

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch projects list for filter dropdown
  useEffect(() => {
    axiosClient
      .get('/projects')
      .then((res) => setProjectsList(res.projects || []))
      .catch((err) => console.error('Error fetching projects:', err));
  }, []);

  // Fetch tasks with all filters applied
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append('search', search.trim());
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (priorityFilter !== 'all') params.append('priority', priorityFilter);
      if (projectFilter !== 'all') params.append('project', projectFilter);
      if (dueDateFilter !== 'all') params.append('dueDateFilter', dueDateFilter);
      if (sortBy) params.append('sortBy', sortBy);

      const res = await axiosClient.get(`/tasks?${params.toString()}`);
      setTasks(res.tasks || []);
    } catch (err) {
      error(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, priorityFilter, projectFilter, dueDateFilter, sortBy, error]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handle Kanban Drag and Drop Status Change
  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await axiosClient.patch(`/tasks/${taskId}/status`, { status: newStatus });
      success(`Moved task to ${newStatus}`);
    } catch (err) {
      error(err.message || 'Failed to update task status');
      fetchTasks(); // revert on failure
    }
  };

  // Toggle complete from list view
  const handleToggleComplete = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Todo' : 'Completed';
    handleStatusChange(task._id, newStatus);
  };

  // Delete Task Confirm
  const handleDeleteTaskConfirm = async () => {
    if (!taskToDelete) return;
    setDeleting(true);
    try {
      await axiosClient.delete(`/tasks/${taskToDelete._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskToDelete._id));
      success('Task deleted successfully');
      setTaskToDelete(null);
    } catch (err) {
      error(err.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setProjectFilter('all');
    setDueDateFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    search ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    projectFilter !== 'all' ||
    dueDateFilter !== 'all' ||
    sortBy !== 'newest';

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            My Tasks
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Organize, prioritize, and manage tasks across your projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle Switch */}
          <div className="flex items-center p-1 bg-slate-200/70 dark:bg-slate-800 rounded-2xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>

          <button
            onClick={() => {
              setTaskToEdit(null);
              setPrefilledDate(null);
              setPrefilledStatus('Todo');
              setIsTaskModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            New Task
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, description, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Quick Filter Selects */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500"
            >
              <option value="all">All Statuses</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Project Filter */}
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500 max-w-[140px] truncate"
            >
              <option value="all">All Projects</option>
              {projectsList.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Due Date Filter */}
            <select
              value={dueDateFilter}
              onChange={(e) => setDueDateFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500"
            >
              <option value="all">Any Due Date</option>
              <option value="today">Due Today</option>
              <option value="week">Due This Week</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 outline-none focus:border-brand-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="recentlyUpdated">Recently Updated</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Views Container */}
      {viewMode === 'list' && (
        <TaskListView
          tasks={tasks}
          onTaskClick={(task) => setSelectedTaskId(task._id)}
          onEditTask={(task) => {
            setTaskToEdit(task);
            setIsTaskModalOpen(true);
          }}
          onDeleteTask={(task) => setTaskToDelete(task)}
          onToggleComplete={handleToggleComplete}
          onOpenCreateTask={() => setIsTaskModalOpen(true)}
        />
      )}

      {viewMode === 'kanban' && (
        <KanbanBoard
          tasks={tasks}
          onStatusChange={handleStatusChange}
          onTaskClick={(task) => setSelectedTaskId(task._id)}
          onQuickAddTask={(colStatus) => {
            setTaskToEdit(null);
            setPrefilledDate(null);
            setPrefilledStatus(colStatus);
            setIsTaskModalOpen(true);
          }}
        />
      )}

      {viewMode === 'calendar' && (
        <CalendarView
          tasks={tasks}
          onTaskClick={(task) => setSelectedTaskId(task._id)}
          onDateClick={(dateStr) => {
            setTaskToEdit(null);
            setPrefilledDate(dateStr);
            setPrefilledStatus('Todo');
            setIsTaskModalOpen(true);
          }}
        />
      )}

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
          onTaskUpdated={() => fetchTasks()}
          onTaskDeleted={() => fetchTasks()}
        />
      )}

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
          setPrefilledDate(null);
        }}
        taskToEdit={taskToEdit}
        initialDate={prefilledDate}
        initialStatus={prefilledStatus}
        initialProject={projectFilter !== 'all' ? projectFilter : null}
        onTaskSaved={() => fetchTasks()}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTaskConfirm}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Task"
        loading={deleting}
      />
    </div>
  );
};

export default TasksPage;
