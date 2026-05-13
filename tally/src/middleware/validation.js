import { z } from 'zod';

/**
 * Tally Request Schema
 */
const tallyRequestSchema = z.object({
  reportId: z.string({ required_error: "reportId is required" }),
  tallyUrl: z.string({ required_error: "tallyUrl is required" }).url("Invalid Tally URL format"),
  params: z.object({
    company: z.string({ required_error: "company name is required" }),
    fromDate: z.string().optional(),
    toDate: z.string().optional(),
  }).passthrough(), // passthrough() allows extra fields like ledgerName, costCentreName
  config: z.object({
    cfAccessClientId: z.string().optional(),
    cfAccessClientSecret: z.string().optional(),
    timeout: z.number().optional(),
  }).optional(),
});

/**
 * Middleware to validate request body
 */
export const validateTallyRequest = (req, res, next) => {
  try {
    tallyRequestSchema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: error.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }
};
