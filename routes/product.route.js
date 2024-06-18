import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = Router()

router.post('/', protect, admin, productController.createProduct)
router.get('/', productController.getAllProducts)
router.get('/all', protect, admin, productController.adminGetAllProducts)
router.get('/:id', productController.getProductById)
router.put('/:id', protect, admin, productController.updateProduct)
router.put('/:id/updatequantity', protect, productController.updateProduct)
router.post('/:id/review', protect, productController.productReview)
router.delete('/:id', protect, admin, productController.deleteProduct)



export default router