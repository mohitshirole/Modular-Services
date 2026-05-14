import axios from 'axios';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for Meta Official Provider
 */
export const createMetaProvider = (config = {}) => {
  const accessToken = config.accessToken || process.env.META_ACCESS_TOKEN;
  const phoneNumberId = config.phoneNumberId || process.env.META_PHONE_NUMBER_ID;
  const version = config.version || 'v18.0';
  const baseUrl = `https://graph.facebook.com/${version}/${phoneNumberId}`;

  return {
    name: 'meta',
    channel: 'whatsapp',

    send: async ({ to, message, template }) => {
      try {
        const payload = {
          messaging_product: "whatsapp",
          to: to,
        };

        if (template) {
          payload.type = "template";
          payload.template = {
            name: template.name,
            language: { code: template.languageCode || 'en_US' },
            components: template.bodyValues ? [
              {
                type: "body",
                parameters: template.bodyValues.map(v => ({ type: "text", text: v }))
              }
            ] : []
          };
        } else {
          payload.type = "text";
          payload.text = { body: message };
        }

        const response = await axios.post(`${baseUrl}/messages`, payload, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.messages && response.data.messages.length > 0) {
          const msgId = response.data.messages[0].id;
          logger.info(`WhatsApp sent via Meta Official: ${msgId}`);
          return { success: true, messageId: msgId };
        } else {
          throw new Error('Failed to send via Meta');
        }
      } catch (error) {
        const errorDetail = error.response?.data?.error?.message || error.message;
        logger.error(`Meta Official Send Error: ${errorDetail}`);
        return { success: false, error: errorDetail };
      }
    }
  };
};
