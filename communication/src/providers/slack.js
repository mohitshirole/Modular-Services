import { WebClient } from '@slack/web-api';
import logger from '../utils/logger.js';

/**
 * Functional Factory for Slack Provider
 */
export const createSlackProvider = (config = {}) => {
  const client = new WebClient(config.token || process.env.SLACK_TOKEN);

  return {
    name: 'slack',
    channel: 'slack',

    send: async ({ to, message, template }) => {
      try {
        const payload = {
          channel: to,
          text: message,
        };

        // Optional: Support Slack blocks if a template is provided
        if (template && template.blocks) {
          payload.blocks = template.blocks;
        }

        const response = await client.chat.postMessage(payload);

        if (response.ok) {
          logger.info(`Slack message sent to ${to}: ${response.ts}`);
          return { success: true, messageId: response.ts };
        } else {
          throw new Error(response.error || 'Failed to send Slack message');
        }
      } catch (error) {
        logger.error(`Slack Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
