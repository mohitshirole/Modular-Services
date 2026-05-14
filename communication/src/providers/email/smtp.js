import nodemailer from 'nodemailer';
import logger from '../../utils/logger.js';

/**
 * Functional Factory for SMTP Provider
 */
export const createSmtpProvider = (config = {}) => {
  const transporter = nodemailer.createTransport({
    host: config.host || process.env.SMTP_HOST,
    port: config.port || process.env.SMTP_PORT,
    secure: (config.port || process.env.SMTP_PORT) == 465,
    auth: {
      user: config.user || process.env.SMTP_USER,
      pass: config.pass || process.env.SMTP_PASS,
    },
  });

  const from = config.from || process.env.SMTP_FROM;

  return {
    name: 'smtp',
    channel: 'email',

    send: async ({ to, subject, message, html }) => {
      try {
        const info = await transporter.sendMail({
          from,
          to,
          subject,
          text: message,
          html: html || message,
        });

        logger.info(`Email sent via SMTP: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        logger.error(`SMTP Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    testConnection: async () => {
      try {
        await transporter.verify();
        return { success: true, message: "SMTP Connection Verified" };
      } catch (error) {
        return { success: false, error: error.message };
      }
    }
  };
};
