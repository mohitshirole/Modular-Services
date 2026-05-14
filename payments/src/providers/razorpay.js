import Razorpay from 'razorpay';
import crypto from 'crypto';
import logger from '../utils/logger.js';

/**
 * Functional Factory for Razorpay Provider
 */
export const createRazorpayProvider = (config = {}) => {
  const instance = new Razorpay({
    key_id: config.keyId || process.env.RAZORPAY_KEY_ID,
    key_secret: config.keySecret || process.env.RAZORPAY_KEY_SECRET,
  });

  return {
    name: 'razorpay',

    /**
     * Create a new Order
     */
    createOrder: async ({ amount, currency = 'INR', receipt, notes = {} }) => {
      try {
        // Edge Case: Amount 0
        if (amount <= 0) {
          logger.info(`Free Order Requested: ${receipt}`);
          return { success: true, free: true, message: "No payment required for zero amount" };
        }

        const options = {
          amount: Math.round(amount * 100), // Ensure integer for paise
          currency,
          receipt,
          notes
        };

        const order = await instance.orders.create(options);
        logger.info(`Razorpay Order Created: ${order.id}`);
        return { success: true, order };
      } catch (error) {
        logger.error(`Razorpay Order Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    /**
     * Create a Refund
     */
    createRefund: async ({ paymentId, amount, notes = {} }) => {
      try {
        const options = { payment_id: paymentId, notes };
        if (amount) options.amount = Math.round(amount * 100);

        const refund = await instance.payments.refund(paymentId, options);
        logger.info(`Razorpay Refund Created: ${refund.id} for Payment: ${paymentId}`);
        return { success: true, refund };
      } catch (error) {
        logger.error(`Razorpay Refund Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    /**
     * Verify Payment Signature
     */
    verifyPayment: ({ orderId, paymentId, signature }) => {
      try {
        const body = orderId + "|" + paymentId;
        const expectedSignature = crypto
          .createHmac("sha256", config.keySecret || process.env.RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest("hex");

        const isValid = expectedSignature === signature;
        
        if (isValid) {
          logger.info(`Razorpay Payment Verified: ${paymentId}`);
        } else {
          logger.warn(`Razorpay Signature Mismatch: ${paymentId}`);
        }

        return { success: true, isValid };
      } catch (error) {
        logger.error(`Razorpay Verification Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
