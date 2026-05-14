import express from 'express';
import * as telemetryController from '../controllers/telemetry.controller.js';
import * as schemas from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/telemetry/log
 * @desc    Record a new system event
 */
router.post('/log', schemas.validate(schemas.eventSchema), telemetryController.logEvent);

/**
 * @route   GET /api/v1/telemetry/logs
 * @desc    Retrieve filtered audit logs
 */
router.get('/logs', schemas.validate(schemas.querySchema), telemetryController.getLogs);

/**
 * @route   GET /api/v1/telemetry/stats
 * @desc    Get usage statistics
 */
router.get('/stats', telemetryController.getStats);

export default router;
