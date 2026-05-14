import { createRazorpayProvider } from '../providers/razorpay.js';
import logger from '../utils/logger.js';

/**
 * Create a Razorpay Order
 */
export const createOrder = async (req, res) => {
  const { amount, currency, receipt, notes, config } = req.body;

  try {
    const provider = createRazorpayProvider(config || {});
    const result = await provider.createOrder({ amount, currency, receipt, notes });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Order Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

/**
 * Verify Razorpay Signature
 */
export const verifyPayment = async (req, res) => {
  const { orderId, paymentId, signature, config } = req.body;

  try {
    const provider = createRazorpayProvider(config || {});
    const result = provider.verifyPayment({ orderId, paymentId, signature });

    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Verify Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

/**
 * Create a Refund
 */
export const createRefund = async (req, res) => {
  const { paymentId, amount, notes, config } = req.body;

  try {
    const provider = createRazorpayProvider(config || {});
    const result = await provider.createRefund({ paymentId, amount, notes });

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Refund Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Refund processing failed" });
  }
};

/**
 * Unified Razorpay Webhook Handler
 */
export const handleWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET; // Master secret or fetched per client

  try {
    // 1. Verify Webhook Signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      logger.warn('Invalid Webhook Signature Received');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    logger.info(`Payment Webhook Received: ${event}`);

    // 2. Here you could trigger a call to the Telemetry microservice
    // Or forward this to the specific App that owns this payment

    res.json({ success: true });
  } catch (error) {
    logger.error(`Webhook Error: ${error.message}`);
    res.status(500).json({ success: false });
  }
};
