import express from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  adminCreateUser,
  adminDeleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getUsers)
  .post(authorize('admin'), adminCreateUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(authorize('admin'), adminDeleteUser);

export default router;
