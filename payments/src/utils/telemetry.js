import axios from 'axios';

const TELEMETRY_URL = process.env.TELEMETRY_URL || 'http://localhost:4006/api/v1/telemetry/log';
const SERVICE_NAME = 'payments-hub';

/**
 * Report an event to the central Telemetry Hub
 */
export const reportEvent = async (event, level = 'info', metadata = {}) => {
  try {
    // Add basic system info to metadata
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
    // Fail silently to avoid crashing the main application if telemetry is down
    console.error(`[Telemetry-Client Error]: ${error.message}`);
  }
};
