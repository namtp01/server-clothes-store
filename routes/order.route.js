import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, orderController.createOrder);
router.get('/all', protect, admin, orderController.adminGetAllOrders);
router.get('/:id', protect, orderController.getOrderById);
router.get('/', protect, orderController.getUserOrders);
router.put('/:id/pay', protect, orderController.payOrder);
router.put('/:id/delivered', protect, orderController.orderDelivered);

router.post('/send-order-details', protect, orderController.sendUserOrderByEmail);

export default router