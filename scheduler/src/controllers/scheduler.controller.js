import Job from '../models/job.model.js';
import schedulerService from '../services/scheduler.service.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

/**
 * Create and Schedule a Job
 */
export const createJob = async (req, res) => {
  try {
    const job = await Job.create(req.body);
    
    // Activate in memory if active
    if (job.active) {
      schedulerService.scheduleJob(job);
    }

    await reportEvent('JOB_CREATED', 'info', { name: job.name, cron: job.cron });
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    logger.error(`Create Job Error: ${error.message}`);
    await reportEvent('JOB_CREATE_FAILED', 'error', { error: error.message });
    res.status(500).json({ success: false, message: "Failed to create job" });
  }
};

/**
 * Get all Jobs
 */
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch jobs" });
  }
};

/**
 * Delete and Unschedule a Job
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // Stop in memory
    schedulerService.stopJob(id);
    
    // Delete from DB
    await job.destroy();

    res.json({ success: true, message: "Job deleted and unscheduled" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete job" });
  }
};

/**
 * Toggle Job Status
 */
export const toggleJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.active = !job.active;
    await job.save();

    if (job.active) {
      schedulerService.scheduleJob(job);
    } else {
      schedulerService.stopJob(id);
    }

    res.json({ success: true, active: job.active });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to toggle job" });
  }
};
