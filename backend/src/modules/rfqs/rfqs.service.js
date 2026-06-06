const RfqsRepository = require('./rfqs.repository');
const AuditService = require('../../services/audit.service');
const NotificationService = require('../../services/notification.service');
const EmailService = require('../../services/email.service');
const generateNumber = require('../../utils/generateNumber');
const { NotFoundError, BadRequestError } = require('../../utils/ApiError');
const { parsePagination, parseSort } = require('../../utils/pagination');

class RfqsService {
  static async list(query) {
    const { skip, take, page, limit } = parsePagination(query);
    const orderBy = parseSort(query.sortBy, query.sortOrder, ['createdAt', 'title', 'submissionDeadline']);

    const where = {};
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { rfqNumber: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.categoryId) where.categoryId = query.categoryId;

    const { rfqs, total } = await RfqsRepository.findAll({ skip, take, orderBy, where });
    return { rfqs, total, page, limit };
  }

  static async getById(id) {
    const rfq = await RfqsRepository.findById(id);
    if (!rfq) throw new NotFoundError('RFQ');
    return rfq;
  }

  static async create(data, userId) {
    const rfqNumber = await generateNumber('RFQ', 'rfq', 'rfqNumber');

    const rfq = await RfqsRepository.create({
      ...data,
      rfqNumber,
      createdBy: userId,
    });

    await AuditService.log({
      userId, tableName: 'rfqs', recordId: rfq.id,
      action: 'INSERT', newValues: { rfqNumber, title: data.title },
    });

    return rfq;
  }

  static async update(id, data, userId) {
    const rfq = await RfqsRepository.findById(id);
    if (!rfq) throw new NotFoundError('RFQ');
    if (rfq.status !== 'DRAFT') {
      throw new BadRequestError('Only DRAFT RFQs can be edited');
    }
    const updated = await RfqsRepository.update(id, { ...data, updatedBy: userId });
    await AuditService.log({ userId, tableName: 'rfqs', recordId: id, action: 'UPDATE', newValues: data });
    return updated;
  }

  static async remove(id, userId) {
    const rfq = await RfqsRepository.findById(id);
    if (!rfq) throw new NotFoundError('RFQ');
    await RfqsRepository.softDelete(id);
    await AuditService.log({ userId, tableName: 'rfqs', recordId: id, action: 'DELETE' });
  }

  static async publish(id, userId) {
    const rfq = await RfqsRepository.findById(id);
    if (!rfq) throw new NotFoundError('RFQ');
    if (rfq.status !== 'DRAFT') throw new BadRequestError('Only DRAFT RFQs can be published');
    if (rfq.rfqVendors.length === 0) throw new BadRequestError('Invite at least one vendor before publishing');

    const updated = await RfqsRepository.update(id, { status: 'PUBLISHED', updatedBy: userId });

    // Send email invitations to all assigned vendors
    for (const rv of rfq.rfqVendors) {
      try {
        await EmailService.sendVendorInvitation({
          to: rv.vendor.email,
          vendorName: rv.vendor.companyName,
          rfqTitle: rfq.title,
          rfqNumber: rfq.rfqNumber,
          deadline: rfq.submissionDeadline,
        });
      } catch (err) {
        // Don't fail the publish if an email fails
      }
    }

    await AuditService.log({ userId, tableName: 'rfqs', recordId: id, action: 'UPDATE', newValues: { status: 'PUBLISHED' } });
    return updated;
  }

  static async close(id, userId) {
    const rfq = await RfqsRepository.findById(id);
    if (!rfq) throw new NotFoundError('RFQ');
    if (rfq.status !== 'PUBLISHED') throw new BadRequestError('Only PUBLISHED RFQs can be closed');

    const updated = await RfqsRepository.update(id, { status: 'CLOSED', updatedBy: userId });
    await AuditService.log({ userId, tableName: 'rfqs', recordId: id, action: 'UPDATE', newValues: { status: 'CLOSED' } });
    return updated;
  }

  static async inviteVendors(rfqId, vendorIds, userId) {
    const rfq = await RfqsRepository.findById(rfqId);
    if (!rfq) throw new NotFoundError('RFQ');
    if (!['DRAFT', 'PUBLISHED'].includes(rfq.status)) {
      throw new BadRequestError('Cannot invite vendors to this RFQ');
    }

    await RfqsRepository.inviteVendors(rfqId, vendorIds);
    await AuditService.log({ userId, tableName: 'rfq_vendors', recordId: rfqId, action: 'INSERT', newValues: { vendorIds } });
  }

  static async addAttachment(rfqId, file, userId) {
    const rfq = await RfqsRepository.findById(rfqId);
    if (!rfq) throw new NotFoundError('RFQ');

    return RfqsRepository.addAttachment({
      rfqId,
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: userId,
    });
  }

  static async removeAttachment(rfqId, attachmentId, userId) {
    await RfqsRepository.removeAttachment(attachmentId);
    await AuditService.log({ userId, tableName: 'rfq_attachments', recordId: attachmentId, action: 'DELETE' });
  }
}

module.exports = RfqsService;
