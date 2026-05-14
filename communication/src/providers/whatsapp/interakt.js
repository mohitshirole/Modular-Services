import axios from 'axios';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for Interakt Provider
 */
export const createInteraktProvider = (config = {}) => {
  const apiKey = config.apiKey || process.env.INTERAKT_API_KEY;
  const baseUrl = 'https://api.interakt.ai/v1/public';

  return {
    name: 'interakt',
    channel: 'whatsapp',

    send: async ({ to, message, template }) => {
      try {
        const payload = {
          fullPhoneNumber: to.startsWith('+') ? to : `+${to}`,
        };

        if (template) {
          payload.type = 'Template';
          payload.template = {
            name: template.name,
            languageCode: template.languageCode || 'en',
            bodyValues: template.bodyValues || []
          };
        } else {
          payload.type = 'Text';
          payload.text = message;
        }

        const response = await axios.post(`${baseUrl}/message/`, payload, {
          headers: {
            'Authorization': `Basic ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.result) {
          logger.info(`WhatsApp sent via Interakt: ${response.data.id}`);
          return { success: true, messageId: response.data.id };
        } else {
          throw new Error(response.data.message || 'Failed to send');
        }
      } catch (error) {
        logger.error(`Interakt Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
