import axios from 'axios';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for UltraMsg Provider
 */
export const createUltraMsgProvider = (config = {}) => {
  const instanceId = config.instanceId || process.env.ULTRAMSG_INSTANCE_ID;
  const token = config.token || process.env.ULTRAMSG_TOKEN;
  const baseUrl = `https://api.ultramsg.com/${instanceId}`;

  return {
    name: 'ultramsg',
    channel: 'whatsapp',

    send: async ({ to, message }) => {
      try {
        const response = await axios.post(`${baseUrl}/messages/chat`, {
          token,
          to: to.includes('@') ? to : `${to}@c.us`,
          body: message,
          priority: 10
        });

        if (response.data.sent === 'true') {
          logger.info(`WhatsApp sent via UltraMsg: ${response.data.id}`);
          return { success: true, messageId: response.data.id };
        } else {
          throw new Error(response.data.error || 'Failed to send');
        }
      } catch (error) {
        logger.error(`UltraMsg Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
