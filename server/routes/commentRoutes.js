import express from 'express';
import {
  getTaskComments,
  addComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// Directly mounted at /api/comments
router.delete('/:id', deleteComment);

// For convenience, also support /api/tasks/:id/comments in taskRoutes or here
export { getTaskComments, addComment, deleteComment };
export default router;
