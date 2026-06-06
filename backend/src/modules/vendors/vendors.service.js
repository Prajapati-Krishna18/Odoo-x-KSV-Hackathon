const VendorsRepository = require('./vendors.repository');
const AuditService = require('../../services/audit.service');
const { NotFoundError } = require('../../utils/ApiError');
const { parsePagination, parseSort } = require('../../utils/pagination');

class VendorsService {
  static async list(query) {
    const { skip, take, page, limit } = parsePagination(query);
    const orderBy = parseSort(query.sortBy, query.sortOrder, ['createdAt', 'companyName', 'trustScore']);

    const where = {};
    if (query.search) {
      where.OR = [
        { companyName: { contains: query.search, mode: 'insensitive' } },
        { contactPerson: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.categoryId) where.categoryId = query.categoryId;

    const { vendors, total } = await VendorsRepository.findAll({ skip, take, orderBy, where });
    return { vendors, total, page, limit };
  }

  static async getById(id) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) throw new NotFoundError('Vendor');
    return vendor;
  }

  static async create(data, userId) {
    const vendor = await VendorsRepository.create({ ...data, createdBy: userId });
    await AuditService.log({ userId, tableName: 'vendors', recordId: vendor.id, action: 'INSERT', newValues: data });
    return vendor;
  }

  static async update(id, data, userId) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) throw new NotFoundError('Vendor');
    const updated = await VendorsRepository.update(id, { ...data, updatedBy: userId });
    await AuditService.log({ userId, tableName: 'vendors', recordId: id, action: 'UPDATE', oldValues: vendor, newValues: data });
    return updated;
  }

  static async remove(id, userId) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) throw new NotFoundError('Vendor');
    await VendorsRepository.softDelete(id);
    await AuditService.log({ userId, tableName: 'vendors', recordId: id, action: 'DELETE' });
  }

  static async updateStatus(id, status, userId) {
    const vendor = await VendorsRepository.findById(id);
    if (!vendor) throw new NotFoundError('Vendor');
    const updated = await VendorsRepository.update(id, { status, updatedBy: userId });
    await AuditService.log({ userId, tableName: 'vendors', recordId: id, action: 'UPDATE', oldValues: { status: vendor.status }, newValues: { status } });
    return updated;
  }

  static async rateVendor(vendorId, ratingData, userId) {
    const vendor = await VendorsRepository.findById(vendorId);
    if (!vendor) throw new NotFoundError('Vendor');

    const overallScore = (
      ratingData.qualityScore + ratingData.deliveryScore +
      ratingData.priceScore + ratingData.responsivenessScore
    ) / 4;

    const rating = await VendorsRepository.addRating({
      vendorId,
      rfqId: ratingData.rfqId,
      ratedBy: userId,
      qualityScore: ratingData.qualityScore,
      deliveryScore: ratingData.deliveryScore,
      priceScore: ratingData.priceScore,
      responsivenessScore: ratingData.responsivenessScore,
      overallScore,
      comments: ratingData.comments,
    });

    // Recalculate trust score
    await VendorsRepository.updateTrustScore(vendorId);

    return rating;
  }

  static async getPerformance(vendorId) {
    const vendor = await VendorsRepository.findById(vendorId);
    if (!vendor) throw new NotFoundError('Vendor');
    return VendorsRepository.getPerformanceMetrics(vendorId);
  }

  static async getRecommendations(categoryId) {
    return VendorsRepository.getTopVendorsByCategory(categoryId);
  }
}

module.exports = VendorsService;
