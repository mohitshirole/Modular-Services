import express from 'express';
import * as pdfController from '../controllers/pdf.controller.js';
import * as schemas from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/pdf/render
 * @desc    Generate PDF and stream it (binary)
 */
router.post('/render', schemas.validate(schemas.renderSchema), pdfController.renderPdf);

/**
 * @route   POST /api/v1/pdf/render-base64
 * @desc    Generate PDF and return as base64 string
 */
router.post('/render-base64', schemas.validate(schemas.renderSchema), pdfController.renderPdfBase64);

export default router;
