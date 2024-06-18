import express from 'express'
import { uploadImage, deleteImage } from '../controllers/image.controller.js'; 
import { protect, admin } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadImages.js';

const router = express.Router();

router.post('/upload-image', protect, admin, upload.single('image'), uploadImage);
router.delete('/delete-image', protect, admin, deleteImage)


export default router;