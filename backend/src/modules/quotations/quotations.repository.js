const prisma = require('../../config/database');

class QuotationsRepository {
  static async findAll({ skip, take, orderBy, where }) {
    const [quotations, total] = await Promise.all([
      prisma.quotation.findMany({
        where: { ...where, deletedAt: null }, skip, take, orderBy,
        include: {
          rfqVendor: {
            include: {
              vendor: { select: { id: true, companyName: true, email: true } },
              rfq: { select: { id: true, rfqNumber: true, title: true } },
            },
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.quotation.count({ where: { ...where, deletedAt: null } }),
    ]);
    return { quotations, total };
  }

  static async findById(id) {
    return prisma.quotation.findUnique({
      where: { id, deletedAt: null },
      include: {
        rfqVendor: {
          include: {
            vendor: true,
            rfq: { include: { items: true } },
          },
        },
        items: { include: { rfqItem: true } },
      },
    });
  }

  static async create(data) {
    const { items, ...quotationData } = data;
    return prisma.quotation.create({
      data: {
        ...quotationData,
        items: { create: items },
      },
      include: { items: true },
    });
  }

  static async update(id, data) {
    return prisma.quotation.update({ where: { id }, data });
  }

  static async updateWithItems(id, data) {
    const { items, ...quotationData } = data;
    // Delete old items and create new ones
    await prisma.quotationItem.deleteMany({ where: { quotationId: id } });
    return prisma.quotation.update({
      where: { id },
      data: {
        ...quotationData,
        items: items ? { create: items } : undefined,
      },
      include: { items: true },
    });
  }

  static async getQuotationsForRfq(rfqId) {
    return prisma.quotation.findMany({
      where: {
        rfqVendor: { rfqId },
        status: { in: ['SUBMITTED', 'REVISED'] },
        deletedAt: null,
      },
      include: {
        rfqVendor: {
          include: {
            vendor: { select: { id: true, companyName: true, trustScore: true } },
          },
        },
        items: { include: { rfqItem: true } },
      },
      orderBy: { totalAmount: 'asc' },
    });
  }
}

module.exports = QuotationsRepository;
