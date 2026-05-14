import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @route   GET /api/v1/auth/login
 * @desc    Redirect to Authentik Login
 */
router.get('/login', authController.login);

/**
 * @route   GET /api/v1/auth/callback
 * @desc    Authentik Redirect Callback
 */
router.get('/callback', authController.callback);

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify a JWT token
 */
router.get('/verify', authController.verifyToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile (requires token)
 */
// In a full implementation, we'd add the verify middleware here too
router.get('/me', authController.me);

export default router;
