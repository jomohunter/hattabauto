import express from 'express';
import { createOrder, getOrders, getOrder, updateOrderStatus } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';
import { searchValidation } from '../middleware/validation';

const router = express.Router();

// Public route for creating orders (Buy Now)
router.post('/', createOrder);

// Protected routes for admin
router.get('/', authenticateToken, searchValidation, getOrders);
router.get('/:id', authenticateToken, getOrder);
router.patch('/:id/status', authenticateToken, updateOrderStatus);

export default router; 