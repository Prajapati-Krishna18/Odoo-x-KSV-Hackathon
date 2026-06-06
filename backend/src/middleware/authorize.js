// ============================================
// RBAC Authorization Middleware
// ============================================
// Why: Authentication tells us WHO the user is.
// Authorization tells us WHAT they can do.
// This checks if the user's permissions include the
// required permission for the endpoint.
// ============================================

const { ForbiddenError } = require('../utils/ApiError');

/**
 * Check if user has the required permission
 * @param  {...string} requiredPermissions - e.g. 'rfq.create', 'vendor.delete'
 * @returns {Function} Express middleware
 */
const authorize = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    // Admin role bypasses all permission checks
    if (req.user.roles.includes('admin')) {
      return next();
    }

    // Check if user has at least one of the required permissions
    const hasPermission = requiredPermissions.some((perm) =>
      req.user.permissions.includes(perm)
    );

    if (!hasPermission) {
      throw new ForbiddenError(
        `Required permission(s): ${requiredPermissions.join(', ')}`
      );
    }

    next();
  };
};

module.exports = authorize;
