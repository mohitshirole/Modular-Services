import express from 'express';
import { executeReport, testConnection } from '../controllers/tally.controller.js';
import { validateTallyRequest } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/tally/execute
 * @desc    Execute a Tally report by ID
 */
router.post('/execute', validateTallyRequest, executeReport);

/**
 * @route   POST /api/v1/tally/test
 * @desc    Test connection to a Tally ERP instance
 * @access  Public (Internal)
 */
router.post('/test', testConnection);

export default router;
