const prisma = require('../../config/database');

class RfqsRepository {
  static async findAll({ skip, take, orderBy, where }) {
    const [rfqs, total] = await Promise.all([
      prisma.rfq.findMany({
        where: { ...where, deletedAt: null },
        skip, take, orderBy,
        include: {
          creator: { select: { id: true, firstName: true, lastName: true } },
          category: { select: { id: true, name: true } },
          _count: { select: { items: true, rfqVendors: true } },
        },
      }),
      prisma.rfq.count({ where: { ...where, deletedAt: null } }),
    ]);
    return { rfqs, total };
  }

  static async findById(id) {
    return prisma.rfq.findUnique({
      where: { id, deletedAt: null },
      include: {
        creator: { select: { id: true, firstName: true, lastName: true, email: true } },
        category: true,
        items: true,
        attachments: {
          include: { uploader: { select: { id: true, firstName: true, lastName: true } } },
        },
        rfqVendors: {
          include: {
            vendor: { select: { id: true, companyName: true, email: true, contactPerson: true, trustScore: true, status: true } },
            quotations: { select: { id: true, quotationNumber: true, totalAmount: true, status: true } },
          },
        },
      },
    });
  }

  static async create(data) {
    const { items, ...rfqData } = data;
    return prisma.rfq.create({
      data: {
        ...rfqData,
        items: { create: items },
      },
      include: { items: true },
    });
  }

  static async update(id, data) {
    return prisma.rfq.update({ where: { id }, data });
  }

  static async softDelete(id) {
    return prisma.rfq.update({ where: { id }, data: { deletedAt: new Date(), status: 'CANCELLED' } });
  }

  static async inviteVendors(rfqId, vendorIds) {
    const data = vendorIds.map((vendorId) => ({
      rfqId,
      vendorId,
      invitationStatus: 'SENT',
      invitedAt: new Date(),
    }));
    return prisma.rfqVendor.createMany({ data, skipDuplicates: true });
  }

  static async addAttachment(data) {
    return prisma.rfqAttachment.create({ data });
  }

  static async removeAttachment(id) {
    return prisma.rfqAttachment.delete({ where: { id } });
  }

  static async getLastRfqNumber() {
    return prisma.rfq.findFirst({
      where: { rfqNumber: { startsWith: `RFQ-${new Date().getFullYear()}` } },
      orderBy: { rfqNumber: 'desc' },
      select: { rfqNumber: true },
    });
  }
}

module.exports = RfqsRepository;
