import express from 'express';
import * as commController from '../controllers/comm.controller.js';
import * as schemas from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/comm/send
 * @desc    Send a message via any provider (Email, SMS, WhatsApp)
 */
router.post('/send', schemas.validate(schemas.sendSchema), commController.sendMessage);

/**
 * @route   POST /api/v1/comm/test
 * @desc    Test connection for a specific provider
 */
router.post('/test', commController.testConnection);

/**
 * @route   GET /api/v1/comm/providers
 * @desc    List all available providers
 */
router.get('/providers', commController.listProviders);

export default router;
