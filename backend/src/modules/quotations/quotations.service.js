const QuotationsRepository = require('./quotations.repository');
const AuditService = require('../../services/audit.service');
const NotificationService = require('../../services/notification.service');
const generateNumber = require('../../utils/generateNumber');
const { NotFoundError, BadRequestError } = require('../../utils/ApiError');
const { parsePagination, parseSort } = require('../../utils/pagination');

class QuotationsService {
  static async list(query) {
    const { skip, take, page, limit } = parsePagination(query);
    const orderBy = parseSort(query.sortBy, query.sortOrder, ['createdAt', 'totalAmount']);
    const where = {};
    if (query.status) where.status = query.status;
    if (query.rfqVendorId) where.rfqVendorId = query.rfqVendorId;

    const { quotations, total } = await QuotationsRepository.findAll({ skip, take, orderBy, where });
    return { quotations, total, page, limit };
  }

  static async getById(id) {
    const quotation = await QuotationsRepository.findById(id);
    if (!quotation) throw new NotFoundError('Quotation');
    return quotation;
  }

  static async create(data, userId) {
    const quotationNumber = await generateNumber('QUO', 'quotation', 'quotationNumber');

    // Calculate total from items
    const items = data.items.map((item) => ({
      ...item,
      totalPrice: item.unitPrice * item.quantity,
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const quotation = await QuotationsRepository.create({
      ...data,
      quotationNumber,
      totalAmount,
      status: 'SUBMITTED',
      submittedAt: new Date(),
      items,
    });

    // Notify RFQ creator
    const fullQuotation = await QuotationsRepository.findById(quotation.id);
    if (fullQuotation?.rfqVendor?.rfq) {
      await NotificationService.create({
        userId: fullQuotation.rfqVendor.rfq.createdBy,
        type: 'QUOTATION_RECEIVED',
        title: 'New Quotation Received',
        message: `${fullQuotation.rfqVendor.vendor.companyName} submitted a quotation for ${fullQuotation.rfqVendor.rfq.title}`,
        entityType: 'QUOTATION',
        entityId: quotation.id,
      });
    }

    await AuditService.log({ userId, tableName: 'quotations', recordId: quotation.id, action: 'INSERT', newValues: { quotationNumber, totalAmount } });
    return quotation;
  }

  static async update(id, data, userId) {
    const quotation = await QuotationsRepository.findById(id);
    if (!quotation) throw new NotFoundError('Quotation');
    if (!['DRAFT', 'SUBMITTED'].includes(quotation.status)) {
      throw new BadRequestError('This quotation can no longer be edited');
    }

    let updateData = { ...data, status: 'REVISED', revisionNumber: quotation.revisionNumber + 1 };

    if (data.items) {
      const items = data.items.map((item) => ({ ...item, totalPrice: item.unitPrice * item.quantity }));
      updateData.totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
      updateData.items = items;
      const updated = await QuotationsRepository.updateWithItems(id, updateData);
      await AuditService.log({ userId, tableName: 'quotations', recordId: id, action: 'UPDATE', newValues: { revision: updateData.revisionNumber } });
      return updated;
    }

    const updated = await QuotationsRepository.update(id, updateData);
    await AuditService.log({ userId, tableName: 'quotations', recordId: id, action: 'UPDATE' });
    return updated;
  }

  static async accept(id, userId) {
    const quotation = await QuotationsRepository.findById(id);
    if (!quotation) throw new NotFoundError('Quotation');
    const updated = await QuotationsRepository.update(id, { status: 'ACCEPTED' });
    await AuditService.log({ userId, tableName: 'quotations', recordId: id, action: 'UPDATE', newValues: { status: 'ACCEPTED' } });
    return updated;
  }

  static async reject(id, userId) {
    const quotation = await QuotationsRepository.findById(id);
    if (!quotation) throw new NotFoundError('Quotation');
    const updated = await QuotationsRepository.update(id, { status: 'REJECTED' });
    await AuditService.log({ userId, tableName: 'quotations', recordId: id, action: 'UPDATE', newValues: { status: 'REJECTED' } });
    return updated;
  }

  static async compareForRfq(rfqId) {
    const quotations = await QuotationsRepository.getQuotationsForRfq(rfqId);
    if (quotations.length === 0) throw new NotFoundError('No quotations found for this RFQ');

    // Build comparison matrix
    const totalAmounts = quotations.map((q) => q.totalAmount);
    const avgAmount = totalAmounts.reduce((a, b) => a + b, 0) / totalAmounts.length;
    const lowestAmount = Math.min(...totalAmounts);

    const comparison = quotations.map((q) => ({
      quotationId: q.id,
      quotationNumber: q.quotationNumber,
      vendor: q.rfqVendor.vendor,
      totalAmount: q.totalAmount,
      currency: q.currency,
      validityDate: q.validityDate,
      revisionNumber: q.revisionNumber,
      submittedAt: q.submittedAt,
      items: q.items,
      // Analytics
      priceVsAverage: ((q.totalAmount - avgAmount) / avgAmount * 100).toFixed(2) + '%',
      isLowest: q.totalAmount === lowestAmount,
      savingsIfSelected: ((avgAmount - q.totalAmount) / avgAmount * 100).toFixed(2) + '%',
      vendorTrustScore: q.rfqVendor.vendor.trustScore,
    }));

    return {
      rfqId,
      totalQuotations: quotations.length,
      averageAmount: Math.round(avgAmount * 100) / 100,
      lowestAmount,
      highestAmount: Math.max(...totalAmounts),
      quotations: comparison,
    };
  }
}

module.exports = QuotationsService;
