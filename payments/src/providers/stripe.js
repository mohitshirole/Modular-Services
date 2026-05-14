import Stripe from 'stripe';
import logger from '../utils/logger.js';

/**
 * Functional Factory for Stripe Provider
 */
export const createStripeProvider = (config = {}) => {
  const stripe = new Stripe(config.secretKey || process.env.STRIPE_SECRET_KEY);

  return {
    name: 'stripe',

    /**
     * Create a new PaymentIntent (Equivalent to Razorpay Order)
     */
    createOrder: async ({ amount, currency = 'inr', receipt, notes = {} }) => {
      try {
        // Edge Case: Amount 0
        if (amount <= 0) {
          logger.info(`Free Order Requested (Stripe): ${receipt}`);
          return { success: true, free: true, message: "No payment required for zero amount" };
        }

        const intent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Stripe expects amount in cents
          currency: currency.toLowerCase(),
          description: receipt,
          metadata: notes
        });

        logger.info(`Stripe Intent Created: ${intent.id}`);
        return { success: true, order: intent, clientSecret: intent.client_secret };
      } catch (error) {
        logger.error(`Stripe Intent Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    /**
     * Create a Refund
     */
    createRefund: async ({ paymentId, amount, notes = {} }) => {
      try {
        const options = { payment_intent: paymentId, metadata: notes };
        if (amount) options.amount = Math.round(amount * 100);

        const refund = await stripe.refunds.create(options);
        logger.info(`Stripe Refund Created: ${refund.id} for Intent: ${paymentId}`);
        return { success: true, refund };
      } catch (error) {
        logger.error(`Stripe Refund Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    },

    /**
     * Verify Payment (Check status)
     */
    verifyPayment: async ({ paymentId }) => {
      try {
        const intent = await stripe.paymentIntents.retrieve(paymentId);
        const isValid = intent.status === 'succeeded';
        
        return { success: true, isValid, status: intent.status };
      } catch (error) {
        logger.error(`Stripe Verification Error: ${error.message}`);
        return { success: false, error: error.message };
      }
    }
  };
};
