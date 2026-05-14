import crypto from 'crypto';
import { createLocalProvider } from '../providers/local.js';
import { createS3Provider } from '../providers/s3.js';
import { createAzureProvider } from '../providers/azure.js';
import logger from '../utils/logger.js';

const STORAGE_FACTORIES = {
  'local': createLocalProvider,
  's3': createS3Provider,
  'azure': createAzureProvider,
};

class StorageFactory {
  constructor() {
    this.instances = new Map();
  }

  _generateHash(config) {
    if (!config || Object.keys(config).length === 0) return 'default';
    return crypto.createHash('md5').update(JSON.stringify(config)).digest('hex');
  }

  getProvider(name, config = {}) {
    const providerName = name.toLowerCase();
    const factory = STORAGE_FACTORIES[providerName];

    if (!factory) {
      logger.error(`Unsupported storage provider: ${name}`);
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

export default new StorageFactory();
