import providerFactory from '../services/provider-factory.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

/**
 * Main Send Endpoint
 */
export const sendMessage = async (req, res) => {
  const { provider, to, message, subject, html, template, config } = req.body;

  try {
    logger.info(`Processing send request: Provider=${provider}, To=${to}`);
    
    // 1. Get the provider from factory
    const providerInstance = providerFactory.getProvider(provider, config);

    // 2. Execute send
    const result = await providerInstance.send({ to, message, subject, html, template });

    if (result.success) {
      await reportEvent('MESSAGE_SENT', 'info', { provider, to, messageId: result.messageId });
      res.json({ success: true, messageId: result.messageId });
    } else {
      await reportEvent('MESSAGE_FAILED', 'error', { provider, to, error: result.error });
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    logger.error(`Controller Error: ${error.message}`);
    await reportEvent('COMM_CONTROLLER_ERROR', 'error', { error: error.message });
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Test Provider Connection
 */
export const testConnection = async (req, res) => {
  const { provider, config } = req.body;
  try {
    const providerInstance = providerFactory.getProvider(provider, config);
    const result = await providerInstance.testConnection();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get available providers
 */
export const listProviders = (req, res) => {
  res.json({ 
    success: true, 
    providers: providerFactory.getAvailableProviders() 
  });
};
