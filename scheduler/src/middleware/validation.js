import { z } from 'zod';
import cron from 'node-cron';

/**
 * Job Creation Schema
 */
export const jobSchema = z.object({
  name: z.string({ required_error: "Job name is required" }),
  cron: z.string({ required_error: "Cron expression is required" }).refine(
    (v) => cron.validate(v),
    { message: "Invalid Cron expression (e.g. use '0 0 * * *')" }
  ),
  targetUrl: z.string({ required_error: "Target URL is required" }).url(),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE']).optional().default('POST'),
  payload: z.record(z.any()).optional().default({}),
  headers: z.record(z.any()).optional().default({}),
  active: z.boolean().optional().default(true)
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
