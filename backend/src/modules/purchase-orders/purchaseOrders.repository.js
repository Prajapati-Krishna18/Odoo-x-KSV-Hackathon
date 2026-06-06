const prisma = require('../../config/database');

class PurchaseOrdersRepository {
  static async findAll({ skip, take, orderBy, where }) {
    const [pos, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        where: { ...where, deletedAt: null }, skip, take, orderBy,
        include: {
          vendor: { select: { id: true, companyName: true, email: true } },
          rfq: { select: { id: true, rfqNumber: true, title: true } },
          _count: { select: { items: true, invoices: true } },
        },
      }),
      prisma.purchaseOrder.count({ where: { ...where, deletedAt: null } }),
    ]);
    return { pos, total };
  }

  static async findById(id) {
    return prisma.purchaseOrder.findUnique({
      where: { id, deletedAt: null },
      include: {
        vendor: true,
        rfq: true,
        quotation: { include: { rfqVendor: { include: { vendor: true } } } },
        items: true,
        invoices: true,
      },
    });
  }

  static async create(data) {
    const { items, ...poData } = data;
    return prisma.purchaseOrder.create({
      data: { ...poData, items: { create: items } },
      include: { items: true, vendor: true },
    });
  }

  static async update(id, data) {
    return prisma.purchaseOrder.update({ where: { id }, data });
  }

  static async getTotalSpend() {
    const result = await prisma.purchaseOrder.aggregate({
      where: { status: { in: ['APPROVED', 'SENT', 'ACKNOWLEDGED', 'COMPLETED'] }, deletedAt: null },
      _sum: { totalAmount: true },
      _count: true,
    });
    return result;
  }
}

module.exports = PurchaseOrdersRepository;
