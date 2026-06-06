const VendorsService = require('./vendors.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class VendorsController {
  static list = asyncHandler(async (req, res) => {
    const { vendors, total, page, limit } = await VendorsService.list(req.query);
    ApiResponse.paginated(res, { data: vendors, page, limit, total });
  });

  static getById = asyncHandler(async (req, res) => {
    const vendor = await VendorsService.getById(req.params.id);
    ApiResponse.success(res, { data: vendor });
  });

  static create = asyncHandler(async (req, res) => {
    const vendor = await VendorsService.create(req.body, req.user.id);
    ApiResponse.created(res, { data: vendor });
  });

  static update = asyncHandler(async (req, res) => {
    const vendor = await VendorsService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { data: vendor, message: 'Vendor updated' });
  });

  static remove = asyncHandler(async (req, res) => {
    await VendorsService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'Vendor deleted' });
  });

  static updateStatus = asyncHandler(async (req, res) => {
    const vendor = await VendorsService.updateStatus(req.params.id, req.body.status, req.user.id);
    ApiResponse.success(res, { data: vendor, message: 'Vendor status updated' });
  });

  static rate = asyncHandler(async (req, res) => {
    const rating = await VendorsService.rateVendor(req.params.id, req.body, req.user.id);
    ApiResponse.created(res, { data: rating, message: 'Vendor rated' });
  });

  static getPerformance = asyncHandler(async (req, res) => {
    const performance = await VendorsService.getPerformance(req.params.id);
    ApiResponse.success(res, { data: performance });
  });

  static recommend = asyncHandler(async (req, res) => {
    const vendors = await VendorsService.getRecommendations(req.query.categoryId);
    ApiResponse.success(res, { data: vendors, message: 'Recommended vendors' });
  });
}

module.exports = VendorsController;
