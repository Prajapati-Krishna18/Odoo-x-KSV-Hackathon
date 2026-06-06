const InvoicesService = require('./invoices.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class InvoicesController {
  static list = asyncHandler(async (req, res) => {
    const { invoices, total, page, limit } = await InvoicesService.list(req.query);
    ApiResponse.paginated(res, { data: invoices, page, limit, total });
  });

  static getById = asyncHandler(async (req, res) => {
    const invoice = await InvoicesService.getById(req.params.id);
    ApiResponse.success(res, { data: invoice });
  });

  static create = asyncHandler(async (req, res) => {
    const invoice = await InvoicesService.create(req.body, req.user.id);
    ApiResponse.created(res, { data: invoice });
  });

  static update = asyncHandler(async (req, res) => {
    const invoice = await InvoicesService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { data: invoice, message: 'Invoice updated' });
  });

  static verify = asyncHandler(async (req, res) => {
    const result = await InvoicesService.verify(req.params.id, req.user.id);
    ApiResponse.success(res, { data: result });
  });

  static downloadPdf = asyncHandler(async (req, res) => {
    const pdfBuffer = await InvoicesService.generatePdf(req.params.id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="Invoice.pdf"` });
    res.send(pdfBuffer);
  });

  static send = asyncHandler(async (req, res) => {
    const result = await InvoicesService.sendToVendor(req.params.id, req.user.id);
    ApiResponse.success(res, result);
  });
}

module.exports = InvoicesController;
