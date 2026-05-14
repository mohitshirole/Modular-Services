import { z } from 'zod';

/**
 * Order Creation Schema
 */
export const orderSchema = z.object({
  provider: z.enum(['razorpay', 'stripe']).default('razorpay'),
  amount: z.number({ required_error: "Amount is required" }).min(0),
  currency: z.string().optional().default('INR'),
  receipt: z.string({ required_error: "Receipt ID is required" }),
  notes: z.record(z.any()).optional().default({}),
  config: z.object({
    keyId: z.string().optional(),     // Razorpay
    keySecret: z.string().optional(), // Razorpay
    secretKey: z.string().optional()  // Stripe
  }).optional()
});

/**
 * Refund Creation Schema
 */
export const refundSchema = z.object({
  provider: z.enum(['razorpay', 'stripe']).default('razorpay'),
  paymentId: z.string({ required_error: "paymentId is required" }),
  amount: z.number().positive().optional(),
  notes: z.record(z.any()).optional().default({}),
  config: z.object({
    keyId: z.string().optional(),
    keySecret: z.string().optional(),
    secretKey: z.string().optional()
  }).optional()
});

/**
 * Payment Verification Schema
 */
export const verifySchema = z.object({
  provider: z.enum(['razorpay', 'stripe']).default('razorpay'),
  orderId: z.string().optional(),   // Required for Razorpay
  paymentId: z.string({ required_error: "paymentId is required" }),
  signature: z.string().optional(), // Required for Razorpay
  config: z.object({
    keySecret: z.string().optional(),
    secretKey: z.string().optional()
  }).optional()
});

/**
 * Middleware factory
 */
export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }
};
