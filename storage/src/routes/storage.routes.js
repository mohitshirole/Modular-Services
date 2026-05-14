import express from 'express';
import * as storageController from '../controllers/storage.controller.js';
import { uploadMiddleware } from '../middleware/upload.js';

const router = express.Router();

/**
 * @route   POST /api/v1/storage/upload
 * @desc    Upload a file (Images, Docs, etc.)
 */
router.post('/upload', uploadMiddleware.single('file'), storageController.uploadFile);

/**
 * @route   POST /api/v1/storage/url
 * @desc    Get a signed temporary URL (For S3/Cloud)
 */
router.post('/url', storageController.getSignedUrl);

export default router;
