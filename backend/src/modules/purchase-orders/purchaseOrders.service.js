const PurchaseOrdersRepository = require('./purchaseOrders.repository');
const QuotationsRepository = require('../quotations/quotations.repository');
const ApprovalsService = require('../approvals/approvals.service');
const PdfService = require('../../services/pdf.service');
const EmailService = require('../../services/email.service');
const AuditService = require('../../services/audit.service');
const generateNumber = require('../../utils/generateNumber');
const { NotFoundError, BadRequestError } = require('../../utils/ApiError');
const { parsePagination, parseSort } = require('../../utils/pagination');

class PurchaseOrdersService {
  static async list(query) {
    const { skip, take, page, limit } = parsePagination(query);
    const orderBy = parseSort(query.sortBy, query.sortOrder, ['createdAt', 'totalAmount', 'poNumber']);
    const where = {};
    if (query.status) where.status = query.status;
    if (query.vendorId) where.vendorId = query.vendorId;

    const { pos, total } = await PurchaseOrdersRepository.findAll({ skip, take, orderBy, where });
    return { pos, total, page, limit };
  }

  static async getById(id) {
    const po = await PurchaseOrdersRepository.findById(id);
    if (!po) throw new NotFoundError('Purchase Order');
    return po;
  }

  static async create(data, userId) {
    // Validate quotation exists and is accepted
    const quotation = await QuotationsRepository.findById(data.quotationId);
    if (!quotation) throw new NotFoundError('Quotation');
    if (quotation.status !== 'ACCEPTED') throw new BadRequestError('Quotation must be accepted first');

    const poNumber = await generateNumber('PO', 'purchaseOrder', 'poNumber');

    // Build PO items from quotation items
    const items = quotation.items.map((qi) => ({
      quotationItemId: qi.id,
      itemName: qi.rfqItem?.itemName || qi.remarks || 'Item',
      quantity: qi.quantity,
      unitPrice: qi.unitPrice,
      totalPrice: qi.totalPrice,
    }));

    const po = await PurchaseOrdersRepository.create({
      poNumber,
      rfqId: quotation.rfqVendor.rfq.id,
      quotationId: quotation.id,
      vendorId: quotation.rfqVendor.vendor.id,
      totalAmount: quotation.totalAmount,
      currency: quotation.currency,
      deliveryDate: data.deliveryDate,
      shippingAddress: data.shippingAddress,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
      createdBy: userId,
      items,
    });

    // Create approval request
    const approvalSteps = po.totalAmount >= 100000 ? 3 : po.totalAmount >= 50000 ? 2 : 1;
    await ApprovalsService.createApproval({
      entityType: 'PURCHASE_ORDER',
      entityId: po.id,
      rfqId: po.rfqId,
      totalSteps: approvalSteps,
      initiatedBy: userId,
    });

    await AuditService.log({ userId, tableName: 'purchase_orders', recordId: po.id, action: 'INSERT', newValues: { poNumber, totalAmount: po.totalAmount } });
    return po;
  }

  static async updateStatus(id, status, userId) {
    const po = await PurchaseOrdersRepository.findById(id);
    if (!po) throw new NotFoundError('Purchase Order');
    const updated = await PurchaseOrdersRepository.update(id, { status, updatedBy: userId });
    await AuditService.log({ userId, tableName: 'purchase_orders', recordId: id, action: 'UPDATE', newValues: { status } });
    return updated;
  }

  static async generatePdf(id) {
    const po = await PurchaseOrdersRepository.findById(id);
    if (!po) throw new NotFoundError('Purchase Order');
    return PdfService.generatePurchaseOrderPdf(po);
  }

  static async sendToVendor(id, userId) {
    const po = await PurchaseOrdersRepository.findById(id);
    if (!po) throw new NotFoundError('Purchase Order');

    const pdfBuffer = await PdfService.generatePurchaseOrderPdf(po);

    await EmailService.sendPurchaseOrder({
      to: po.vendor.email,
      vendorName: po.vendor.companyName,
      poNumber: po.poNumber,
      pdfBuffer,
    });

    await PurchaseOrdersRepository.update(id, { status: 'SENT', updatedBy: userId });
    await AuditService.log({ userId, tableName: 'purchase_orders', recordId: id, action: 'UPDATE', newValues: { status: 'SENT' } });
    return { message: 'PO sent to vendor' };
  }
}

module.exports = PurchaseOrdersService;
