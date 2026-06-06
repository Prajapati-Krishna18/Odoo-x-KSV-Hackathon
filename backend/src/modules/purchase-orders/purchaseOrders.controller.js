const PurchaseOrdersService = require('./purchaseOrders.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class PurchaseOrdersController {
  static list = asyncHandler(async (req, res) => {
    const { pos, total, page, limit } = await PurchaseOrdersService.list(req.query);
    ApiResponse.paginated(res, { data: pos, page, limit, total });
  });

  static getById = asyncHandler(async (req, res) => {
    const po = await PurchaseOrdersService.getById(req.params.id);
    ApiResponse.success(res, { data: po });
  });

  static create = asyncHandler(async (req, res) => {
    const po = await PurchaseOrdersService.create(req.body, req.user.id);
    ApiResponse.created(res, { data: po, message: 'Purchase order created and sent for approval' });
  });

  static updateStatus = asyncHandler(async (req, res) => {
    const po = await PurchaseOrdersService.updateStatus(req.params.id, req.body.status, req.user.id);
    ApiResponse.success(res, { data: po, message: 'Status updated' });
  });

  static downloadPdf = asyncHandler(async (req, res) => {
    const pdfBuffer = await PurchaseOrdersService.generatePdf(req.params.id);
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="PO.pdf"` });
    res.send(pdfBuffer);
  });

  static sendToVendor = asyncHandler(async (req, res) => {
    const result = await PurchaseOrdersService.sendToVendor(req.params.id, req.user.id);
    ApiResponse.success(res, result);
  });
}

module.exports = PurchaseOrdersController;
