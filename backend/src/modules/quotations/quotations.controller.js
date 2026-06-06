const QuotationsService = require('./quotations.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class QuotationsController {
  static list = asyncHandler(async (req, res) => {
    const { quotations, total, page, limit } = await QuotationsService.list(req.query);
    ApiResponse.paginated(res, { data: quotations, page, limit, total });
  });

  static getById = asyncHandler(async (req, res) => {
    const quotation = await QuotationsService.getById(req.params.id);
    ApiResponse.success(res, { data: quotation });
  });

  static create = asyncHandler(async (req, res) => {
    const quotation = await QuotationsService.create(req.body, req.user.id);
    ApiResponse.created(res, { data: quotation });
  });

  static update = asyncHandler(async (req, res) => {
    const quotation = await QuotationsService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { data: quotation, message: 'Quotation revised' });
  });

  static accept = asyncHandler(async (req, res) => {
    const quotation = await QuotationsService.accept(req.params.id, req.user.id);
    ApiResponse.success(res, { data: quotation, message: 'Quotation accepted' });
  });

  static reject = asyncHandler(async (req, res) => {
    const quotation = await QuotationsService.reject(req.params.id, req.user.id);
    ApiResponse.success(res, { data: quotation, message: 'Quotation rejected' });
  });

  static compare = asyncHandler(async (req, res) => {
    const comparison = await QuotationsService.compareForRfq(req.params.id);
    ApiResponse.success(res, { data: comparison, message: 'Quotation comparison' });
  });
}

module.exports = QuotationsController;
