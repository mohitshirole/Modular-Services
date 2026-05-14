import cron from 'node-cron';
import axios from 'axios';
import Job from '../models/job.model.js';
import logger from '../utils/logger.js';

class SchedulerService {
  constructor() {
    this.scheduledTasks = new Map(); // Store active cron tasks
  }

  /**
   * Load all active jobs from DB and schedule them
   */
  async init() {
    try {
      const activeJobs = await Job.findAll({ where: { active: true } });
      logger.info(`Found ${activeJobs.length} active jobs to schedule.`);
      
      for (const job of activeJobs) {
        this.scheduleJob(job);
      }
    } catch (error) {
      logger.error(`Initialization Error: ${error.message}`);
    }
  }

  /**
   * Schedule a single job in memory
   */
  scheduleJob(job) {
    // 1. Stop if already scheduled
    if (this.scheduledTasks.has(job.id)) {
      this.scheduledTasks.get(job.id).stop();
    }

    // 2. Create new cron task
    const task = cron.schedule(job.cron, async () => {
      logger.info(`⏰ Triggering Job: ${job.name} -> ${job.targetUrl}`);
      
      try {
        const startTime = Date.now();
        
        const response = await axios({
          method: job.method,
          url: job.targetUrl,
          data: job.payload,
          headers: {
            'Content-Type': 'application/json',
            ...(job.headers || {})
          }
        });

        const duration = Date.now() - startTime;
        logger.info(`✔ Job Executed: ${job.name} (Status: ${response.status}, Time: ${duration}ms)`);
      } catch (error) {
        logger.error(`❌ Job Failed: ${job.name} - ${error.message}`);
      }
    });

    // 3. Store reference
    this.scheduledTasks.set(job.id, task);
    logger.info(`✔ Scheduled: ${job.name} (${job.cron})`);
  }

  /**
   * Stop a scheduled job
   */
  stopJob(jobId) {
    if (this.scheduledTasks.has(jobId)) {
      this.scheduledTasks.get(jobId).stop();
      this.scheduledTasks.delete(jobId);
      logger.info(`Stopped Job ID: ${jobId}`);
    }
  }
}

export default new SchedulerService();
