const RfqsService = require('./rfqs.service');
const ApiResponse = require('../../utils/ApiResponse');
const asyncHandler = require('../../utils/asyncHandler');

class RfqsController {
  static list = asyncHandler(async (req, res) => {
    const { rfqs, total, page, limit } = await RfqsService.list(req.query);
    ApiResponse.paginated(res, { data: rfqs, page, limit, total });
  });

  static getById = asyncHandler(async (req, res) => {
    const rfq = await RfqsService.getById(req.params.id);
    ApiResponse.success(res, { data: rfq });
  });

  static create = asyncHandler(async (req, res) => {
    const rfq = await RfqsService.create(req.body, req.user.id);
    ApiResponse.created(res, { data: rfq });
  });

  static update = asyncHandler(async (req, res) => {
    const rfq = await RfqsService.update(req.params.id, req.body, req.user.id);
    ApiResponse.success(res, { data: rfq, message: 'RFQ updated' });
  });

  static remove = asyncHandler(async (req, res) => {
    await RfqsService.remove(req.params.id, req.user.id);
    ApiResponse.success(res, { message: 'RFQ cancelled' });
  });

  static publish = asyncHandler(async (req, res) => {
    const rfq = await RfqsService.publish(req.params.id, req.user.id);
    ApiResponse.success(res, { data: rfq, message: 'RFQ published and vendors notified' });
  });

  static close = asyncHandler(async (req, res) => {
    const rfq = await RfqsService.close(req.params.id, req.user.id);
    ApiResponse.success(res, { data: rfq, message: 'RFQ closed' });
  });

  static inviteVendors = asyncHandler(async (req, res) => {
    await RfqsService.inviteVendors(req.params.id, req.body.vendorIds, req.user.id);
    ApiResponse.success(res, { message: 'Vendors invited' });
  });

  static addAttachment = asyncHandler(async (req, res) => {
    const attachment = await RfqsService.addAttachment(req.params.id, req.file, req.user.id);
    ApiResponse.created(res, { data: attachment, message: 'Attachment uploaded' });
  });

  static removeAttachment = asyncHandler(async (req, res) => {
    await RfqsService.removeAttachment(req.params.id, req.params.aid, req.user.id);
    ApiResponse.success(res, { message: 'Attachment deleted' });
  });
}

module.exports = RfqsController;
