import paymentFactory from '../services/payment-factory.js';
import logger from '../utils/logger.js';
import { reportEvent } from '../utils/telemetry.js';

/**
 * Create a Payment Order/Intent
 */
export const createOrder = async (req, res) => {
  const { provider: providerName, amount, currency, receipt, notes, config } = req.body;

  try {
    const provider = paymentFactory.getProvider(providerName, config || {});
    const result = await provider.createOrder({ amount, currency, receipt, notes });

    if (result.success) {
      await reportEvent('ORDER_CREATED', 'info', { provider: providerName, amount, receipt });
      res.status(201).json(result);
    } else {
      await reportEvent('ORDER_FAILED', 'error', { provider: providerName, error: result.error });
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Order Error: ${error.message}`);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

/**
 * Verify Payment Signature/Status
 */
export const verifyPayment = async (req, res) => {
  const { provider: providerName, orderId, paymentId, signature, config } = req.body;

  try {
    const provider = paymentFactory.getProvider(providerName, config || {});
    const result = await provider.verifyPayment({ orderId, paymentId, signature });

    if (result.success) {
      await reportEvent('PAYMENT_VERIFIED', 'info', { provider: providerName, paymentId, isValid: result.isValid });
      res.json(result);
    } else {
      await reportEvent('VERIFICATION_FAILED', 'warn', { provider: providerName, paymentId });
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Verify Error: ${error.message}`);
    await reportEvent('VERIFICATION_ERROR', 'error', { error: error.message });
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};

/**
 * Create a Refund
 */
export const createRefund = async (req, res) => {
  const { provider: providerName, paymentId, amount, notes, config } = req.body;

  try {
    const provider = paymentFactory.getProvider(providerName, config || {});
    const result = await provider.createRefund({ paymentId, amount, notes });

    if (result.success) {
      await reportEvent('REFUND_CREATED', 'info', { provider: providerName, paymentId, amount });
      res.status(201).json(result);
    } else {
      await reportEvent('REFUND_FAILED', 'error', { provider: providerName, paymentId, error: result.error });
      res.status(400).json(result);
    }
  } catch (error) {
    logger.error(`Controller Refund Error: ${error.message}`);
    await reportEvent('REFUND_ERROR', 'error', { error: error.message });
    res.status(500).json({ success: false, message: "Refund processing failed" });
  }
};

/**
 * Unified Webhook Handler (Advanced - Optional Forwarding)
 */
export const handleWebhook = async (req, res) => {
  // Webhooks are provider-specific, usually handled via separate endpoints
  // for different signature verification logic
  res.json({ success: true, message: "Webhook received" });
};
