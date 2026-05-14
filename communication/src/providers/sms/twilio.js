import twilio from 'twilio';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for Twilio SMS Provider
 */
export const createTwilioProvider = (config = {}) => {
  const accountSid = config.accountSid || process.env.TWILIO_ACCOUNT_SID;
  const authToken = config.authToken || process.env.TWILIO_AUTH_TOKEN;
  const from = config.from || process.env.TWILIO_FROM;
  
  const client = twilio(accountSid, authToken);

  return {
    name: 'twilio',
    channel: 'sms',

    send: async ({ to, message }) => {
      try {
        const response = await client.messages.create({
          body: message,
          from: from,
          to: to
        });

        logger.info(`SMS sent via Twilio: ${response.sid}`);
        return { success: true, messageId: response.sid };
      } catch (error) {
        logger.error(`Twilio Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
