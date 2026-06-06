import { vendors, invoices } from "@/lib/data";

export interface RiskVendor {
  id: string;
  name: string;
  category: string;
  riskScore: number;
  riskLevel: "high" | "medium" | "low";
  complianceScore: number;
  financialHealth: number;
  deliveryRating: number;
  qualityScore: number;
  status: "active" | "at-risk" | "review";
  trend: "up" | "down" | "stable";
  location: string;
  spendYtd: number;
  contracts: number;
}

export interface RiskTrendPoint {
  month: string;
  riskScore: number;
  complianceScore: number;
  financialRisk: number;
}

export interface RiskCategory {
  name: string;
  percentage: number;
  color: string;
  severity: "high" | "medium" | "low";
}

export interface OverdueAging {
  bucket: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface AIInsight {
  type: "warning" | "positive";
  message: string;
}

export interface AIRecommendation {
  action: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

export const riskVendors: RiskVendor[] = [
  { id: "v1", name: "Acme Industrial Supply", category: "Raw Materials", riskScore: 28, riskLevel: "low", complianceScore: 96, financialHealth: 88, deliveryRating: 92, qualityScore: 94, status: "active", trend: "stable", location: "Chicago, IL", spendYtd: 284500, contracts: 3 },
  { id: "v2", name: "Pacific Logistics Co.", category: "Logistics", riskScore: 45, riskLevel: "medium", complianceScore: 88, financialHealth: 72, deliveryRating: 78, qualityScore: 85, status: "active", trend: "stable", location: "Los Angeles, CA", spendYtd: 156200, contracts: 2 },
  { id: "v3", name: "GreenTech Components", category: "Electronics", riskScore: 72, riskLevel: "high", complianceScore: 72, financialHealth: 55, deliveryRating: 60, qualityScore: 68, status: "review", trend: "up", location: "Austin, TX", spendYtd: 92300, contracts: 1 },
  { id: "v4", name: "Summit Office Solutions", category: "Office Supplies", riskScore: 22, riskLevel: "low", complianceScore: 94, financialHealth: 90, deliveryRating: 95, qualityScore: 92, status: "active", trend: "down", location: "Denver, CO", spendYtd: 44800, contracts: 1 },
  { id: "v5", name: "Nova Packaging Ltd.", category: "Packaging", riskScore: 82, riskLevel: "high", complianceScore: 61, financialHealth: 45, deliveryRating: 50, qualityScore: 55, status: "at-risk", trend: "up", location: "Portland, OR", spendYtd: 67800, contracts: 2 },
  { id: "v6", name: "Atlas Safety Gear", category: "Safety Equipment", riskScore: 18, riskLevel: "low", complianceScore: 98, financialHealth: 92, deliveryRating: 96, qualityScore: 97, status: "active", trend: "stable", location: "Houston, TX", spendYtd: 112400, contracts: 2 },
  { id: "v7", name: "Precision Tools Inc.", category: "Manufacturing", riskScore: 58, riskLevel: "medium", complianceScore: 82, financialHealth: 65, deliveryRating: 70, qualityScore: 74, status: "active", trend: "up", location: "Detroit, MI", spendYtd: 189000, contracts: 2 },
  { id: "v8", name: "DataStream Networks", category: "IT", riskScore: 38, riskLevel: "low", complianceScore: 91, financialHealth: 85, deliveryRating: 88, qualityScore: 90, status: "active", trend: "down", location: "San Jose, CA", spendYtd: 76500, contracts: 1 },
  { id: "v9", name: "EcoFleet Transport", category: "Logistics", riskScore: 65, riskLevel: "medium", complianceScore: 78, financialHealth: 60, deliveryRating: 65, qualityScore: 72, status: "review", trend: "up", location: "Phoenix, AZ", spendYtd: 134200, contracts: 2 },
  { id: "v10", name: "Apex Industrial Parts", category: "Raw Materials", riskScore: 78, riskLevel: "high", complianceScore: 68, financialHealth: 50, deliveryRating: 55, qualityScore: 62, status: "at-risk", trend: "up", location: "Cleveland, OH", spendYtd: 215000, contracts: 3 },
];

export const riskTrendData: RiskTrendPoint[] = [
  { month: "Jan", riskScore: 65, complianceScore: 78, financialRisk: 55 },
  { month: "Feb", riskScore: 62, complianceScore: 80, financialRisk: 52 },
  { month: "Mar", riskScore: 68, complianceScore: 76, financialRisk: 58 },
  { month: "Apr", riskScore: 58, complianceScore: 82, financialRisk: 48 },
  { month: "May", riskScore: 52, complianceScore: 85, financialRisk: 42 },
  { month: "Jun", riskScore: 48, complianceScore: 88, financialRisk: 38 },
];

export const riskCategories: RiskCategory[] = [
  { name: "Delivery Risk", percentage: 82, color: "#ef4444", severity: "high" },
  { name: "Financial Risk", percentage: 64, color: "#f97316", severity: "medium" },
  { name: "Compliance Risk", percentage: 51, color: "#eab308", severity: "medium" },
  { name: "Quality Risk", percentage: 38, color: "#22c55e", severity: "low" },
  { name: "Vendor Stability", percentage: 45, color: "#3b82f6", severity: "low" },
];

export const overdueAging: OverdueAging[] = [
  { bucket: "0-30 Days", amount: 22400, count: 1, percentage: 30 },
  { bucket: "31-60 Days", amount: 18700, count: 1, percentage: 25 },
  { bucket: "61-90 Days", amount: 15600, count: 1, percentage: 21 },
  { bucket: "90+ Days", amount: 17800, count: 1, percentage: 24 },
];

export const aiInsights: AIInsight[] = [
  { type: "warning", message: "Nova Packaging risk increased by 18%" },
  { type: "warning", message: "GreenTech compliance score dropped below threshold" },
  { type: "positive", message: "Atlas Safety remains stable" },
  { type: "positive", message: "Delivery performance improved by 12%" },
];

export const aiRecommendations: AIRecommendation[] = [
  { action: "Pause RFQ invitations to Nova Packaging", reason: "Risk score above 80 and rising", priority: "high" },
  { action: "Review GreenTech compliance documents", reason: "Score dropped 15% in 2 months", priority: "high" },
  { action: "Prioritize Atlas Safety for strategic sourcing", reason: "Consistent 95%+ compliance", priority: "medium" },
];

export function getVendorRiskDetail(id: string) {
  return riskVendors.find((v) => v.id === id);
}

export function getHighRiskCount() {
  return riskVendors.filter((v) => v.riskLevel === "high").length;
}

export function getMediumRiskCount() {
  return riskVendors.filter((v) => v.riskLevel === "medium").length;
}

export function getLowRiskCount() {
  return riskVendors.filter((v) => v.riskLevel === "low").length;
}

export function getOverallRiskScore() {
  const scores = riskVendors.map((v) => v.riskScore);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

export function getComplianceHeatmap() {
  return riskVendors
    .map((v) => ({ name: v.name, score: v.complianceScore }))
    .sort((a, b) => b.score - a.score);
}

export function getTotalOverdueAmount() {
  return invoices.filter((i) => i.status === "overdue").reduce((s, i) => s + i.amount, 0);
}
