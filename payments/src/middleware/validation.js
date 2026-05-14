import { z } from 'zod';

/**
 * Order Creation Schema
 */
export const orderSchema = z.object({
  amount: z.number({ required_error: "Amount is required" }).min(0), // Allow 0 for free orders
  currency: z.string().optional().default('INR'),
  receipt: z.string({ required_error: "Receipt ID is required" }),
  notes: z.record(z.any()).optional().default({}),
  config: z.object({
    keyId: z.string({ required_error: "Razorpay Key ID is required" }),
    keySecret: z.string({ required_error: "Razorpay Key Secret is required" })
  }).optional()
});

/**
 * Refund Creation Schema
 */
export const refundSchema = z.object({
  paymentId: z.string({ required_error: "paymentId is required" }),
  amount: z.number().positive().optional(), // Optional for full refund
  notes: z.record(z.any()).optional().default({}),
  config: z.object({
    keyId: z.string({ required_error: "Razorpay Key ID is required" }),
    keySecret: z.string({ required_error: "Razorpay Key Secret is required" })
  }).optional()
});

/**
 * Payment Verification Schema
 */
export const verifySchema = z.object({
  orderId: z.string({ required_error: "orderId is required" }),
  paymentId: z.string({ required_error: "paymentId is required" }),
  signature: z.string({ required_error: "signature is required" }),
  config: z.object({
    keySecret: z.string({ required_error: "Razorpay Key Secret is required" })
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
