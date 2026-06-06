// ============================================
// Audit Log Service
// ============================================
// Why: Immutable audit trail for SOX/ISO compliance.
// Records WHO changed WHAT, WHEN, and the before/after values.
// Audit logs are NEVER updated or deleted.
// ============================================

const prisma = require('../config/database');
const logger = require('../config/logger');

class AuditService {
  /**
   * Log a data change to the immutable audit trail
   * @param {object} params
   * @param {string} params.userId - Who made the change
   * @param {string} params.tableName - Which table was affected
   * @param {string} params.recordId - Which record was affected
   * @param {'INSERT'|'UPDATE'|'DELETE'} params.action
   * @param {object} [params.oldValues] - Previous values (for UPDATE/DELETE)
   * @param {object} [params.newValues] - New values (for INSERT/UPDATE)
   * @param {string} [params.ipAddress]
   */
  static async log({ userId, tableName, recordId, action, oldValues, newValues, ipAddress }) {
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          tableName,
          recordId,
          action,
          oldValues: oldValues || undefined,
          newValues: newValues || undefined,
          ipAddress,
        },
      });
    } catch (err) {
      // Audit log failure should be logged but NOT break the operation
      logger.error('Audit log write failed', {
        error: err.message,
        userId,
        tableName,
        recordId,
        action,
      });
    }
  }
}

module.exports = AuditService;
