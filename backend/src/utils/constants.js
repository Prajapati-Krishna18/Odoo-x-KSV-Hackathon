// ============================================
// Application Constants
// ============================================
// Why: Single source of truth for all enums, status values,
// and magic strings. Never hardcode strings in business logic.
// ============================================

const VENDOR_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  BLACKLISTED: 'BLACKLISTED',
};

const RFQ_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED',
  CANCELLED: 'CANCELLED',
  AWARDED: 'AWARDED',
};

const QUOTATION_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  REVISED: 'REVISED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
};

const APPROVAL_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ESCALATED: 'ESCALATED',
};

const PO_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  SENT: 'SENT',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

const INVOICE_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  VERIFIED: 'VERIFIED',
  APPROVED: 'APPROVED',
  PAID: 'PAID',
  DISPUTED: 'DISPUTED',
  CANCELLED: 'CANCELLED',
};

const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

const ENTITY_TYPE = {
  RFQ: 'RFQ',
  QUOTATION: 'QUOTATION',
  PURCHASE_ORDER: 'PURCHASE_ORDER',
  INVOICE: 'INVOICE',
  VENDOR: 'VENDOR',
  USER: 'USER',
};

// Permission modules and actions
const MODULES = {
  AUTH: 'auth',
  USER: 'user',
  ROLE: 'role',
  VENDOR: 'vendor',
  RFQ: 'rfq',
  QUOTATION: 'quotation',
  APPROVAL: 'approval',
  PO: 'purchase_order',
  INVOICE: 'invoice',
  NOTIFICATION: 'notification',
  ANALYTICS: 'analytics',
  AUDIT: 'audit',
};

const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  APPROVE: 'approve',
  EXPORT: 'export',
};

module.exports = {
  VENDOR_STATUS,
  RFQ_STATUS,
  QUOTATION_STATUS,
  APPROVAL_STATUS,
  PO_STATUS,
  INVOICE_STATUS,
  PRIORITY,
  ENTITY_TYPE,
  MODULES,
  ACTIONS,
};
