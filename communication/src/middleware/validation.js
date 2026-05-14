import { z } from 'zod';

/**
 * Unified Send Schema
 */
export const sendSchema = z.object({
  provider: z.string({ required_error: "provider is required (e.g., 'smtp', 'ultramsg', '2factor')" }),
  to: z.string({ required_error: "recipient 'to' is required" }),
  message: z.string({ required_error: "message content is required" }),
  subject: z.string().optional(), // Mainly for email
  html: z.string().optional(),    // Mainly for email
  template: z.object({
    name: z.string(),
    languageCode: z.string().optional(),
    bodyValues: z.array(z.string()).optional()
  }).optional(),
  config: z.record(z.any()).optional(), // For runtime credential overrides
});

/**
 * Middleware factory
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }
};
