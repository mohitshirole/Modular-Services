import { z } from 'zod';

/**
 * PDF Generation Schema
 */
export const renderSchema = z.object({
  html: z.string({ required_error: "html template string is required" }),
  data: z.record(z.any()).optional().default({}),
  pdfOptions: z.object({
    format: z.string().optional(),
    margin: z.object({
      top: z.string().optional(),
      bottom: z.string().optional(),
      left: z.string().optional(),
      right: z.string().optional()
    }).optional(),
    headerHtml: z.string().optional(),
    footerHtml: z.string().optional(),
    landscape: z.boolean().optional()
  }).optional().default({})
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
