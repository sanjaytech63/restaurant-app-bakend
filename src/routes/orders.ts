import express from 'express';

import { auth, adminAuth } from '../middleware/auth';
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/admin/all', auth, adminAuth, getAllOrders);
router.patch('/:id/status', auth, adminAuth, updateOrderStatus);

export default router;