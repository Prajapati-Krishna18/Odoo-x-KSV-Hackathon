import type { Status } from "@/lib/data";
import { purchaseOrders as seedPOs } from "@/lib/data";

export interface WorkflowEvent {
  id: string;
  action: "rfq_created" | "quotation_submitted" | "approval_requested" | "approved" | "rejected" | "po_generated" | "invoice_paid" | "vendor_invited" | "vendor_onboarded";
  actorName: string;
  actorRole: string;
  timestamp: string;
  entityType: "rfq" | "po" | "invoice" | "vendor" | "quotation";
  entityId: string;
  entityName: string;
  amount?: number;
  status: string;
  comments?: string;
}

export interface Notification {
  id: string;
  type: "rfq" | "quotation" | "approval" | "invoice" | "vendor" | "system";
  message: string;
  targetRole: string;
  read: boolean;
  timestamp: string;
  relatedId: string;
  href: string;
}

const EVENTS_KEY = "vb_workflow_events";
const NOTIFICATIONS_KEY = "vb_notifications";
const APPROVED_POS_KEY = "vb_approved_pos_workflow";
const REJECTED_POS_KEY = "vb_rejected_pos_workflow";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function addEvent(event: Omit<WorkflowEvent, "id" | "timestamp">): WorkflowEvent {
  const ev: WorkflowEvent = { ...event, id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString() };
  const events = read<WorkflowEvent>(EVENTS_KEY);
  events.unshift(ev);
  write(EVENTS_KEY, events);
  return ev;
}

export function getEvents(limit = 50): WorkflowEvent[] {
  return read<WorkflowEvent>(EVENTS_KEY).slice(0, limit);
}

export function getEventsByEntity(entityType: string, entityId: string): WorkflowEvent[] {
  return read<WorkflowEvent>(EVENTS_KEY).filter((e) => e.entityType === entityType && e.entityId === entityId);
}

export function getAllEvents(): WorkflowEvent[] {
  return read<WorkflowEvent>(EVENTS_KEY);
}

export function addNotification(notif: Omit<Notification, "id" | "timestamp">): Notification {
  const n: Notification = { ...notif, id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, timestamp: new Date().toISOString() };
  const list = read<Notification>(NOTIFICATIONS_KEY);
  list.unshift(n);
  write(NOTIFICATIONS_KEY, list);
  return n;
}

export function getNotifications(role?: string): Notification[] {
  const all = read<Notification>(NOTIFICATIONS_KEY);
  if (role) return all.filter((n) => n.targetRole === role || n.targetRole === "all");
  return all;
}

export function getUnreadCount(role: string): number {
  return read<Notification>(NOTIFICATIONS_KEY).filter((n) => !n.read && (n.targetRole === role || n.targetRole === "all")).length;
}

export function markNotificationRead(id: string) {
  const list = read<Notification>(NOTIFICATIONS_KEY);
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) { list[idx].read = true; write(NOTIFICATIONS_KEY, list); }
}

export function markAllNotificationsRead(role: string) {
  const list = read<Notification>(NOTIFICATIONS_KEY);
  list.forEach((n) => { if (n.targetRole === role || n.targetRole === "all") n.read = true; });
  write(NOTIFICATIONS_KEY, list);
}

export function approvePO(poId: string, actorName: string, actorRole: string): WorkflowEvent {
  updateSeedPOStatus(poId, "approved");
  const po = seedPOs.find((p) => p.id === poId);
  const ev = addEvent({ action: "approved", actorName, actorRole, entityType: "po", entityId: poId, entityName: po?.poNumber || poId, amount: po?.amount, status: "approved" });
  const approved = read<string>(APPROVED_POS_KEY);
  if (!approved.includes(poId)) approved.push(poId);
  write(APPROVED_POS_KEY, approved);
  addNotification({ type: "approval", message: `PO ${po?.poNumber || poId} approved by ${actorName}`, targetRole: "all", read: false, relatedId: poId, href: "/manager/approval-history" });
  addNotification({ type: "approval", message: `Your PO ${po?.poNumber || poId} has been approved`, targetRole: "vendor", read: false, relatedId: poId, href: "/vendor/purchase-orders" });
  return ev;
}

export function rejectPO(poId: string, actorName: string, actorRole: string, reason: string): WorkflowEvent {
  updateSeedPOStatus(poId, "rejected");
  const po = seedPOs.find((p) => p.id === poId);
  const ev = addEvent({ action: "rejected", actorName, actorRole, entityType: "po", entityId: poId, entityName: po?.poNumber || poId, amount: po?.amount, status: "rejected", comments: reason });
  const rejected = read<string>(REJECTED_POS_KEY);
  if (!rejected.includes(poId)) rejected.push(poId);
  write(REJECTED_POS_KEY, rejected);
  addNotification({ type: "approval", message: `PO ${po?.poNumber || poId} rejected by ${actorName}`, targetRole: "all", read: false, relatedId: poId, href: "/manager/approval-history" });
  addNotification({ type: "vendor", message: `Your PO ${po?.poNumber || poId} was rejected. Reason: ${reason}`, targetRole: "vendor", read: false, relatedId: poId, href: "/vendor/purchase-orders" });
  return ev;
}

export function isPOApproved(poId: string): boolean {
  return read<string>(APPROVED_POS_KEY).includes(poId);
}

export function isPORejected(poId: string): boolean {
  return read<string>(REJECTED_POS_KEY).includes(poId);
}

export function getPOStatus(poId: string): "pending" | "approved" | "rejected" {
  if (isPOApproved(poId)) return "approved";
  if (isPORejected(poId)) return "rejected";
  return "pending";
}

function updateSeedPOStatus(poId: string, status: Status) {
  const po = seedPOs.find((p) => p.id === poId);
  if (po) po.status = status;
}

export function getAllPOsWithWorkflowStatus() {
  return seedPOs.map((po) => ({ ...po, effectiveStatus: getPOStatus(po.id) }));
}

export function getPOWithActionInfo(poId: string) {
  const po = seedPOs.find((p) => p.id === poId);
  const events = getEventsByEntity("po", poId);
  const status = getPOStatus(poId);
  const actionEvent = events.find((e) => e.action === "approved" || e.action === "rejected");
  if (!po) return null;
  return { ...po, effectiveStatus: status, actorName: actionEvent?.actorName, comments: actionEvent?.comments, actionTimestamp: actionEvent?.timestamp };
}

export function getAllPOsWithActionInfo() {
  return seedPOs.map((po) => getPOWithActionInfo(po.id)).filter((p): p is NonNullable<typeof p> => p !== null && p.effectiveStatus !== "pending");
}

export { seedPOs };
