import express from 'express';
import * as paymentsController from '../controllers/payments.controller.js';
import * as schemas from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/v1/payments/order
 * @desc    Create a new Razorpay Order
 */
router.post('/order', schemas.validate(schemas.orderSchema), paymentsController.createOrder);

/**
 * @route   POST /api/v1/payments/verify
 * @desc    Verify Razorpay Payment Signature
 */
router.post('/verify', schemas.validate(schemas.verifySchema), paymentsController.verifyPayment);

/**
 * @route   POST /api/v1/payments/refund
 * @desc    Create a Razorpay Refund
 */
router.post('/refund', schemas.validate(schemas.refundSchema), paymentsController.createRefund);

/**
 * @route   POST /api/v1/payments/webhook
 * @desc    Centralized Razorpay Webhook Receiver
 */
router.post('/webhook', paymentsController.handleWebhook);

export default router;
