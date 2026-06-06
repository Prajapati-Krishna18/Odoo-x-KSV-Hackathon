const AnalyticsService = require('./analytics.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class AnalyticsController {
  static dashboard = asyncHandler(async (req, res) => {
    const data = await AnalyticsService.getDashboard();
    ApiResponse.success(res, { data, message: 'Dashboard metrics' });
  });

  static spending = asyncHandler(async (req, res) => {
    const data = await AnalyticsService.getSpending(req.query);
    ApiResponse.success(res, { data });
  });

  static vendorPerformance = asyncHandler(async (req, res) => {
    const data = await AnalyticsService.getVendorPerformance();
    ApiResponse.success(res, { data });
  });

  static procurementHealth = asyncHandler(async (req, res) => {
    const data = await AnalyticsService.getProcurementHealth();
    ApiResponse.success(res, { data });
  });

  static costSavings = asyncHandler(async (req, res) => {
    const data = await AnalyticsService.getCostSavings();
    ApiResponse.success(res, { data });
  });
}

module.exports = AnalyticsController;
