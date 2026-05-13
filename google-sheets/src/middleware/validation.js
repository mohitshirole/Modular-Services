import { z } from 'zod';

/**
 * Metadata Request Schema
 */
export const metadataSchema = z.object({
  spreadsheetId: z.string({ required_error: "spreadsheetId is required" }),
});

/**
 * Read Request Schema
 */
export const readSchema = z.object({
  spreadsheetId: z.string({ required_error: "spreadsheetId is required" }),
  config: z.object({
    tabs: z.array(z.object({
      sheetName: z.string(),
      headerRow: z.number().optional(),
      range: z.string().optional(),
    })).min(1, "At least one tab must be specified"),
    mergedFields: z.array(z.object({
      key: z.string(),
      sources: z.array(z.string()),
      delimiter: z.string().optional(),
    })).optional(),
  }),
});

/**
 * Sync Request Schema (Match vs Update)
 */
export const syncSchema = z.object({
  spreadsheetId: z.string({ required_error: "spreadsheetId is required" }),
  tabName: z.string({ required_error: "tabName is required" }),
  headerRow: z.number().optional(),
  upsert: z.boolean().optional().default(false),
  syncData: z.array(z.object({
    match: z.record(z.any(), { required_error: "match criteria is required" }),
    update: z.record(z.any(), { required_error: "update payload is required" })
  })).min(1, "syncData array cannot be empty"),
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
