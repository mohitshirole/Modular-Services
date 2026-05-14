import crypto from 'crypto';
import { createSmtpProvider } from '../providers/email/smtp.js';
import { createAwsSesProvider } from '../providers/email/aws-ses.js';
import { createAzureEmailProvider } from '../providers/email/azure-email.js';
import { createSendGridProvider } from '../providers/email/sendgrid.js';
import { createTwoFactorProvider } from '../providers/sms/2factor.js';
import { createTwilioProvider } from '../providers/sms/twilio.js';
import { createUltraMsgProvider } from '../providers/whatsapp/ultramsg.js';
import { createInteraktProvider } from '../providers/whatsapp/interakt.js';
import { createDoubleTickProvider } from '../providers/whatsapp/doubletick.js';
import { createMetaProvider } from '../providers/whatsapp/meta-official.js';
import { createSlackProvider } from '../providers/slack.js';
import logger from '../utils/logger.js';

const PROVIDER_FACTORIES = {
  'smtp': createSmtpProvider,
  'aws-ses': createAwsSesProvider,
  'azure-email': createAzureEmailProvider,
  'sendgrid': createSendGridProvider,
  '2factor': createTwoFactorProvider,
  'twilio': createTwilioProvider,
  'ultramsg': createUltraMsgProvider,
  'interakt': createInteraktProvider,
  'doubletick': createDoubleTickProvider,
  'meta': createMetaProvider,
  'slack': createSlackProvider,
};

/**
 * Advanced Factory class with Multi-Client Caching
 */
class ProviderFactory {
  constructor() {
    this.instances = new Map(); // Cache map: { "providerName-configHash": instance }
  }

  /**
   * Generates a unique hash for a configuration object
   */
  _generateHash(config) {
    if (!config || Object.keys(config).length === 0) return 'default';
    return crypto.createHash('md5').update(JSON.stringify(config)).digest('hex');
  }

  /**
   * Get a provider instance (Cached or New)
   */
  getProvider(name, config = {}) {
    const providerName = name.toLowerCase();
    const factory = PROVIDER_FACTORIES[providerName];

    if (!factory) {
      logger.error(`Unsupported provider requested: ${name}`);
      throw new Error(`Unsupported provider: ${name}`);
    }

    // Generate a unique key for this provider + config combo
    const configHash = this._generateHash(config);
    const instanceKey = `${providerName}-${configHash}`;

    // Return cached instance if it exists
    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey);
    }

    // Create and cache new instance
    logger.info(`Initializing new provider instance: ${instanceKey}`);
    const instance = factory(config);
    
    // Optional: Limit cache size if you have millions of clients
    if (this.instances.size > 1000) {
      const firstKey = this.instances.keys().next().value;
      this.instances.delete(firstKey);
    }

    this.instances.set(instanceKey, instance);
    return instance;
  }

  getAvailableProviders() {
    return Object.keys(PROVIDER_FACTORIES);
  }
}

export default new ProviderFactory();
