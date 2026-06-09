"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { PurchaseOrder, Vendor, RFQ, Invoice, Contract, Product, Status } from "@/lib/data";
import { purchaseOrders as seedPOs, vendors as seedVendors, rfqs as seedRFQs, invoices as seedInvoices, contracts as seedContracts, products as seedProducts, notifications as seedNotifications } from "@/lib/data";
import type { AuthUser } from "@/lib/auth/types";

function readStorage<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}

function getMergedPOs(): PurchaseOrder[] {
  const created = readStorage<PurchaseOrder & { isDraft?: boolean }>("vb_procurement_pos");
  const drafts = readStorage<PurchaseOrder & { isDraft?: boolean }>("vb_procurement_po_drafts");
  const extra = [...created, ...drafts.filter((d) => d.isDraft)].map((po) => ({ ...po, status: po.status }));
  return [...seedPOs, ...extra];
}

function getMergedVendors(): Vendor[] {
  const extra = readStorage<any>("vb_admin_vendors");
  return [...seedVendors, ...extra.filter((v: any) => !v.isDraft)];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  entityName: string;
  status: string;
  ipAddress: string;
  details?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success" | "warning";
  targetRole: string;
  read: boolean;
  createdAt: string;
  href: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  actorName: string;
  actorRole: string;
  timestamp: string;
  entityType: string;
  entityId: string;
  entityName: string;
  amount?: number;
  status: string;
  comments?: string;
}

function mockIP(): string {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 255)).join(".");
}

function now(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  avatar: string | null;
}

export interface AccessRequest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  requestedRole: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

interface GlobalState {
  currentUser: AuthUser | null;
  profile: UserProfile;
  accessRequests: AccessRequest[];
  purchaseOrders: PurchaseOrder[];
  vendors: Vendor[];
  rfqs: RFQ[];
  invoices: Invoice[];
  contracts: Contract[];
  products: Product[];
  notifications: SystemNotification[];
  activities: ActivityEntry[];
  auditLogs: AuditEntry[];

  setCurrentUser: (user: AuthUser | null) => void;
  updateProfile: (data: Partial<UserProfile>, actorName: string, actorRole: string) => void;
  addAccessRequest: (req: Omit<AccessRequest, "id" | "createdAt" | "status">) => void;
  approveAccessRequest: (id: string, actorName: string, actorRole: string) => void;
  rejectAccessRequest: (id: string, actorName: string, actorRole: string, note?: string) => void;

  approvePO: (poId: string, actorName: string, actorRole: string) => void;
  rejectPO: (poId: string, actorName: string, actorRole: string, reason: string) => void;
  submitPOForApproval: (poId: string, actorName: string, actorRole: string) => void;
  deletePO: (poId: string, actorName: string, actorRole: string) => void;
  addPO: (po: PurchaseOrder) => void;
  updatePO: (poId: string, updates: Partial<PurchaseOrder>) => void;
  canApprovePO: (poId: string) => boolean;

  addVendor: (vendor: Vendor, actorName: string, actorRole: string) => void;
  updateVendor: (vendorId: string, updates: Partial<Vendor>, actorName: string, actorRole: string) => void;

  addRFQ: (rfq: RFQ, actorName: string, actorRole: string) => void;
  updateRFQ: (rfqId: string, updates: Partial<RFQ>) => void;

  payInvoice: (invoiceId: string, actorName: string, actorRole: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  getUnreadCount: (role: string) => number;
  getNotificationsForRole: (role: string) => SystemNotification[];

  addNotification: (n: Omit<SystemNotification, "id" | "createdAt">) => void;
  addActivity: (a: Omit<ActivityEntry, "id" | "timestamp">) => void;
  addAuditLog: (a: Omit<AuditEntry, "id" | "timestamp" | "ipAddress">) => void;

  reset: () => void;
}

export const useStore = create<GlobalState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      profile: {
        firstName: "Alex",
        lastName: "Rivera",
        email: "alex.rivera@company.com",
        phone: "+1 (555) 123-4567",
        department: "Procurement",
        designation: "Procurement Admin",
        avatar: null,
      },
      purchaseOrders: getMergedPOs(),
      vendors: getMergedVendors(),
      rfqs: [...seedRFQs],
      invoices: [...seedInvoices],
      contracts: [...seedContracts],
      products: [...seedProducts],
      notifications: seedNotifications.map(n => ({
        ...n,
        targetRole: "all",
        createdAt: n.createdAt,
      } as SystemNotification)),
      activities: [],
      auditLogs: [],
      accessRequests: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      updateProfile: (data, actorName, actorRole) => {
        set((state) => ({
          profile: { ...state.profile, ...data },
          notifications: [{
            id: id("n"), title: "Profile Updated",
            message: `${actorName} updated their profile information`,
            type: "info" as const, targetRole: "all", read: false, createdAt: now(),
            href: "/settings/profile",
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "profile_updated", actorName, actorRole, timestamp: now(),
            entityType: "profile", entityId: actorName, entityName: `${state.profile.firstName} ${state.profile.lastName}`,
            status: "updated",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "profile_updated",
            entityType: "profile", entityId: actorName, entityName: `${state.profile.firstName} ${state.profile.lastName}`,
            status: "updated", ipAddress: mockIP(), details: `Updated: ${Object.keys(data).join(", ")}`,
          }, ...state.auditLogs],
        }));
      },

      addAccessRequest: (req) => {
        const newReq: AccessRequest = {
          ...req,
          id: id("ar"),
          status: "pending",
          createdAt: now(),
        };
        set((state) => ({
          accessRequests: [newReq, ...state.accessRequests],
          notifications: [{
            id: id("n"), title: "New Access Request",
            message: `${req.firstName} ${req.lastName} requested access as ${req.requestedRole}`,
            type: "info" as const, targetRole: "admin", read: false, createdAt: now(),
            href: "/admin/users/access-requests",
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "access_requested", actorName: `${req.firstName} ${req.lastName}`,
            actorRole: "vendor", timestamp: now(),
            entityType: "access_request", entityId: newReq.id,
            entityName: `${req.firstName} ${req.lastName} (${req.email})`,
            status: "pending",
          }, ...state.activities],
        }));
      },

      approveAccessRequest: (reqId, actorName, actorRole) => {
        set((state) => ({
          accessRequests: state.accessRequests.map((r) =>
            r.id === reqId ? { ...r, status: "approved", reviewedBy: actorName, reviewedAt: now() } : r
          ),
          notifications: [{
            id: id("n"), title: "Access Request Approved",
            message: `${state.accessRequests.find(r => r.id === reqId)?.firstName || ""} ${state.accessRequests.find(r => r.id === reqId)?.lastName || ""} was granted access`,
            type: "success" as const, targetRole: "all", read: false, createdAt: now(),
            href: "/admin/users",
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "approved", actorName, actorRole, timestamp: now(),
            entityType: "access_request", entityId: reqId,
            entityName: `${state.accessRequests.find(r => r.id === reqId)?.firstName || ""} ${state.accessRequests.find(r => r.id === reqId)?.lastName || ""}`,
            status: "approved",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "access_request_approved",
            entityType: "access_request", entityId: reqId,
            entityName: state.accessRequests.find(r => r.id === reqId)?.email || reqId,
            status: "approved", ipAddress: mockIP(), details: "Access request approved",
          }, ...state.auditLogs],
        }));
      },

      rejectAccessRequest: (reqId, actorName, actorRole, note) => {
        set((state) => ({
          accessRequests: state.accessRequests.map((r) =>
            r.id === reqId ? { ...r, status: "rejected", reviewedBy: actorName, reviewedAt: now(), reviewNote: note } : r
          ),
          notifications: [{
            id: id("n"), title: "Access Request Rejected",
            message: `${state.accessRequests.find(r => r.id === reqId)?.firstName || ""} ${state.accessRequests.find(r => r.id === reqId)?.lastName || ""}'s request was declined`,
            type: "alert" as const, targetRole: "all", read: false, createdAt: now(),
            href: "/admin/users/access-requests",
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "rejected", actorName, actorRole, timestamp: now(),
            entityType: "access_request", entityId: reqId,
            entityName: `${state.accessRequests.find(r => r.id === reqId)?.firstName || ""} ${state.accessRequests.find(r => r.id === reqId)?.lastName || ""}`,
            status: "rejected", comments: note,
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "access_request_rejected",
            entityType: "access_request", entityId: reqId,
            entityName: state.accessRequests.find(r => r.id === reqId)?.email || reqId,
            status: "rejected", ipAddress: mockIP(), details: note || "Access request rejected",
          }, ...state.auditLogs],
        }));
      },

      canApprovePO: (poId) => {
        const po = get().purchaseOrders.find(p => p.id === poId);
        return po?.status === "pending" || po?.status === "draft";
      },

      approvePO: (poId, actorName, actorRole) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) =>
            po.id === poId ? { ...po, status: "approved" as Status } : po
          ),
          notifications: [{
            id: id("n"), title: "Purchase Order Approved", message: `${state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId} approved by ${actorName}`,
            type: "success" as const, targetRole: "all", read: false, createdAt: now(), href: `/admin/purchase-orders/${poId}`,
          }, {
            id: id("n"), title: "PO Approved", message: `Your ${state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId} has been approved`,
            type: "success" as const, targetRole: "vendor", read: false, createdAt: now(), href: `/vendor/purchase-orders/${poId}`,
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "approved", actorName, actorRole, timestamp: now(),
            entityType: "po", entityId: poId, entityName: state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId,
            amount: state.purchaseOrders.find(p => p.id === poId)?.amount, status: "approved",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "approved",
            entityType: "po", entityId: poId, entityName: state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId,
            status: "approved", ipAddress: mockIP(), details: "PO approved",
          }, ...state.auditLogs],
        }));
      },

      rejectPO: (poId, actorName, actorRole, reason) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) =>
            po.id === poId ? { ...po, status: "rejected" as Status } : po
          ),
          notifications: [{
            id: id("n"), title: "Purchase Order Rejected", message: `${state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId} rejected by ${actorName}. Reason: ${reason}`,
            type: "alert" as const, targetRole: "all", read: false, createdAt: now(), href: `/admin/purchase-orders/${poId}`,
          }, {
            id: id("n"), title: "PO Rejected", message: `Your ${state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId} was rejected. Reason: ${reason}`,
            type: "alert" as const, targetRole: "vendor", read: false, createdAt: now(), href: `/vendor/purchase-orders/${poId}`,
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "rejected", actorName, actorRole, timestamp: now(),
            entityType: "po", entityId: poId, entityName: state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId,
            amount: state.purchaseOrders.find(p => p.id === poId)?.amount, status: "rejected", comments: reason,
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "rejected",
            entityType: "po", entityId: poId, entityName: state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId,
            status: "rejected", ipAddress: mockIP(), details: `Rejected: ${reason}`,
          }, ...state.auditLogs],
        }));
      },

      submitPOForApproval: (poId, actorName, actorRole) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) =>
            po.id === poId ? { ...po, status: "pending" as Status } : po
          ),
          notifications: [{
            id: id("n"), title: "PO Submitted for Approval", message: `${state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId} submitted by ${actorName}`,
            type: "info" as const, targetRole: "all", read: false, createdAt: now(), href: `/procurement/purchase-orders/${poId}`,
          }, {
            id: id("n"), title: "Approval Requested", message: `${state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId} needs your review`,
            type: "info" as const, targetRole: "manager", read: false, createdAt: now(), href: `/manager/approvals`,
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "approval_requested", actorName, actorRole, timestamp: now(),
            entityType: "po", entityId: poId, entityName: state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId,
            amount: state.purchaseOrders.find(p => p.id === poId)?.amount, status: "pending",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "submitted_for_approval",
            entityType: "po", entityId: poId, entityName: state.purchaseOrders.find(p => p.id === poId)?.poNumber || poId,
            status: "pending", ipAddress: mockIP(), details: "PO submitted for approval",
          }, ...state.auditLogs],
        }));
      },

      deletePO: (poId, actorName, actorRole) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.filter((po) => po.id !== poId),
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "deleted",
            entityType: "po", entityId: poId, entityName: seedPOs.find(p => p.id === poId)?.poNumber || poId,
            status: "deleted", ipAddress: mockIP(), details: "PO deleted",
          }, ...state.auditLogs],
        }));
      },

      addPO: (po) => {
        set((state) => ({
          purchaseOrders: [...state.purchaseOrders, po],
        }));
      },

      updatePO: (poId, updates) => {
        set((state) => ({
          purchaseOrders: state.purchaseOrders.map((po) =>
            po.id === poId ? { ...po, ...updates } : po
          ),
        }));
      },

      addVendor: (vendor, actorName, actorRole) => {
        set((state) => ({
          vendors: [...state.vendors, vendor],
          notifications: [{
            id: id("n"), title: "Vendor Created", message: `${vendor.name} has been added to the vendor network`,
            type: "success" as const, targetRole: "all", read: false, createdAt: now(), href: `/vendors/${vendor.id}`,
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "vendor_onboarded", actorName, actorRole, timestamp: now(),
            entityType: "vendor", entityId: vendor.id, entityName: vendor.name, status: "active",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "created",
            entityType: "vendor", entityId: vendor.id, entityName: vendor.name,
            status: "active", ipAddress: mockIP(), details: "Vendor created",
          }, ...state.auditLogs],
        }));
      },

      updateVendor: (vendorId, updates, actorName, actorRole) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId ? { ...v, ...updates } : v
          ),
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "updated",
            entityType: "vendor", entityId: vendorId, entityName: state.vendors.find(v => v.id === vendorId)?.name || vendorId,
            status: "updated", ipAddress: mockIP(), details: `Updated: ${Object.keys(updates).join(", ")}`,
          }, ...state.auditLogs],
        }));
      },

      addRFQ: (rfq, actorName, actorRole) => {
        set((state) => ({
          rfqs: [...state.rfqs, rfq],
          notifications: [{
            id: id("n"), title: "RFQ Created", message: `${rfq.title} has been published with budget ${rfq.budget}`,
            type: "info" as const, targetRole: "all", read: false, createdAt: now(), href: `/rfqs/${rfq.id}`,
          }, {
            id: id("n"), title: "New RFQ Opportunity", message: `${rfq.title} — deadline ${rfq.deadline}`,
            type: "info" as const, targetRole: "vendor", read: false, createdAt: now(), href: `/vendor/rfqs/${rfq.id}`,
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "rfq_created", actorName, actorRole, timestamp: now(),
            entityType: "rfq", entityId: rfq.id, entityName: rfq.title, amount: rfq.budget, status: "open",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "rfq_created",
            entityType: "rfq", entityId: rfq.id, entityName: rfq.title,
            status: "open", ipAddress: mockIP(), details: `Budget: ${rfq.budget}`,
          }, ...state.auditLogs],
        }));
      },

      updateRFQ: (rfqId, updates) => {
        set((state) => ({
          rfqs: state.rfqs.map((r) =>
            r.id === rfqId ? { ...r, ...updates } : r
          ),
        }));
      },

      payInvoice: (invoiceId, actorName, actorRole) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId ? { ...inv, status: "paid" as Status } : inv
          ),
          notifications: [{
            id: id("n"), title: "Invoice Paid", message: `${state.invoices.find(i => i.id === invoiceId)?.invoiceNumber || invoiceId} has been paid`,
            type: "success" as const, targetRole: "all", read: false, createdAt: now(), href: `/invoices/${invoiceId}`,
          }, {
            id: id("n"), title: "Payment Received", message: `Payment for ${state.invoices.find(i => i.id === invoiceId)?.invoiceNumber || invoiceId} has been processed`,
            type: "success" as const, targetRole: "vendor", read: false, createdAt: now(), href: `/vendor/purchase-orders`,
          }, ...state.notifications],
          activities: [{
            id: id("act"), action: "invoice_paid", actorName, actorRole, timestamp: now(),
            entityType: "invoice", entityId: invoiceId, entityName: state.invoices.find(i => i.id === invoiceId)?.invoiceNumber || invoiceId,
            amount: state.invoices.find(i => i.id === invoiceId)?.amount, status: "paid",
          }, ...state.activities],
          auditLogs: [{
            id: id("aud"), timestamp: now(), actorName, actorRole, action: "invoice_paid",
            entityType: "invoice", entityId: invoiceId, entityName: state.invoices.find(i => i.id === invoiceId)?.invoiceNumber || invoiceId,
            status: "paid", ipAddress: mockIP(), details: "Invoice payment processed",
          }, ...state.auditLogs],
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
      },

      getUnreadCount: (role) => {
        return get().notifications.filter((n) => !n.read && (n.targetRole === role || n.targetRole === "all")).length;
      },

      getNotificationsForRole: (role) => {
        return get().notifications.filter((n) => n.targetRole === role || n.targetRole === "all");
      },

      addNotification: (n) => {
        set((state) => ({
          notifications: [{ ...n, id: id("n"), createdAt: now() }, ...state.notifications],
        }));
      },

      addActivity: (a) => {
        set((state) => ({
          activities: [{ ...a, id: id("act"), timestamp: now() }, ...state.activities],
        }));
      },

      addAuditLog: (a) => {
        set((state) => ({
          auditLogs: [{ ...a, id: id("aud"), timestamp: now(), ipAddress: mockIP() }, ...state.auditLogs],
        }));
      },

      reset: () => set({
        purchaseOrders: [...seedPOs],
        vendors: [...seedVendors],
        rfqs: [...seedRFQs],
        invoices: [...seedInvoices],
        contracts: [...seedContracts],
        products: [...seedProducts],
        notifications: seedNotifications.map(n => ({
          ...n, targetRole: "all", createdAt: n.createdAt,
        } as SystemNotification)),
        activities: [],
        auditLogs: [],
      }),
    }),
    {
      name: "vb_global_store",
      partialize: (state) => ({
        purchaseOrders: state.purchaseOrders,
        vendors: state.vendors,
        rfqs: state.rfqs,
        invoices: state.invoices,
        contracts: state.contracts,
        products: state.products,
        notifications: state.notifications,
        activities: state.activities,
        auditLogs: state.auditLogs,
        profile: state.profile,
        accessRequests: state.accessRequests,
      }),
    }
  )
);
