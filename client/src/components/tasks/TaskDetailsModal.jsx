import React, { useState, useEffect } from 'react';
import {
  X,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
  ListTodo,
  CheckSquare,
  Tag,
  Paperclip,
  Share2,
} from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDate, timeAgo, isOverdue } from '../../utils/formatDate';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ConfirmModal from '../common/ConfirmModal';

const TaskDetailsModal = ({
  taskId,
  isOpen,
  onClose,
  onEditTask,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchTaskDetails = async () => {
    if (!taskId) return;
    setLoading(true);
    try {
      const [taskRes, commentsRes] = await Promise.all([
        axiosClient.get(`/tasks/${taskId}`),
        axiosClient.get(`/tasks/${taskId}/comments`),
      ]);
      setTask(taskRes.task);
      setComments(commentsRes.comments || []);
    } catch (err) {
      error(err.message || 'Failed to load task details');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskDetails();
    } else {
      setTask(null);
      setComments([]);
      setNewComment('');
    }
  }, [isOpen, taskId]);

  if (!isOpen || !task) return null;

  // Toggle Subtask
  const handleToggleSubtask = async (subtaskId) => {
    try {
      const res = await axiosClient.patch(`/tasks/${task._id}/subtasks/${subtaskId}`);
      const updatedSubtasks = res.subtasks;
      setTask((prev) => ({ ...prev, subtasks: updatedSubtasks }));
      if (onTaskUpdated) {
        onTaskUpdated({ ...task, subtasks: updatedSubtasks });
      }
    } catch (err) {
      error('Failed to update subtask');
    }
  };

  // Change Task Status directly
  const handleStatusChange = async (newStatus) => {
    try {
      const res = await axiosClient.patch(`/tasks/${task._id}/status`, { status: newStatus });
      setTask(res.task);
      success(`Status updated to ${newStatus}`);
      if (onTaskUpdated) onTaskUpdated(res.task);
    } catch (err) {
      error(err.message || 'Failed to update status');
    }
  };

  // Post Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await axiosClient.post(`/tasks/${task._id}/comments`, {
        content: newComment.trim(),
      });
      setComments((prev) => [...prev, res.comment]);
      setNewComment('');
      success('Comment posted!');
    } catch (err) {
      error(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    try {
      await axiosClient.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      success('Comment removed');
    } catch (err) {
      error('Failed to delete comment');
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    setDeleting(true);
    try {
      await axiosClient.delete(`/tasks/${task._id}`);
      success('Task deleted successfully');
      setShowDeleteConfirm(false);
      onClose();
      if (onTaskDeleted) onTaskDeleted(task._id);
    } catch (err) {
      error(err.message || 'Failed to delete task');
    } finally {
      setDeleting(false);
    }
  };

  // Subtask progress calculation
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl my-6 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <PriorityBadge priority={task.priority} />
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onEditTask(task);
                }}
                className="p-2 rounded-xl text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Edit task"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Scroll Content */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Title & Project Tag */}
            <div>
              {task.project && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: task.project.color || '#6366f1' }}
                  />
                  {task.project.name}
                </div>
              )}
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {task.title}
              </h1>
            </div>

            {/* Description */}
            <div className="bg-slate-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Description
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {task.description || 'No description provided.'}
              </p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800/20 border border-slate-200/80 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Due Date</span>
                <div
                  className={`font-semibold flex items-center gap-1.5 ${
                    overdue
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(task.dueDate)}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Start Date</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {task.startDate ? formatDate(task.startDate) : 'Not set'}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Assignee</span>
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {task.assignedTo ? (
                    <>
                      <img
                        src={
                          task.assignedTo.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(task.assignedTo.name)}`
                        }
                        alt={task.assignedTo.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="truncate">{task.assignedTo.name}</span>
                    </>
                  ) : (
                    'Unassigned'
                  )}
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Created By</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {task.createdBy?.name || 'User'}
                </span>
              </div>
            </div>

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-slate-400 shrink-0" />
                {task.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Subtasks Section */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <ListTodo className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Subtasks ({completedSubtasks}/{totalSubtasks})
                  </h4>
                </div>
                {totalSubtasks > 0 && (
                  <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                    {subtaskPercentage}% completed
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {totalSubtasks > 0 && (
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all duration-300"
                    style={{ width: `${subtaskPercentage}%` }}
                  />
                </div>
              )}

              {totalSubtasks === 0 ? (
                <p className="text-xs text-slate-400 italic">No subtasks defined for this task.</p>
              ) : (
                <div className="space-y-2">
                  {task.subtasks.map((st) => (
                    <label
                      key={st._id}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => handleToggleSubtask(st._id)}
                        className="w-4 h-4 text-brand-600 rounded border-slate-300 dark:border-slate-700 focus:ring-brand-500 cursor-pointer"
                      />
                      <span
                        className={`text-sm flex-1 ${
                          st.completed
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-800 dark:text-slate-200 font-medium'
                        }`}
                      >
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Comments Section */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Activity & Comments ({comments.length})
                </h4>
              </div>

              {/* Comments list */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No comments yet. Start the conversation!</p>
                ) : (
                  comments.map((c) => {
                    const isOwnComment = c.userId?._id === user?._id || c.userId === user?._id;
                    return (
                      <div
                        key={c._id}
                        className="p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                c.userId?.avatar ||
                                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(c.userId?.name || 'User')}`
                              }
                              alt={c.userId?.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              {c.userId?.name || 'User'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {timeAgo(c.createdAt)}
                            </span>
                          </div>

                          {(isOwnComment || isAdmin) && (
                            <button
                              onClick={() => handleDeleteComment(c._id)}
                              className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                              title="Delete comment"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-7">
                          {c.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={submittingComment || !newComment.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Delete Task Dialog */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmText="Delete Task"
        loading={deleting}
      />
    </>
  );
};

export default TaskDetailsModal;
