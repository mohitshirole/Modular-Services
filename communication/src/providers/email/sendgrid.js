import sgMail from '@sendgrid/mail';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for SendGrid Email Provider
 */
export const createSendGridProvider = (config = {}) => {
  const apiKey = config.apiKey || process.env.SENDGRID_API_KEY;
  const from = config.from || process.env.SENDGRID_FROM || process.env.SMTP_FROM;
  
  sgMail.setApiKey(apiKey);

  return {
    name: 'sendgrid',
    channel: 'email',

    send: async ({ to, subject, message, html }) => {
      try {
        const msg = {
          to,
          from,
          subject,
          text: message,
          html: html || message,
        };

        const [response] = await sgMail.send(msg);
        
        // SendGrid returns 202 Accepted on success
        const msgId = response.headers['x-message-id'];
        logger.info(`Email sent via SendGrid: ${msgId}`);
        return { success: true, messageId: msgId };
      } catch (error) {
        const errorMsg = error.response ? error.response.body.errors[0].message : error.message;
        logger.error(`SendGrid Send Error: ${errorMsg}`);
        return { success: false, error: errorMsg };
      }
    }
  };
};
