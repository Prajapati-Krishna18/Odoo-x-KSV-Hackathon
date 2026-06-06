const prisma = require('../../config/database');

class ApprovalsRepository {
  static async findPending(userId) {
    // Get roles of the user to find which approvals they can act on
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      select: { role: { select: { name: true } } },
    });
    const roleNames = userRoles.map((ur) => ur.role.name);

    return prisma.approval.findMany({
      where: {
        status: { in: ['PENDING', 'IN_PROGRESS'] },
      },
      include: {
        rfq: { select: { id: true, rfqNumber: true, title: true, budgetEstimate: true } },
        initiator: { select: { id: true, firstName: true, lastName: true } },
        history: { orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findById(id) {
    return prisma.approval.findUnique({
      where: { id },
      include: {
        rfq: {
          include: {
            items: true,
            creator: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
        initiator: { select: { id: true, firstName: true, lastName: true } },
        history: {
          include: { approver: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { stepNumber: 'asc' },
        },
      },
    });
  }

  static async create(data) {
    return prisma.approval.create({ data });
  }

  static async update(id, data) {
    return prisma.approval.update({ where: { id }, data });
  }

  static async addHistory(data) {
    return prisma.approvalHistory.create({ data });
  }

  static async getAverageApprovalTime() {
    const result = await prisma.$queryRaw`
      SELECT AVG(EXTRACT(EPOCH FROM (ah.acted_at - a.created_at)) / 3600) as avg_hours
      FROM approval_history ah
      JOIN approvals a ON ah.approval_id = a.id
      WHERE ah.action = 'APPROVED'
    `;
    return result[0]?.avg_hours || 0;
  }
}

module.exports = ApprovalsRepository;
