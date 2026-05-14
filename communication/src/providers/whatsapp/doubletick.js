import axios from 'axios';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for DoubleTick Provider
 */
export const createDoubleTickProvider = (config = {}) => {
  const apiKey = config.apiKey || process.env.DOUBLETICK_API_KEY;
  const baseUrl = 'https://api.doubletick.io/v1/whatsapp/message';

  return {
    name: 'doubletick',
    channel: 'whatsapp',

    send: async ({ to, message, template }) => {
      try {
        const payload = {
          to: to.startsWith('+') ? to : `+${to}`,
        };

        let endpoint = '/text';

        if (template) {
          endpoint = '/template';
          payload.template = {
            name: template.name,
            languageCode: template.languageCode || 'en',
            bodyValues: template.bodyValues || []
          };
        } else {
          payload.content = { text: message };
        }

        const response = await axios.post(`${baseUrl}${endpoint}`, payload, {
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.status === 'success') {
          logger.info(`WhatsApp sent via DoubleTick: ${response.data.messageId}`);
          return { success: true, messageId: response.data.messageId };
        } else {
          throw new Error(response.data.message || 'Failed to send');
        }
      } catch (error) {
        logger.error(`DoubleTick Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
