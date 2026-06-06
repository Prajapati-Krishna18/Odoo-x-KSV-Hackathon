const prisma = require('../../config/database');

class VendorsRepository {
  static async findAll({ skip, take, orderBy, where }) {
    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where: { ...where, deletedAt: null },
        skip, take, orderBy,
        include: { category: { select: { id: true, name: true } } },
      }),
      prisma.vendor.count({ where: { ...where, deletedAt: null } }),
    ]);
    return { vendors, total };
  }

  static async findById(id) {
    return prisma.vendor.findUnique({
      where: { id, deletedAt: null },
      include: {
        category: true,
        ratings: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  }

  static async create(data) {
    return prisma.vendor.create({ data });
  }

  static async update(id, data) {
    return prisma.vendor.update({ where: { id }, data });
  }

  static async softDelete(id) {
    return prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  static async addRating(data) {
    return prisma.vendorRating.create({ data });
  }

  static async getAverageRatings(vendorId) {
    const result = await prisma.vendorRating.aggregate({
      where: { vendorId },
      _avg: {
        qualityScore: true,
        deliveryScore: true,
        priceScore: true,
        responsivenessScore: true,
        overallScore: true,
      },
      _count: true,
    });
    return result;
  }

  static async getPerformanceMetrics(vendorId) {
    const [vendor, poCount, completedPOs, avgRating] = await Promise.all([
      prisma.vendor.findUnique({ where: { id: vendorId }, select: { totalOrders: true, successfulOrders: true, trustScore: true } }),
      prisma.purchaseOrder.count({ where: { vendorId } }),
      prisma.purchaseOrder.count({ where: { vendorId, status: 'COMPLETED' } }),
      this.getAverageRatings(vendorId),
    ]);
    return { vendor, poCount, completedPOs, avgRating };
  }

  static async getTopVendorsByCategory(categoryId, limit = 3) {
    return prisma.vendor.findMany({
      where: {
        categoryId,
        status: 'ACTIVE',
        deletedAt: null,
        trustScore: { gt: 0 },
      },
      orderBy: { trustScore: 'desc' },
      take: limit,
      include: { category: { select: { name: true } } },
    });
  }

  static async updateTrustScore(vendorId) {
    const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
    if (!vendor) return;

    const avgRatings = await this.getAverageRatings(vendorId);
    const successRate = vendor.totalOrders > 0
      ? (vendor.successfulOrders / vendor.totalOrders) * 100
      : 0;

    // Trust Score = (successRate × 0.4) + (quality × 20 × 0.2) + (delivery × 20 × 0.2) + (responsiveness × 20 × 0.2)
    const quality = (avgRatings._avg.qualityScore || 0) * 20;
    const delivery = (avgRatings._avg.deliveryScore || 0) * 20;
    const responsiveness = (avgRatings._avg.responsivenessScore || 0) * 20;

    const trustScore = Math.round(
      (successRate * 0.4) + (quality * 0.2) + (delivery * 0.2) + (responsiveness * 0.2)
    );

    await prisma.vendor.update({
      where: { id: vendorId },
      data: { trustScore: Math.min(100, Math.max(0, trustScore)) },
    });
  }
}

module.exports = VendorsRepository;
