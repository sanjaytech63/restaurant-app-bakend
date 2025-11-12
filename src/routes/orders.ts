import express from 'express';

import { auth, adminAuth } from '../middleware/auth';
import { createOrder, deleteOrder, getAllOrders, getUserOrders, updateOrderStatus } from '../controllers/orderController';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/admin/all', auth, adminAuth, getAllOrders);
router.patch('/:id/status', auth, adminAuth, updateOrderStatus);
router.delete('/:id', auth, adminAuth, deleteOrder);

export default router;