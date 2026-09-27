import Comment from '../models/Comment.js';
import Task from '../models/Task.js';
import Notification from '../models/Notification.js';

// @desc    Get comments for a specific task
// @route   GET /api/tasks/:id/comments
// @access  Private
export const getTaskComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ taskId: req.params.id })
      .populate('userId', 'name email avatar role')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a task
// @route   POST /api/tasks/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const comment = await Comment.create({
      taskId: task._id,
      userId: req.user._id,
      content: content.trim(),
    });

    // Add comment reference to task
    task.comments.push(comment._id);
    await task.save();

    const populatedComment = await Comment.findById(comment._id).populate(
      'userId',
      'name email avatar role'
    );

    // Notify task assignee if someone else commented
    if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: task.assignedTo,
        type: 'comment',
        message: `${req.user.name} commented on "${task.title}": "${content.slice(0, 40)}${content.length > 40 ? '...' : ''}"`,
        taskId: task._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment: populatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Only allow comment creator or admin to delete
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment',
      });
    }

    await Task.findByIdAndUpdate(comment.taskId, {
      $pull: { comments: comment._id },
    });

    await Comment.findByIdAndDelete(comment._id);

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
