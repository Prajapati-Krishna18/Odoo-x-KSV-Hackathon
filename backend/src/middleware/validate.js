// ============================================
// Zod Validation Middleware
// ============================================
// Why: Validates request body/query/params against Zod schemas
// BEFORE reaching the controller. Returns structured 422 errors
// with field-level details.
// ============================================

const { ValidationError } = require('../utils/ApiError');

/**
 * Validate request against a Zod schema
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source - where to validate
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      throw new ValidationError(errors);
    }

    // Replace with parsed (and transformed) data
    req[source] = result.data;
    next();
  };
};

module.exports = validate;
