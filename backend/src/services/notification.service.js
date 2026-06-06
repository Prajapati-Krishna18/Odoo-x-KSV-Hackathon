// ============================================
// In-App Notification Service
// ============================================
// Why: Every workflow event (RFQ published, quotation received,
// approval requested) triggers a notification. This service
// creates notification records and is called by other modules.
// ============================================

const prisma = require('../config/database');
const logger = require('../config/logger');

class NotificationService {
  /**
   * Create a notification for a user
   */
  static async create({ userId, type, title, message, entityType, entityId, actionUrl }) {
    try {
      return await prisma.notification.create({
        data: {
          userId,
          type: type || 'GENERAL',
          title,
          message,
          entityType,
          entityId,
          actionUrl,
        },
      });
    } catch (err) {
      logger.error('Failed to create notification', { error: err.message, userId, type });
      // Don't throw — notification failure shouldn't break the main flow
    }
  }

  /**
   * Notify multiple users at once
   */
  static async notifyMany({ userIds, type, title, message, entityType, entityId }) {
    try {
      const data = userIds.map((userId) => ({
        userId,
        type: type || 'GENERAL',
        title,
        message,
        entityType,
        entityId,
      }));

      return await prisma.notification.createMany({ data });
    } catch (err) {
      logger.error('Failed to create bulk notifications', { error: err.message });
    }
  }
}

module.exports = NotificationService;
