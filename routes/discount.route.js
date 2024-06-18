import { Router } from 'express';
import * as discountController from '../controllers/discount.controller.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = Router()

router.post('/', protect, admin, discountController.createDiscount)
router.get('/', discountController.getAllDiscounts)
router.get('/:id', discountController.getDiscountById)
router.put('/:id', protect, admin, discountController.updateDiscount)
router.delete('/:id', protect, admin, discountController.deleteDiscount)

export default router