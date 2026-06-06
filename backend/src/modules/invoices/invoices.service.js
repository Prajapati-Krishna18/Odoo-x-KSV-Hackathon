const InvoicesRepository = require('./invoices.repository');
const PurchaseOrdersRepository = require('../purchase-orders/purchaseOrders.repository');
const PdfService = require('../../services/pdf.service');
const EmailService = require('../../services/email.service');
const AuditService = require('../../services/audit.service');
const generateNumber = require('../../utils/generateNumber');
const { NotFoundError, BadRequestError } = require('../../utils/ApiError');
const { parsePagination, parseSort } = require('../../utils/pagination');

class InvoicesService {
  static async list(query) {
    const { skip, take, page, limit } = parsePagination(query);
    const orderBy = parseSort(query.sortBy, query.sortOrder, ['createdAt', 'grandTotal']);
    const where = {};
    if (query.status) where.status = query.status;
    if (query.vendorId) where.vendorId = query.vendorId;

    const { invoices, total } = await InvoicesRepository.findAll({ skip, take, orderBy, where });
    return { invoices, total, page, limit };
  }

  static async getById(id) {
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) throw new NotFoundError('Invoice');
    return invoice;
  }

  static async create(data, userId) {
    const po = await PurchaseOrdersRepository.findById(data.poId);
    if (!po) throw new NotFoundError('Purchase Order');

    const invoiceNumber = await generateNumber('INV', 'invoice', 'invoiceNumber');

    const items = data.items.map((item) => ({
      poItemId: item.poItemId,
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.unitPrice * item.quantity,
    }));

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxAmount = data.taxAmount || 0;
    const grandTotal = totalAmount + taxAmount;

    const invoice = await InvoicesRepository.create({
      invoiceNumber,
      poId: data.poId,
      vendorId: po.vendorId,
      totalAmount,
      taxAmount,
      grandTotal,
      currency: data.currency || po.currency,
      dueDate: data.dueDate,
      createdBy: userId,
      items,
    });

    await AuditService.log({ userId, tableName: 'invoices', recordId: invoice.id, action: 'INSERT', newValues: { invoiceNumber, grandTotal } });
    return invoice;
  }

  static async update(id, data, userId) {
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) throw new NotFoundError('Invoice');
    if (!['DRAFT', 'SUBMITTED'].includes(invoice.status)) throw new BadRequestError('Invoice cannot be edited');
    const updated = await InvoicesRepository.update(id, { ...data, updatedBy: userId });
    return updated;
  }

  static async verify(id, userId) {
    // 3-way match: compare invoice vs PO
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) throw new NotFoundError('Invoice');

    const po = invoice.purchaseOrder;
    const poTotal = po.items.reduce((sum, item) => sum + item.totalPrice, 0);
    const invoiceTotal = invoice.totalAmount;

    const discrepancy = Math.abs(poTotal - invoiceTotal);
    const threshold = poTotal * 0.05; // 5% tolerance

    let status = 'VERIFIED';
    let message = 'Invoice verified — amounts match';

    if (discrepancy > threshold) {
      status = 'DISPUTED';
      message = `Invoice amount ($${invoiceTotal}) differs from PO amount ($${poTotal}) by $${discrepancy.toFixed(2)}`;
    }

    const updated = await InvoicesRepository.update(id, { status, updatedBy: userId });
    await AuditService.log({ userId, tableName: 'invoices', recordId: id, action: 'UPDATE', newValues: { status, discrepancy } });
    return { invoice: updated, match: { poTotal, invoiceTotal, discrepancy, withinThreshold: discrepancy <= threshold }, message };
  }

  static async generatePdf(id) {
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) throw new NotFoundError('Invoice');
    return PdfService.generateInvoicePdf(invoice);
  }

  static async sendToVendor(id, userId) {
    const invoice = await InvoicesRepository.findById(id);
    if (!invoice) throw new NotFoundError('Invoice');
    const pdfBuffer = await PdfService.generateInvoicePdf(invoice);
    await EmailService.sendInvoice({
      to: invoice.vendor.email,
      vendorName: invoice.vendor.companyName,
      invoiceNumber: invoice.invoiceNumber,
      pdfBuffer,
    });
    return { message: 'Invoice sent' };
  }
}

module.exports = InvoicesService;
