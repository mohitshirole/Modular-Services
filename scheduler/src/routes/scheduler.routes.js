import express from 'express';
import * as schedulerController from '../controllers/scheduler.controller.js';
import * as schemas from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/v1/scheduler/jobs
 * @desc    Get all scheduled jobs
 */
router.get('/jobs', schedulerController.getJobs);

/**
 * @route   POST /api/v1/scheduler/jobs
 * @desc    Create a new scheduled job
 */
router.post('/jobs', schemas.validate(schemas.jobSchema), schedulerController.createJob);

/**
 * @route   POST /api/v1/scheduler/jobs/:id/toggle
 * @desc    Activate/Deactivate a job
 */
router.post('/jobs/:id/toggle', schedulerController.toggleJob);

/**
 * @route   DELETE /api/v1/scheduler/jobs/:id
 * @desc    Remove a job
 */
router.delete('/jobs/:id', schedulerController.deleteJob);

export default router;
