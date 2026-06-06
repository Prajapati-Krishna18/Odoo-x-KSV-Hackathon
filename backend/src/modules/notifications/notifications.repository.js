const prisma = require('../../config/database');

class NotificationsRepository {
  static async findByUser(userId, { skip, take }) {
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        skip, take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where: { userId } }),
    ]);
    return { notifications, total };
  }

  static async markRead(id, userId) {
    return prisma.notification.update({
      where: { id, userId },
      data: { isRead: true, readAt: new Date() },
    });
  }

  static async markAllRead(userId) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  static async getUnreadCount(userId) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }
}

module.exports = NotificationsRepository;
