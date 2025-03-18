import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/userController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.post('/login', authUser);
router.post('/', registerUser);
router.get('/profile', protect, getUserProfile);

export default router; 