import type { Status } from "@/lib/data";
import { purchaseOrders as seedPOs } from "@/lib/data";

export interface ApprovalAction {
  poId: string;
  action: "approved" | "rejected";
  approverName: string;
  timestamp: string;
  rejectionReason?: string;
}

const APPROVED_KEY = "vb_approved_pos";
const REJECTED_KEY = "vb_rejected_pos";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getApprovedPOs() {
  return read<ApprovalAction>(APPROVED_KEY);
}

export function getRejectedPOs() {
  return read<ApprovalAction>(REJECTED_KEY);
}

export function getApprovalActions() {
  return [...getApprovedPOs(), ...getRejectedPOs()];
}

export function isPOActioned(poId: string): boolean {
  return (
    getApprovedPOs().some((a) => a.poId === poId) ||
    getRejectedPOs().some((a) => a.poId === poId)
  );
}

export function getPOAction(poId: string): ApprovalAction | null {
  const approved = getApprovedPOs().find((a) => a.poId === poId);
  if (approved) return approved;
  const rejected = getRejectedPOs().find((a) => a.poId === poId);
  return rejected || null;
}

export function approvePO(poId: string, approverName: string): ApprovalAction {
  const action: ApprovalAction = {
    poId,
    action: "approved",
    approverName,
    timestamp: new Date().toISOString(),
  };
  const list = getApprovedPOs();
  list.push(action);
  write(APPROVED_KEY, list);
  updateSeedPOStatus(poId, "approved");
  return action;
}

export function rejectPO(
  poId: string,
  approverName: string,
  rejectionReason: string
): ApprovalAction {
  const action: ApprovalAction = {
    poId,
    action: "rejected",
    approverName,
    timestamp: new Date().toISOString(),
    rejectionReason,
  };
  const list = getRejectedPOs();
  list.push(action);
  write(REJECTED_KEY, list);
  updateSeedPOStatus(poId, "rejected");
  return action;
}

function updateSeedPOStatus(poId: string, status: Status) {
  const po = seedPOs.find((p) => p.id === poId);
  if (po) {
    po.status = status;
  }
}

export function getAllPOsWithActions() {
  const actions = getApprovalActions();
  return seedPOs.map((po) => {
    const action = actions.find((a) => a.poId === po.id);
    const effectiveStatus = action ? action.action : po.status;
    return {
      ...po,
      status: effectiveStatus as Status,
      action,
    };
  });
}

export const TOAST_KEY = "vb_toast";

export function setPendingToast(message: string, type: "success" | "error" | "info" = "success") {
  sessionStorage.setItem(TOAST_KEY, JSON.stringify({ message, type }));
}

export function consumePendingToast(): { message: string; type: string } | null {
  const raw = sessionStorage.getItem(TOAST_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(TOAST_KEY);
  return JSON.parse(raw);
}
