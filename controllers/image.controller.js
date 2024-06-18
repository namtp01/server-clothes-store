import expressAsyncHandler from "express-async-handler"
import fs from 'fs'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const uploadImage = expressAsyncHandler(async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        res.status(200).json({ url: result.secure_url })

        // Delete temporary file from local storage
        fs.unlinkSync(req.file.path);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const deleteImage = expressAsyncHandler(async (req, res) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            return res.status(400).json({ message: 'No file selected' });
        }

        await cloudinary.uploader.destroy(publicId);
        res.status(200).json({ message: 'Image deleted' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export { uploadImage, deleteImage }