import { z } from 'zod';

/**
 * Event Log Schema
 */
export const eventSchema = z.object({
  appId: z.string({ required_error: "appId is required" }),
  userId: z.string().optional(),
  service: z.string({ required_error: "service name is required" }),
  action: z.string({ required_error: "action name is required" }),
  status: z.enum(['SUCCESS', 'FAILED', 'PENDING']).optional().default('SUCCESS'),
  duration: z.number().optional(),
  metadata: z.record(z.any()).optional().default({})
});

/**
 * Query Schema for fetching logs
 */
export const querySchema = z.object({
  appId: z.string().optional(),
  userId: z.string().optional(),
  service: z.string().optional(),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  offset: z.string().optional().transform(v => parseInt(v || '0'))
});

/**
 * Middleware factory
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // For GET requests, we validate the query
    if (req.method === 'GET') {
      req.query = schema.parse(req.query);
    } else {
      req.body = schema.parse(req.body);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }
};
