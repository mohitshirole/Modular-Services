import axios from 'axios';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for 2Factor Provider
 */
export const createTwoFactorProvider = (config = {}) => {
  const apiKey = config.apiKey || process.env.TWOFACTOR_API_KEY;
  const baseUrl = `https://2factor.in/API/V1/${apiKey}/SMS`;

  return {
    name: '2factor',
    channel: 'sms',

    send: async ({ to, message }) => {
      try {
        const url = `${baseUrl}/${to}/${encodeURIComponent(message)}`;
        const response = await axios.get(url);

        if (response.data.Status === 'Success') {
          logger.info(`SMS sent via 2Factor: ${response.data.Details}`);
          return { success: true, messageId: response.data.Details };
        } else {
          throw new Error(response.data.Details || 'Unknown error');
        }
      } catch (error) {
        logger.error(`2Factor Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
