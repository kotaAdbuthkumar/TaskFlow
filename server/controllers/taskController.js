import Task from '../models/Task.js';
import Notification from '../models/Notification.js';
import Comment from '../models/Comment.js';

// @desc    Get all tasks with filtering, search, and sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const {
      search,
      status,
      priority,
      project,
      assignedTo,
      tag,
      dueDateFilter, // 'today', 'week', 'overdue', 'month'
      sortBy = 'newest',
    } = req.query;

    const query = {};

    // Search by title, description, or tags
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Status filter (can be single or comma-separated)
    if (status && status !== 'all') {
      if (status.includes(',')) {
        query.status = { $in: status.split(',') };
      } else {
        query.status = status;
      }
    }

    // Priority filter
    if (priority && priority !== 'all') {
      if (priority.includes(',')) {
        query.priority = { $in: priority.split(',') };
      } else {
        query.priority = priority;
      }
    }

    // Project filter
    if (project && project !== 'all') {
      query.project = project;
    }

    // Assigned User filter
    if (assignedTo && assignedTo !== 'all') {
      query.assignedTo = assignedTo;
    }

    // Tag filter
    if (tag && tag !== 'all') {
      query.tags = tag;
    }

    // Due Date filters
    const now = new Date();
    if (dueDateFilter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      query.dueDate = { $gte: startOfDay, $lte: endOfDay };
    } else if (dueDateFilter === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 7);
      endOfWeek.setHours(23, 59, 59, 999);

      query.dueDate = { $gte: startOfWeek, $lte: endOfWeek };
    } else if (dueDateFilter === 'overdue') {
      query.dueDate = { $lt: now };
      query.status = { $ne: 'Completed' };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    switch (sortBy) {
      case 'oldest':
        sortOptions = { createdAt: 1 };
        break;
      case 'dueDate':
        sortOptions = { dueDate: 1 };
        break;
      case 'priority':
        // Custom priority sort can be handled via collation or post-sort, or standard
        sortOptions = { priority: 1, dueDate: 1 };
        break;
      case 'recentlyUpdated':
        sortOptions = { updatedAt: -1 };
        break;
      case 'newest':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }

    let tasks = await Task.find(query)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort(sortOptions);

    // If sorting by priority, apply custom priority order: Urgent > High > Medium > Low
    if (sortBy === 'priority') {
      const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
      tasks.sort((a, b) => (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0));
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID with comments
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name color description')
      .populate('assignedTo', 'name email avatar bio')
      .populate('createdBy', 'name email avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'userId',
          select: 'name email avatar',
        },
      });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      startDate,
      project,
      tags,
      assignedTo,
      subtasks,
      attachments,
      reminder,
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Task title is required' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'Todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      startDate: startDate || null,
      project: project || null,
      tags: tags || [],
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      subtasks: subtasks || [],
      attachments: attachments || [],
      reminder: reminder || null,
    });

    // Create notification if assigned to another user
    if (assignedTo && assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: assignedTo,
        type: 'assignment',
        message: `${req.user.name} assigned you a new task: "${task.title}"`,
        taskId: task._id,
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      startDate,
      project,
      tags,
      assignedTo,
      subtasks,
      attachments,
      reminder,
    } = req.body;

    const previousAssignee = task.assignedTo?.toString();
    const previousStatus = task.status;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (startDate !== undefined) task.startDate = startDate;
    if (project !== undefined) task.project = project || null;
    if (tags !== undefined) task.tags = tags;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (subtasks !== undefined) task.subtasks = subtasks;
    if (attachments !== undefined) task.attachments = attachments;
    if (reminder !== undefined) task.reminder = reminder;

    await task.save();

    // Trigger notification if assigned to someone new
    if (
      assignedTo &&
      assignedTo.toString() !== previousAssignee &&
      assignedTo.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        userId: assignedTo,
        type: 'assignment',
        message: `${req.user.name} assigned you to task: "${task.title}"`,
        taskId: task._id,
      });
    }

    // Trigger notification on completion to task creator if someone else completed it
    if (
      status === 'Completed' &&
      previousStatus !== 'Completed' &&
      task.createdBy.toString() !== req.user._id.toString()
    ) {
      await Notification.create({
        userId: task.createdBy,
        type: 'completion',
        message: `${req.user.name} completed your task: "${task.title}"`,
        taskId: task._id,
      });
    }

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update only task status (for Kanban drag & drop or quick mark complete)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status || !['Todo', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status provided' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.status = status;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name color')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}!`,
      task: populatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await Comment.deleteMany({ taskId: task._id });
    await Notification.deleteMany({ taskId: task._id });
    await Task.findByIdAndDelete(task._id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subtask to task
// @route   POST /api/tasks/:id/subtasks
// @access  Private
export const addSubtask = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Subtask title is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.subtasks.push({ title, completed: false });
    await task.save();

    res.status(201).json({
      success: true,
      message: 'Subtask added successfully!',
      subtasks: task.subtasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const toggleSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const subtask = task.subtasks.id(req.params.subtaskId);
    if (!subtask) {
      return res.status(404).json({ success: false, message: 'Subtask not found' });
    }

    subtask.completed = req.body.completed !== undefined ? req.body.completed : !subtask.completed;
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Subtask updated!',
      subtasks: task.subtasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
export const deleteSubtask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    task.subtasks.pull({ _id: req.params.subtaskId });
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Subtask removed!',
      subtasks: task.subtasks,
    });
  } catch (error) {
    next(error);
  }
};
