import type { PurchaseOrder, Status } from "@/lib/data";
import { purchaseOrders as seedPOs } from "@/lib/data";

export interface POLineItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
}

export interface CreatePOData {
  poNumber: string;
  title: string;
  poDate: string;
  deliveryDate: string;
  vendorId: string;
  vendorName: string;
  vendorCategory: string;
  vendorContact: string;
  vendorEmail: string;
  vendorPhone: string;
  rfqId?: string;
  lineItems: POLineItem[];
  paymentTerms: string;
  paymentMethod: string;
  currency: string;
  shippingAddress: string;
  deliveryLocation: string;
  deliveryInstructions: string;
  internalNotes: string;
  vendorNotes: string;
  attachments: string[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  isDraft?: boolean;
}

const POS_KEY = "vb_procurement_pos";
const PO_DRAFTS_KEY = "vb_procurement_po_drafts";

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

export function generatePONumber(): string {
  const year = new Date().getFullYear();
  const seq = String(Date.now()).slice(-4);
  return `PO-${year}-${seq}`;
}

export function getAllPurchaseOrders(): PurchaseOrder[] {
  const created = read<PurchaseOrder & { isDraft?: boolean }>(POS_KEY);
  const drafts = read<PurchaseOrder & { isDraft?: boolean }>(PO_DRAFTS_KEY);
  return [...seedPOs, ...created, ...drafts.filter((d) => d.isDraft)];
}

export function getActivePurchaseOrders(): PurchaseOrder[] {
  return getAllPurchaseOrders();
}

export function savePurchaseOrder(
  data: CreatePOData,
  asDraft: boolean
): PurchaseOrder {
  const entry: PurchaseOrder & { isDraft?: boolean } = {
    id: `po-${Date.now()}`,
    poNumber: data.poNumber,
    vendorId: data.vendorId,
    vendorName: data.vendorName,
    amount: data.grandTotal,
    status: (asDraft ? "draft" : "pending") as Status,
    createdAt: data.poDate,
    dueDate: data.deliveryDate,
    items: data.lineItems.length,
    department: "Procurement",
    isDraft: asDraft,
  };

  if (asDraft) {
    const drafts = read<PurchaseOrder & { isDraft?: boolean }>(PO_DRAFTS_KEY);
    drafts.push(entry);
    write(PO_DRAFTS_KEY, drafts);
  } else {
    const list = read<PurchaseOrder>(POS_KEY);
    list.push(entry);
    write(POS_KEY, list);
    write(
      PO_DRAFTS_KEY,
      read<PurchaseOrder>(PO_DRAFTS_KEY).filter((d) => d.poNumber !== data.poNumber)
    );
  }
  return entry;
}
