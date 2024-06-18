import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', userController.login);
router.post('/', userController.register);

router.post('/forgot-password-token', userController.forgotPasswordToken);
router.put('/reset-password/:token', userController.resetPassword);

router.put('/', protect, userController.updateUserProfile)
router.get('/profile', protect, userController.getUserProfile);
router.get('/', protect, admin, userController.adminGetAllUsers)
router.delete('/:id', protect, admin, userController.deleteUser);

export default router;