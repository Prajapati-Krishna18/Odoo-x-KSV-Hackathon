import type { Status } from "@/lib/data";
import { vendors } from "@/lib/data";

export interface Quotation {
  id: string;
  rfqId: string;
  vendorId: string;
  vendorName: string;
  quotedPrice: number;
  deliveryTimeDays: number;
  leadTimeDays: number;
  warrantyMonths: number;
  vendorRating: number;
  riskScore: number;
  pastPerformance: number;
  responseTimeHours: number;
  complianceScore: number;
  status: Status;
  submittedAt: string;
  notes?: string;
}

const QUOTATIONS_KEY = "vb_quotations";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

const seedQuotations: Quotation[] = [
  { id: "q1", rfqId: "rfq1", vendorId: "v1", vendorName: "Acme Industrial Supply", quotedPrice: 115000, deliveryTimeDays: 14, leadTimeDays: 7, warrantyMonths: 24, vendorRating: 4.8, riskScore: 28, pastPerformance: 94, responseTimeHours: 6, complianceScore: 96, status: "pending", submittedAt: "2026-05-20T10:30:00Z" },
  { id: "q2", rfqId: "rfq1", vendorId: "v5", vendorName: "Nova Packaging Ltd.", quotedPrice: 98000, deliveryTimeDays: 21, leadTimeDays: 10, warrantyMonths: 12, vendorRating: 3.9, riskScore: 82, pastPerformance: 55, responseTimeHours: 18, complianceScore: 61, status: "pending", submittedAt: "2026-05-22T14:15:00Z" },
  { id: "q3", rfqId: "rfq2", vendorId: "v3", vendorName: "GreenTech Components", quotedPrice: 82000, deliveryTimeDays: 28, leadTimeDays: 21, warrantyMonths: 36, vendorRating: 4.2, riskScore: 72, pastPerformance: 68, responseTimeHours: 12, complianceScore: 72, status: "pending", submittedAt: "2026-05-25T09:00:00Z" },
  { id: "q4", rfqId: "rfq3", vendorId: "v6", vendorName: "Atlas Safety Gear", quotedPrice: 42000, deliveryTimeDays: 10, leadTimeDays: 4, warrantyMonths: 18, vendorRating: 4.9, riskScore: 18, pastPerformance: 97, responseTimeHours: 3, complianceScore: 98, status: "pending", submittedAt: "2026-04-15T11:00:00Z" },
  { id: "q5", rfqId: "rfq3", vendorId: "v4", vendorName: "Summit Office Solutions", quotedPrice: 44500, deliveryTimeDays: 7, leadTimeDays: 3, warrantyMonths: 12, vendorRating: 4.6, riskScore: 22, pastPerformance: 92, responseTimeHours: 5, complianceScore: 94, status: "pending", submittedAt: "2026-04-18T16:30:00Z" },
  { id: "q6", rfqId: "rfq3", vendorId: "v1", vendorName: "Acme Industrial Supply", quotedPrice: 43800, deliveryTimeDays: 12, leadTimeDays: 7, warrantyMonths: 24, vendorRating: 4.8, riskScore: 28, pastPerformance: 94, responseTimeHours: 8, complianceScore: 96, status: "pending", submittedAt: "2026-04-20T08:45:00Z" },
];

export function getQuotations(): Quotation[] {
  const stored = read<Quotation>(QUOTATIONS_KEY);
  return [...seedQuotations, ...stored];
}

export function getQuotationsByRFQ(rfqId: string): Quotation[] {
  return getQuotations().filter((q) => q.rfqId === rfqId);
}

export function submitQuotation(q: Omit<Quotation, "id" | "submittedAt" | "status">): Quotation {
  const quotation: Quotation = { ...q, id: `q-${Date.now()}`, submittedAt: new Date().toISOString(), status: "pending" };
  const list = read<Quotation>(QUOTATIONS_KEY);
  list.push(quotation);
  write(QUOTATIONS_KEY, list);
  return quotation;
}

export function getQuotationById(id: string): Quotation | undefined {
  return getQuotations().find((q) => q.id === id);
}

export function getBestQuotation(rfqId: string): Quotation | null {
  const quotes = getQuotationsByRFQ(rfqId);
  if (quotes.length === 0) return null;
  return quotes.reduce((best, q) => {
    const bestScore = best.complianceScore * 0.3 + (100 - best.riskScore) * 0.3 + (100 - (best.quotedPrice / 1000)) * 0.2 + best.vendorRating * 10 * 0.2;
    const qScore = q.complianceScore * 0.3 + (100 - q.riskScore) * 0.3 + (100 - (q.quotedPrice / 1000)) * 0.2 + q.vendorRating * 10 * 0.2;
    return qScore > bestScore ? q : best;
  });
}

export function getVendorName(vendorId: string): string {
  return vendors.find((v) => v.id === vendorId)?.name || vendorId;
}
