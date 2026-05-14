import crypto from 'crypto';
import { createRazorpayProvider } from '../providers/razorpay.js';
import { createStripeProvider } from '../providers/stripe.js';
import logger from '../utils/logger.js';

const PAYMENT_FACTORIES = {
  'razorpay': createRazorpayProvider,
  'stripe': createStripeProvider,
};

class PaymentFactory {
  constructor() {
    this.instances = new Map();
  }

  _generateHash(config) {
    if (!config || Object.keys(config).length === 0) return 'default';
    return crypto.createHash('md5').update(JSON.stringify(config)).digest('hex');
  }

  getProvider(name, config = {}) {
    const providerName = name.toLowerCase();
    const factory = PAYMENT_FACTORIES[providerName];

    if (!factory) {
      logger.error(`Unsupported payment provider: ${name}`);
      throw new Error(`Unsupported provider: ${name}`);
    }

    const configHash = this._generateHash(config);
    const instanceKey = `${providerName}-${configHash}`;

    if (this.instances.has(instanceKey)) {
      return this.instances.get(instanceKey);
    }

    const instance = factory(config);
    this.instances.set(instanceKey, instance);
    
    return instance;
  }
}

export default new PaymentFactory();
