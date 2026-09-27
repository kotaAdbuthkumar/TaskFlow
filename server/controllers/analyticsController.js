import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Get dashboard metrics and summaries
// @route   GET /api/analytics/dashboard
// @access  Private
export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();

    // Start and end of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Start and end of current week
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    endOfWeek.setHours(23, 59, 59, 999);

    // Counts
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const todoTasks = await Task.countDocuments({ status: 'Todo' });
    const pendingTasks = totalTasks - completedTasks;

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: now },
      status: { $ne: 'Completed' },
    });

    const dueTodayTasks = await Task.countDocuments({
      dueDate: { $gte: startOfToday, $lte: endOfToday },
      status: { $ne: 'Completed' },
    });

    const dueThisWeekTasks = await Task.countDocuments({
      dueDate: { $gte: startOfWeek, $lte: endOfWeek },
      status: { $ne: 'Completed' },
    });

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Recent tasks
    const recentTasks = await Task.find()
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .sort({ updatedAt: -1 })
      .limit(6);

    // Upcoming deadlines (next 14 days, non-completed)
    const upcomingDeadlines = await Task.find({
      dueDate: { $gte: startOfToday },
      status: { $ne: 'Completed' },
    })
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .sort({ dueDate: 1 })
      .limit(6);

    // Last 7 days productivity (daily completions)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

      const dayName = dayStart.toLocaleDateString('en-US', { weekday: 'short' });

      const completedCount = await Task.countDocuments({
        status: 'Completed',
        completedAt: { $gte: dayStart, $lte: dayEnd },
      });

      const createdCount = await Task.countDocuments({
        createdAt: { $gte: dayStart, $lte: dayEnd },
      });

      last7Days.push({
        day: dayName,
        date: dayStart.toISOString().split('T')[0],
        completed: completedCount,
        created: createdCount,
      });
    }

    // Projects summary with progress
    const projects = await Project.find().limit(5);
    const projectsProgress = await Promise.all(
      projects.map(async (p) => {
        const pTotal = await Task.countDocuments({ project: p._id });
        const pCompleted = await Task.countDocuments({ project: p._id, status: 'Completed' });
        const progress = pTotal > 0 ? Math.round((pCompleted / pTotal) * 100) : 0;
        return {
          _id: p._id,
          name: p.name,
          color: p.color,
          totalTasks: pTotal,
          completedTasks: pCompleted,
          progress,
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        todoTasks,
        overdueTasks,
        dueTodayTasks,
        dueThisWeekTasks,
        completionPercentage,
      },
      recentTasks,
      upcomingDeadlines,
      productivityChart: last7Days,
      projectsProgress,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get detailed analytics charts and distributions
// @route   GET /api/analytics/productivity
// @access  Private
export const getProductivityStats = async (req, res, next) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' },
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tasks by priority
    const priorityCounts = await Task.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const prioritiesOrder = ['Low', 'Medium', 'High', 'Urgent'];
    const tasksByPriority = prioritiesOrder.map((pri) => {
      const found = priorityCounts.find((p) => p._id === pri);
      return {
        priority: pri,
        count: found ? found.count : 0,
      };
    });

    // Tasks by status
    const statusCounts = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statuses = ['Todo', 'In Progress', 'Completed', 'Cancelled'];
    const tasksByStatus = statuses.map((st) => {
      const found = statusCounts.find((s) => s._id === st);
      return {
        status: st,
        count: found ? found.count : 0,
      };
    });

    // Tasks by Project
    const projects = await Project.find();
    const tasksByProject = await Promise.all(
      projects.map(async (project) => {
        const total = await Task.countDocuments({ project: project._id });
        const completed = await Task.countDocuments({
          project: project._id,
          status: 'Completed',
        });
        return {
          name: project.name,
          color: project.color,
          total,
          completed,
          pending: total - completed,
        };
      })
    );

    // Completed per week (past 4 weeks)
    const now = new Date();
    const weeklyData = [];
    for (let w = 3; w >= 0; w--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (w * 7 + 6));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - w * 7);
      weekEnd.setHours(23, 59, 59, 999);

      const count = await Task.countDocuments({
        status: 'Completed',
        completedAt: { $gte: weekStart, $lte: weekEnd },
      });

      weeklyData.push({
        week: `Week ${4 - w}`,
        completed: count,
      });
    }

    // Completed per month (past 6 months)
    const monthlyData = [];
    for (let m = 5; m >= 0; m--) {
      const mDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const mStart = new Date(mDate.getFullYear(), mDate.getMonth(), 1);
      const mEnd = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const monthName = mStart.toLocaleDateString('en-US', { month: 'short' });
      const count = await Task.countDocuments({
        status: 'Completed',
        completedAt: { $gte: mStart, $lte: mEnd },
      });

      monthlyData.push({
        month: monthName,
        completed: count,
      });
    }

    res.status(200).json({
      success: true,
      metrics: {
        totalTasks,
        completedTasks,
        overdueTasks,
        completionRate,
      },
      tasksByPriority,
      tasksByStatus,
      tasksByProject,
      weeklyData,
      monthlyData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get system and overview statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });

    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'Completed' });
    const activeProjects = await Project.countDocuments();

    const systemStats = {
      nodeVersion: process.version,
      platform: process.platform,
      serverUptime: `${Math.floor(process.uptime() / 60)} minutes`,
      memoryUsage: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
    };

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        adminUsers,
        totalTasks,
        completedTasks,
        activeProjects,
        systemStats,
      },
    });
  } catch (error) {
    next(error);
  }
};
