import express from 'express';
import * as sheetsController from '../controllers/sheets.controller.js';
import * as schemas from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/sheets/metadata
 * @desc    Get tabs and headers for a spreadsheet
 */
router.post('/metadata', schemas.validate(schemas.metadataSchema), sheetsController.getMetadata);

/**
 * @route   POST /api/v1/sheets/read
 * @desc    Read and combine data from multiple tabs
 */
router.post('/read', schemas.validate(schemas.readSchema), sheetsController.readData);

/**
 * @route   POST /api/v1/sheets/sync
 * @desc    Update existing rows or append new ones based on a unique key
 */
router.post('/sync', schemas.validate(schemas.syncSchema), sheetsController.syncData);

export default router;
