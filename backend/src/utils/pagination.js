// ============================================
// Pagination Helper
// ============================================
// Why: Every list endpoint needs pagination. Centralize the
// page/limit parsing, offset calculation, and Prisma args.
// ============================================

/**
 * Parse pagination params from query string
 * @param {object} query - req.query
 * @returns {{ page, limit, skip, take }}
 */
const parsePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  return { page, limit, skip, take: limit };
};

/**
 * Build Prisma orderBy from query string
 * @param {string} sortBy - e.g. "created_at"
 * @param {string} sortOrder - "asc" or "desc"
 * @param {string[]} allowedFields - whitelist of sortable fields
 * @returns {object}
 */
const parseSort = (sortBy, sortOrder, allowedFields = ['createdAt']) => {
  const field = allowedFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 'asc' : 'desc';
  return { [field]: order };
};

module.exports = { parsePagination, parseSort };
