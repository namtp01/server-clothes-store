import { Router } from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, admin, categoryController.createCategory);
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', protect, admin, categoryController.updateCategory);
router.delete('/:id', protect, admin, categoryController.deleteCategory);

export default router