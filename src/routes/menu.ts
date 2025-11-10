import express from 'express';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController';
import { adminAuth, auth } from '../middleware/auth';

const router = express.Router();

router.get('/', getMenuItems);
router.post('/', auth, adminAuth, createMenuItem);
router.patch('/:id', auth, adminAuth, updateMenuItem);
router.delete('/:id', auth, adminAuth, deleteMenuItem);

export default router;