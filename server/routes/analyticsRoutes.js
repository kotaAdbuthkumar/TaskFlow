import express from 'express';
import {
  getDashboardStats,
  getProductivityStats,
  getAdminStats,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/productivity', getProductivityStats);
router.get('/admin/stats', authorize('admin'), getAdminStats);

export default router;
