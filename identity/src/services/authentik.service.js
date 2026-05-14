import { Issuer, custom } from 'openid-client';
import logger from '../utils/logger.js';

// Increase timeout for slow self-hosted instances
custom.setHttpOptionsDefaults({
  timeout: 10000,
});

class AuthentikService {
  constructor() {
    this.client = null;
    this.issuer = null;
  }

  /**
   * Initialize the OIDC client by discovering Authentik configuration
   */
  async init() {
    if (this.client) return this.client;

    try {
      logger.info(`Discovering Authentik at: ${process.env.AUTHENTIK_DISCOVERY_URL}`);
      
      this.issuer = await Issuer.discover(process.env.AUTHENTIK_DISCOVERY_URL);
      
      this.client = new this.issuer.Client({
        client_id: process.env.AUTHENTIK_CLIENT_ID,
        client_secret: process.env.AUTHENTIK_CLIENT_SECRET,
        redirect_uris: [process.env.AUTHENTIK_REDIRECT_URI],
        response_types: ['code'],
      });

      logger.info('✔ Authentik OIDC Client Initialized');
      return this.client;
    } catch (error) {
      logger.error(`Authentik Discovery Failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate the Authorization URL to redirect the user to Authentik
   */
  async getAuthUrl(state) {
    const client = await this.init();
    return client.authorizationUrl({
      scope: 'openid email profile',
      state: state,
    });
  }

  /**
   * Exchange the authorization code for user info
   */
  async callback(params, state) {
    const client = await this.init();
    
    // Validate the callback and exchange code for tokens
    const tokenSet = await client.callback(process.env.AUTHENTIK_REDIRECT_URI, params, { state });
    
    // Fetch user profile info
    const userinfo = await client.userinfo(tokenSet);
    
    return { tokenSet, userinfo };
  }
}

export default new AuthentikService();
