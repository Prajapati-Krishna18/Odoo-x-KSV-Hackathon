import { vendors, purchaseOrders, rfqs, invoices, teamMembers, dashboardStats } from "@/lib/data";
import { getApprovedPOs, getRejectedPOs } from "@/lib/approval-store";
import { riskVendors } from "@/lib/risk-store";

export const adminAnalytics = {
  kpis: [
    { label: "Total Spend", value: "$1,450,000", trend: "up" as const, trendText: "+12% vs last month", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Total Vendors", value: String(vendors.length), trend: "up" as const, trendText: "+2 this month", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Users", value: String(teamMembers.length), trend: "stable" as const, trendText: "Active", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Open RFQs", value: String(rfqs.filter((r) => r.status === "open").length), trend: "up" as const, trendText: "New requests", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Approvals", value: String(purchaseOrders.filter((p) => p.status === "pending").length), trend: "down" as const, trendText: "Needs attention", color: "text-red-600", bg: "bg-red-50" },
    { label: "Active POs", value: String(purchaseOrders.filter((p) => p.status === "approved" || p.status === "pending").length), trend: "up" as const, trendText: "+3 this week", color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Monthly Savings", value: "$42,500", trend: "up" as const, trendText: "+8% efficiency", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Compliance Score", value: "89%", trend: "up" as const, trendText: "+5% improvement", color: "text-green-600", bg: "bg-green-50" },
  ],
  vendorSpend: [
    { label: "Acme Industrial", value: 284500, color: "#4f46e5" },
    { label: "Pacific Logistics", value: 156200, color: "#f97316" },
    { label: "GreenTech", value: 92300, color: "#eab308" },
    { label: "Summit Office", value: 44800, color: "#22c55e" },
    { label: "Nova Packaging", value: 67800, color: "#ef4444" },
    { label: "Atlas Safety", value: 112400, color: "#3b82f6" },
  ],
  monthlySpend: [
    { month: "Jan", spend: 110000, target: 120000 },
    { month: "Feb", spend: 105000, target: 115000 },
    { month: "Mar", spend: 128000, target: 125000 },
    { month: "Apr", spend: 118000, target: 120000 },
    { month: "May", spend: 135000, target: 130000 },
    { month: "Jun", spend: 142000, target: 135000 },
  ],
  deptSpend: [
    { label: "Manufacturing", value: 520000, color: "#4f46e5" },
    { label: "Operations", value: 345000, color: "#f97316" },
    { label: "R&D", value: 198000, color: "#22c55e" },
    { label: "Admin", value: 124000, color: "#eab308" },
    { label: "Facilities", value: 89000, color: "#3b82f6" },
    { label: "IT", value: 156000, color: "#ef4444" },
  ],
  approvalPerf: [
    { month: "Jan", approved: 12, rejected: 3 },
    { month: "Feb", approved: 15, rejected: 2 },
    { month: "Mar", approved: 10, rejected: 4 },
    { month: "Apr", approved: 18, rejected: 1 },
    { month: "May", approved: 14, rejected: 3 },
    { month: "Jun", approved: 20, rejected: 2 },
  ],
  topVendors: [
    { name: "Acme Industrial Supply", spend: 284500, performance: 96, risk: "Low" as const },
    { name: "Pacific Logistics Co.", spend: 156200, performance: 82, risk: "Medium" as const },
    { name: "Atlas Safety Gear", spend: 112400, performance: 98, risk: "Low" as const },
    { name: "GreenTech Components", spend: 92300, performance: 68, risk: "High" as const },
    { name: "Nova Packaging Ltd.", spend: 67800, performance: 55, risk: "High" as const },
  ],
  recentActivities: [
    { action: "User Added", detail: "New procurement officer invited", time: "2 hours ago" },
    { action: "Vendor Approved", detail: "Atlas Safety Gear re-certified", time: "4 hours ago" },
    { action: "PO Generated", detail: "PO-2026-0142 created for Acme", time: "6 hours ago" },
    { action: "Invoice Paid", detail: "INV-88312 paid to Summit Office", time: "1 day ago" },
    { action: "Vendor Approved", detail: "New vendor registration approved", time: "2 days ago" },
  ],
};

export const managerAnalytics = {
  kpis: [
    { label: "Pending Approvals", value: String(purchaseOrders.filter((p) => p.status === "pending").length), trend: "down" as const, trendText: "Requires action", color: "text-amber-600", bg: "bg-amber-50", href: "/manager/approvals" },
    { label: "Approved Requests", value: String(getApprovedPOs().length || purchaseOrders.filter((p) => p.status === "approved").length), trend: "up" as const, trendText: "+5 this month", color: "text-emerald-600", bg: "bg-emerald-50", href: "/manager/approval-history" },
    { label: "Rejected Requests", value: String(getRejectedPOs().length || purchaseOrders.filter((p) => p.status === "rejected").length), trend: "down" as const, trendText: "-2 vs last month", color: "text-red-600", bg: "bg-red-50", href: "/manager/approval-history" },
    { label: "Dept. Spend", value: "$1,450,000", trend: "up" as const, trendText: "+8% this quarter", color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Risk Alerts", value: String(riskVendors.filter((v) => v.riskLevel === "high").length), trend: "up" as const, trendText: "Needs review", color: "text-red-600", bg: "bg-red-50", href: "/manager/risk-center" },
    { label: "Open POs", value: String(purchaseOrders.filter((p) => p.status === "pending").length), trend: "stable" as const, trendText: "Awaiting decision", color: "text-blue-600", bg: "bg-blue-50" },
  ],
  approvalTrends: [
    { month: "Jan", approved: 10, pending: 5, rejected: 2 },
    { month: "Feb", approved: 13, pending: 4, rejected: 1 },
    { month: "Mar", approved: 8, pending: 6, rejected: 3 },
    { month: "Apr", approved: 16, pending: 3, rejected: 1 },
    { month: "May", approved: 12, pending: 5, rejected: 2 },
    { month: "Jun", approved: 18, pending: 2, rejected: 1 },
  ],
  deptSpend: [
    { label: "Manufacturing", value: 520000, color: "#4f46e5" },
    { label: "Operations", value: 345000, color: "#f97316" },
    { label: "R&D", value: 198000, color: "#22c55e" },
    { label: "Admin", value: 124000, color: "#eab308" },
    { label: "Facilities", value: 89000, color: "#3b82f6" },
  ],
  riskAnalysis: [
    { category: "Delivery", score: 82, color: "#ef4444" },
    { category: "Financial", score: 64, color: "#f97316" },
    { category: "Compliance", score: 51, color: "#eab308" },
    { category: "Quality", score: 38, color: "#22c55e" },
    { category: "Stability", score: 45, color: "#3b82f6" },
  ],
  insights: [
    { type: "warning" as const, message: "Approval bottleneck detected — 3 POs pending for 5+ days" },
    { type: "warning" as const, message: "Vendor risk increasing — Nova Packaging score dropped 18%" },
    { type: "warning" as const, message: "Department overspending — Manufacturing 12% over budget" },
    { type: "info" as const, message: "Contract renewal required — Pacific Logistics SLA expires in 24 days" },
  ],
};

export const procurementAnalytics = {
  kpis: [
    { label: "Active RFQs", value: String(rfqs.filter((r) => r.status === "open").length), trend: "up" as const, trendText: "+2 new", color: "text-indigo-600", bg: "bg-indigo-50", href: "/procurement/rfqs" },
    { label: "Quotations Received", value: String(rfqs.reduce((s, r) => s + r.responses, 0)), trend: "up" as const, trendText: "This quarter", color: "text-emerald-600", bg: "bg-emerald-50", href: "/procurement/quotations" },
    { label: "POs Created", value: String(purchaseOrders.length), trend: "up" as const, trendText: "+4 this month", color: "text-blue-600", bg: "bg-blue-50", href: "/procurement/purchase-orders" },
    { label: "Vendor Response Rate", value: "86%", trend: "up" as const, trendText: "+5% improvement", color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Avg. Procurement Time", value: "12 days", trend: "down" as const, trendText: "-3 days faster", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Invoices Pending", value: String(invoices.filter((i) => i.status === "pending").length), trend: "up" as const, trendText: "Requires action", color: "text-amber-600", bg: "bg-amber-50", href: "/procurement/invoices" },
  ],
  rfqTrends: [
    { month: "Jan", open: 5, closed: 3, draft: 2 },
    { month: "Feb", open: 4, closed: 5, draft: 1 },
    { month: "Mar", open: 6, closed: 3, draft: 3 },
    { month: "Apr", open: 3, closed: 6, draft: 1 },
    { month: "May", open: 5, closed: 4, draft: 2 },
    { month: "Jun", open: 4, closed: 5, draft: 1 },
  ],
  quotationComparison: [
    { label: "Acme Industrial", value: 48200, color: "#4f46e5" },
    { label: "Pacific Logistics", value: 22400, color: "#f97316" },
    { label: "GreenTech", value: 35600, color: "#eab308" },
    { label: "Summit Office", value: 3200, color: "#22c55e" },
    { label: "Nova Packaging", value: 18700, color: "#ef4444" },
  ],
  poTrends: [
    { month: "Jan", draft: 3, pending: 4, approved: 5 },
    { month: "Feb", draft: 2, pending: 3, approved: 7 },
    { month: "Mar", draft: 4, pending: 5, approved: 4 },
    { month: "Apr", draft: 1, pending: 3, approved: 8 },
    { month: "May", draft: 3, pending: 4, approved: 6 },
    { month: "Jun", draft: 2, pending: 2, approved: 9 },
  ],
};

export const vendorAnalyticsData = {
  kpis: [
    { label: "Open RFQs", value: String(rfqs.filter((r) => r.status === "open").length), trend: "up" as const, trendText: "New opportunities", color: "text-indigo-600", bg: "bg-indigo-50", href: "/vendor/rfqs" },
    { label: "Submitted Quotations", value: "8", trend: "up" as const, trendText: "+3 this month", color: "text-emerald-600", bg: "bg-emerald-50", href: "/vendor/submit-quotation" },
    { label: "Won Contracts", value: "3", trend: "up" as const, trendText: "42% success rate", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Revenue Earned", value: "$445,000", trend: "up" as const, trendText: "+18% YTD", color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Pending Invoices", value: String(invoices.filter((i) => i.status === "pending").length), trend: "down" as const, trendText: "Awaiting payment", color: "text-amber-600", bg: "bg-amber-50", href: "/vendor/purchase-orders" },
    { label: "Performance Rating", value: "4.8/5", trend: "up" as const, trendText: "Top performer", color: "text-emerald-600", bg: "bg-emerald-50" },
  ],
  revenueTrend: [
    { month: "Jan", revenue: 55000, target: 50000 },
    { month: "Feb", revenue: 62000, target: 55000 },
    { month: "Mar", revenue: 48000, target: 55000 },
    { month: "Apr", revenue: 72000, target: 60000 },
    { month: "May", revenue: 68000, target: 65000 },
    { month: "Jun", revenue: 85000, target: 70000 },
  ],
  quotationSuccess: [
    { label: "Won", value: 8, color: "#22c55e" },
    { label: "Lost", value: 6, color: "#ef4444" },
    { label: "Pending", value: 5, color: "#eab308" },
  ],
  contractValue: [
    { label: "Q1", value: 120000, color: "#4f46e5" },
    { label: "Q2", value: 180000, color: "#f97316" },
    { label: "Q3", value: 95000, color: "#22c55e" },
    { label: "Q4", value: 150000, color: "#eab308" },
  ],
  paymentStatus: [
    { label: "Paid", value: 3, color: "#22c55e" },
    { label: "Pending", value: 2, color: "#eab308" },
    { label: "Overdue", value: 0, color: "#ef4444" },
  ],
};
