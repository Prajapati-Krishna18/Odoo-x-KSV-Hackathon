const prisma = require('../../config/database');

class InvoicesRepository {
  static async findAll({ skip, take, orderBy, where }) {
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where: { ...where, deletedAt: null }, skip, take, orderBy,
        include: {
          vendor: { select: { id: true, companyName: true, email: true } },
          purchaseOrder: { select: { id: true, poNumber: true } },
        },
      }),
      prisma.invoice.count({ where: { ...where, deletedAt: null } }),
    ]);
    return { invoices, total };
  }

  static async findById(id) {
    return prisma.invoice.findUnique({
      where: { id, deletedAt: null },
      include: { vendor: true, purchaseOrder: { include: { items: true } }, items: { include: { purchaseOrderItem: true } } },
    });
  }

  static async create(data) {
    const { items, ...invoiceData } = data;
    return prisma.invoice.create({
      data: { ...invoiceData, items: { create: items } },
      include: { items: true, vendor: true },
    });
  }

  static async update(id, data) {
    return prisma.invoice.update({ where: { id }, data });
  }
}

module.exports = InvoicesRepository;
