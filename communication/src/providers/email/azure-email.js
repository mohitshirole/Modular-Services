import { EmailClient } from "@azure/communication-email";
import logger from '../../utils/logger.js';

/**
 * Functional Factory for Azure Email Provider
 */
export const createAzureEmailProvider = (config = {}) => {
  const client = new EmailClient(config.connectionString || process.env.AZURE_COMM_CONNECTION_STRING);
  const from = config.from || process.env.AZURE_EMAIL_FROM;

  return {
    name: 'azure-email',
    channel: 'email',

    send: async ({ to, subject, message, html }) => {
      try {
        const emailMessage = {
          senderAddress: from,
          content: {
            subject: subject,
            plainText: message,
            html: html || message,
          },
          recipients: {
            to: [{ address: to }],
          },
        };

        const poller = await client.beginSend(emailMessage);
        const result = await poller.pollUntilDone();

        logger.info(`Email sent via Azure: ${result.id}`);
        return { success: true, messageId: result.id };
      } catch (error) {
        logger.error(`Azure Email Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
