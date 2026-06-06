const ApprovalsRepository = require('./approvals.repository');
const NotificationService = require('../../services/notification.service');
const AuditService = require('../../services/audit.service');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../../utils/ApiError');

class ApprovalsService {
  static async getPending(userId) {
    return ApprovalsRepository.findPending(userId);
  }

  static async getById(id) {
    const approval = await ApprovalsRepository.findById(id);
    if (!approval) throw new NotFoundError('Approval');
    return approval;
  }

  static async createApproval({ entityType, entityId, rfqId, totalSteps, initiatedBy }) {
    return ApprovalsRepository.create({
      entityType,
      entityId,
      rfqId,
      totalSteps,
      status: totalSteps > 1 ? 'IN_PROGRESS' : 'PENDING',
      initiatedBy,
    });
  }

  static async approve(id, userId, remarks) {
    const approval = await ApprovalsRepository.findById(id);
    if (!approval) throw new NotFoundError('Approval');
    if (['APPROVED', 'REJECTED'].includes(approval.status)) {
      throw new BadRequestError('This approval has already been decided');
    }

    // Segregation of duties: creator cannot approve their own
    if (approval.initiatedBy === userId) {
      throw new ForbiddenError('You cannot approve your own request');
    }

    await ApprovalsRepository.addHistory({
      approvalId: id,
      stepNumber: approval.currentStep,
      approverId: userId,
      action: 'APPROVED',
      remarks,
    });

    const isLastStep = approval.currentStep >= approval.totalSteps;
    const updateData = isLastStep
      ? { status: 'APPROVED', currentStep: approval.currentStep }
      : { currentStep: approval.currentStep + 1, status: 'IN_PROGRESS' };

    const updated = await ApprovalsRepository.update(id, updateData);

    // Notify initiator
    await NotificationService.create({
      userId: approval.initiatedBy,
      type: isLastStep ? 'APPROVAL_APPROVED' : 'GENERAL',
      title: isLastStep ? 'Approval Granted' : 'Approval In Progress',
      message: isLastStep
        ? `Your request has been fully approved`
        : `Step ${approval.currentStep} approved. Proceeding to step ${approval.currentStep + 1}`,
      entityType: approval.entityType,
      entityId: approval.entityId,
    });

    await AuditService.log({ userId, tableName: 'approvals', recordId: id, action: 'UPDATE', newValues: { action: 'APPROVED', step: approval.currentStep } });
    return updated;
  }

  static async reject(id, userId, remarks) {
    const approval = await ApprovalsRepository.findById(id);
    if (!approval) throw new NotFoundError('Approval');
    if (['APPROVED', 'REJECTED'].includes(approval.status)) {
      throw new BadRequestError('This approval has already been decided');
    }

    if (approval.initiatedBy === userId) {
      throw new ForbiddenError('You cannot reject your own request');
    }

    await ApprovalsRepository.addHistory({
      approvalId: id,
      stepNumber: approval.currentStep,
      approverId: userId,
      action: 'REJECTED',
      remarks,
    });

    const updated = await ApprovalsRepository.update(id, { status: 'REJECTED' });

    await NotificationService.create({
      userId: approval.initiatedBy,
      type: 'APPROVAL_REJECTED',
      title: 'Approval Rejected',
      message: `Your request has been rejected. Reason: ${remarks || 'No reason provided'}`,
      entityType: approval.entityType,
      entityId: approval.entityId,
    });

    await AuditService.log({ userId, tableName: 'approvals', recordId: id, action: 'UPDATE', newValues: { action: 'REJECTED', remarks } });
    return updated;
  }

  static async escalate(id, userId, remarks) {
    const approval = await ApprovalsRepository.findById(id);
    if (!approval) throw new NotFoundError('Approval');

    await ApprovalsRepository.addHistory({
      approvalId: id,
      stepNumber: approval.currentStep,
      approverId: userId,
      action: 'ESCALATED',
      remarks,
    });

    const updated = await ApprovalsRepository.update(id, {
      status: 'ESCALATED',
      totalSteps: approval.totalSteps + 1,
    });

    await AuditService.log({ userId, tableName: 'approvals', recordId: id, action: 'UPDATE', newValues: { action: 'ESCALATED' } });
    return updated;
  }
}

module.exports = ApprovalsService;
