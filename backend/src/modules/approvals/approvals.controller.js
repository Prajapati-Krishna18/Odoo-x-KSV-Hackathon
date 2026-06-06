const ApprovalsService = require('./approvals.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class ApprovalsController {
  static getPending = asyncHandler(async (req, res) => {
    const approvals = await ApprovalsService.getPending(req.user.id);
    ApiResponse.success(res, { data: approvals });
  });

  static getById = asyncHandler(async (req, res) => {
    const approval = await ApprovalsService.getById(req.params.id);
    ApiResponse.success(res, { data: approval });
  });

  static approve = asyncHandler(async (req, res) => {
    const approval = await ApprovalsService.approve(req.params.id, req.user.id, req.body.remarks);
    ApiResponse.success(res, { data: approval, message: 'Approved' });
  });

  static reject = asyncHandler(async (req, res) => {
    const approval = await ApprovalsService.reject(req.params.id, req.user.id, req.body.remarks);
    ApiResponse.success(res, { data: approval, message: 'Rejected' });
  });

  static escalate = asyncHandler(async (req, res) => {
    const approval = await ApprovalsService.escalate(req.params.id, req.user.id, req.body.remarks);
    ApiResponse.success(res, { data: approval, message: 'Escalated' });
  });
}

module.exports = ApprovalsController;
