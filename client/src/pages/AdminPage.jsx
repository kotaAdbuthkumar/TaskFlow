import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  CheckCircle2,
  FolderKanban,
  CheckSquare,
  Search,
  Plus,
  Trash2,
  UserCheck,
  UserX,
  Server,
  Activity,
  Cpu,
} from 'lucide-react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ConfirmModal from '../components/common/ConfirmModal';
import { formatDate } from '../utils/formatDate';

const AdminPage = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Create user modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('user');
  const [newUserBio, setNewUserBio] = useState('');
  const [creatingUser, setCreatingUser] = useState(false);

  // Delete user modal
  const [userToDelete, setUserToDelete] = useState(null);
  const [deletingUser, setDeletingUser] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        axiosClient.get('/analytics/admin/stats'),
        axiosClient.get('/users'),
      ]);
      setStats(statsRes.stats);
      setUsers(usersRes.users || []);
    } catch (err) {
      error(err.message || 'Failed to load admin panel data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg mx-auto">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-sm text-slate-500 mb-6">
          You must have administrator privileges to view this management dashboard.
        </p>
        <button
          onClick={() => onNavigate('/dashboard')}
          className="px-4 py-2 bg-brand-600 text-white text-xs font-semibold rounded-xl"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Toggle user status (active / disabled)
  const handleToggleStatus = async (targetUser) => {
    const newStatus = targetUser.status === 'active' ? 'disabled' : 'active';
    try {
      await axiosClient.put(`/users/${targetUser._id}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, status: newStatus } : u))
      );
      success(`User account ${newStatus === 'active' ? 'activated' : 'disabled'}`);
    } catch (err) {
      error(err.message || 'Failed to update user status');
    }
  };

  // Change user role
  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      await axiosClient.put(`/users/${targetUser._id}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
      );
      success(`User role changed to ${newRole}`);
    } catch (err) {
      error(err.message || 'Failed to update user role');
    }
  };

  // Handle Admin Create User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserPassword) {
      error('Please complete all required fields');
      return;
    }

    setCreatingUser(true);
    try {
      const res = await axiosClient.post('/users', {
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        password: newUserPassword,
        role: newUserRole,
        bio: newUserBio.trim(),
      });
      setUsers((prev) => [res.user, ...prev]);
      success('User account created successfully!');
      setIsCreateModalOpen(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserBio('');
    } catch (err) {
      error(err.message || 'Failed to create user');
    } finally {
      setCreatingUser(false);
    }
  };

  // Handle Admin Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setDeletingUser(true);
    try {
      await axiosClient.delete(`/users/${userToDelete._id}`);
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      success('User deleted successfully');
      setUserToDelete(null);
    } catch (err) {
      error(err.message || 'Failed to delete user');
    } finally {
      setDeletingUser(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              Admin Workspace
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            System Administration
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Monitor users, enforce security controls, and inspect system telemetry.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Create New User
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Users
              </span>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalUsers}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              {stats.activeUsers} active ({stats.adminUsers} admins)
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between text-brand-600 dark:text-brand-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Tasks
              </span>
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.totalTasks}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              Across all user accounts
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Completed Tasks
              </span>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.completedTasks}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              Resolved milestones
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Projects
              </span>
              <FolderKanban className="w-5 h-5" />
            </div>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.activeProjects}
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 block mt-1">
              Workspace categories
            </span>
          </div>
        </div>
      )}

      {/* System Telemetry Specs */}
      {stats?.systemStats && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-purple-400" />
            <h3 className="font-bold text-sm text-slate-200">System Telemetry & Health</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block">Node Runtime</span>
              <span className="text-slate-200 font-semibold">{stats.systemStats.nodeVersion}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Platform</span>
              <span className="text-slate-200 font-semibold">{stats.systemStats.platform}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Server Uptime</span>
              <span className="text-slate-200 font-semibold">{stats.systemStats.serverUptime}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Memory RSS</span>
              <span className="text-slate-200 font-semibold">{stats.systemStats.memoryUsage}</span>
            </div>
          </div>
        </div>
      )}

      {/* User Management Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              User Directory & Permissions
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Manage accounts, assign roles, and toggle access states.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-brand-500"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/75 dark:bg-slate-800/30 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.map((u) => {
                const isSelf = u._id === user._id;

                return (
                  <tr key={u._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            u.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name)}`
                          }
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {u.name} {isSelf && '(You)'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{u.email}</td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">{formatDate(u.createdAt)}</td>

                    <td className="py-3.5 px-4 text-right">
                      {!isSelf && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleRole(u)}
                            className="px-2 py-1 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Toggle role"
                          >
                            {u.role === 'admin' ? 'Demote' : 'Promote'}
                          </button>
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors ${
                              u.status === 'active'
                                ? 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400'
                                : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400'
                            }`}
                            title="Toggle account active/disabled"
                          >
                            {u.status === 'active' ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            onClick={() => setUserToDelete(u)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Create User Modal */}
      {isCreateModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCreateModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Create Team Member Account
            </h3>
            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Taylor Smith"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="taylor@company.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Initial Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">
                  Account Role
                </label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-purple-500"
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all disabled:opacity-50"
                >
                  {creatingUser ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirm Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDeleteUser}
        title="Delete User Account"
        message={`Are you sure you want to delete ${userToDelete?.name}'s account? Their assigned tasks will become unassigned.`}
        confirmText="Delete User"
        loading={deletingUser}
      />
    </div>
  );
};

export default AdminPage;
