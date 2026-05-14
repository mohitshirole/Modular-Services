import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import logger from '../../utils/logger.js';

/**
 * Functional Factory for AWS SES Provider
 */
export const createAwsSesProvider = (config = {}) => {
  const client = new SESClient({
    region: config.region || process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: config.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: config.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const from = config.from || process.env.AWS_SES_FROM || process.env.SMTP_FROM;

  return {
    name: 'aws-ses',
    channel: 'email',

    send: async ({ to, subject, message, html }) => {
      try {
        const command = new SendEmailCommand({
          Destination: { ToAddresses: [to] },
          Message: {
            Body: {
              Html: { Data: html || message, Charset: "UTF-8" },
              Text: { Data: message, Charset: "UTF-8" },
            },
            Subject: { Data: subject, Charset: "UTF-8" },
          },
          Source: from,
        });

        const response = await client.send(command);
        logger.info(`Email sent via AWS SES: ${response.MessageId}`);
        return { success: true, messageId: response.MessageId };
      } catch (error) {
        logger.error(`AWS SES Send Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
