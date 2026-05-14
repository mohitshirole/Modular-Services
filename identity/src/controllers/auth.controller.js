import jwt from 'jsonwebtoken';
import authentikService from '../services/authentik.service.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

/**
 * Initiate Login: Redirect user to Authentik
 */
export const login = async (req, res) => {
  try {
    const { redirect_uri } = req.query;
    
    // Store the dynamic redirect target in a secure cookie
    if (redirect_uri) {
      res.cookie('auth_redirect_target', redirect_uri, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 300000 // 5 minutes
      });
    }

    // Generate a random state to prevent CSRF
    const state = crypto.randomBytes(16).toString('hex');
    const authUrl = await authentikService.getAuthUrl(state);
    
    res.redirect(authUrl);
  } catch (error) {
    logger.error(`Login Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Could not initiate login" });
  }
};

/**
 * Handle Callback from Authentik
 */
export const callback = async (req, res) => {
  try {
    const params = authentikService.client.callbackParams(req);
    const { userinfo } = await authentikService.callback(params);

    // Create our own Unified JWT
    const payload = {
      sub: userinfo.sub,
      email: userinfo.email,
      name: userinfo.name,
      groups: userinfo['aks:groups'] || [],
      source: 'authentik'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
    });

    logger.info(`User logged in via Authentik: ${userinfo.email}`);

    // Retrieve the original redirect target from the cookie, or fallback to default
    const targetUrl = req.cookies.auth_redirect_target || process.env.AUTH_SUCCESS_REDIRECT;
    
    // Clear the redirect cookie
    res.clearCookie('auth_redirect_target');

    // Redirect to the dynamic target with the token
    const separator = targetUrl.includes('?') ? '&' : '?';
    res.redirect(`${targetUrl}${separator}token=${token}`);
  } catch (error) {
    logger.error(`Callback Error: ${error.message}`);
    res.redirect(process.env.AUTH_FAILURE_REDIRECT);
  }
};

/**
 * Verify Token (Used by other microservices)
 */
export const verifyToken = (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
    res.json({ success: true, user });
  });
};

/**
 * Get User Info
 */
export const me = (req, res) => {
  // This assumes the user is already verified via a middleware
  res.json({ success: true, user: req.user });
};
