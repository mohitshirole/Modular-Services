import Event from '../models/event.model.js';
import logger from '../utils/logger.js';

/**
 * Log a new event
 */
export const logEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, id: event.id });
  } catch (error) {
    logger.error(`Logging Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to record event" });
  }
};

/**
 * Get filtered logs
 */
export const getLogs = async (req, res) => {
  try {
    const { appId, userId, service, limit, offset } = req.query;
    
    const where = {};
    if (appId) where.appId = appId;
    if (userId) where.userId = userId;
    if (service) where.service = service;

    const { count, rows } = await Event.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      total: count,
      data: rows
    });
  } catch (error) {
    logger.error(`Fetch Logs Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Failed to fetch logs" });
  }
};

/**
 * Get system stats summary
 */
export const getStats = async (req, res) => {
  try {
    // Basic stats like total requests today, top service, etc.
    // This is where you'd add your logic for a dashboard
    const total = await Event.count();
    res.json({ success: true, total_events: total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
