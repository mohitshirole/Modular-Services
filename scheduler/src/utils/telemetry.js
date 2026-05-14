import axios from 'axios';

const TELEMETRY_URL = process.env.TELEMETRY_URL || 'http://localhost:4006/api/v1/telemetry/log';
const SERVICE_NAME = 'scheduler-service';

/**
 * Report an event to the central Telemetry Hub
 */
export const reportEvent = async (event, level = 'info', metadata = {}) => {
  try {
    const enrichedMetadata = {
      ...metadata,
      timestamp: new Date().toISOString(),
    };

    await axios.post(TELEMETRY_URL, {
      service: SERVICE_NAME,
      event,
      level,
      metadata: enrichedMetadata
    });
  } catch (error) {
    console.error(`[Telemetry-Client Error]: ${error.message}`);
  }
};
