import {
  DollarSign, ShoppingCart, Building2, TrendingDown, TrendingUp, Clock, Package, Truck,
  Sparkles, FileQuestion, AlertTriangle, CheckSquare, ThumbsUp, ShieldAlert, Receipt,
  FileText, Award, User, Send, FileSignature,
} from "lucide-react";
import type { ElementType } from "react";
import { useStore } from "@/lib/global-store";
import { contracts, products } from "@/lib/data";

const now = new Date();
const hr = now.getHours();
export const greeting = hr < 12 ? "Good Morning" : hr < 17 ? "Good Afternoon" : "Good Evening";

export interface KpiData {
  label: string; value: string; trend: string; trendUp: boolean;
  color: string; bg: string; icon: ElementType; sparkline: number[];
}

export interface IntelData {
  label: string; value: string; icon: ElementType; color: string; bg: string; detail: string; href: string;
}

export function useAdminDashboard() {
  const vendors = useStore((s) => s.vendors);
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const invoices = useStore((s) => s.invoices);
  const notifications = useStore((s) => s.notifications);
  const activities = useStore((s) => s.activities);

  const pendingApprovals = purchaseOrders.filter((p) => p.status === "pending").length;
  const activeVendors = vendors.filter((v) => v.status === "active").length;
  const totalSpend = vendors.reduce((sum, v) => sum + v.spendYtd, 0);
  const totalPOs = purchaseOrders.length;

  const spendStr = totalSpend >= 100000 ? `₹${Math.round(totalSpend / 100000 * 10) / 10}L` : `₹${Math.round(totalSpend / 1000)}K`;

  return {
    userName: "Dev",
    kpis: [
      { label: "Total Spend", value: spendStr, trend: "+12%", trendUp: true, color: "text-indigo-600", bg: "bg-indigo-50", icon: DollarSign, sparkline: [2000, 3500, 3000, 4800, 5200, 6100, 5800, 7200, 8000, 7800, 9500, Math.round(totalSpend / 100)] },
      { label: "Purchase Orders", value: String(totalPOs), trend: "+8%", trendUp: true, color: "text-blue-600", bg: "bg-blue-50", icon: ShoppingCart, sparkline: [80, 95, 88, 102, 110, 98, 115, 120, 108, 125, 130, Math.round(totalPOs * 100 / 1284)] },
      { label: "Active Vendors", value: String(activeVendors), trend: "+15%", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50", icon: Building2, sparkline: [40, 45, 42, 48, 55, 52, 58, 62, 60, 68, 72, activeVendors] },
      { label: "Cost Savings", value: "₹2.1L", trend: "+18%", trendUp: true, color: "text-cyan-600", bg: "bg-cyan-50", icon: TrendingDown, sparkline: [1200, 1500, 1400, 1700, 1900, 1800, 2000, 2100, 2050, 2200, 2400, 3000] },
    ] as KpiData[],
    spendTrend: [
      { month: "Jan", spend: 110000, target: 120000 },
      { month: "Feb", spend: 105000, target: 115000 },
      { month: "Mar", spend: 128000, target: 125000 },
      { month: "Apr", spend: 118000, target: 120000 },
      { month: "May", spend: 135000, target: 130000 },
      { month: "Jun", spend: Math.round(totalSpend * 0.15), target: 135000 },
    ],
    procurementIntel: [
      { label: "Pending Approvals", value: String(pendingApprovals), icon: Clock, color: "text-amber-600", bg: "bg-amber-50", detail: "Needs review", href: "/admin/approvals" },
      { label: "Low Stock Alerts", value: "8", icon: Package, color: "text-red-600", bg: "bg-red-50", detail: "Critical items", href: "/catalog" },
      { label: "Delayed Deliveries", value: String(purchaseOrders.filter((p) => p.dueDate < now.toISOString().split("T")[0] && p.status !== "rejected").length), icon: Truck, color: "text-orange-600", bg: "bg-orange-50", detail: "Past due", href: "/purchase-orders" },
      { label: "Notifications", value: String(notifications.filter((n) => !n.read).length), icon: Sparkles, color: "text-purple-600", bg: "bg-purple-50", detail: "Unread alerts", href: "/notifications" },
    ] as IntelData[],
    activityFeed: (() => {
      const recent = activities.slice(0, 5);
      if (recent.length === 0) return [
        { action: "RFQ Created", detail: "Q3 Steel Sheet Procurement", time: "2 min ago", type: "create" as const },
        { action: "Vendor Invited", detail: "Pacific Logistics Co. invited to bid", time: "1h ago", type: "invite" as const },
      ];
      return recent.map((a) => ({
        action: a.action.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        detail: `${a.entityName} · ${a.entityType.toUpperCase()}`,
        time: formatRelativeTime(a.timestamp),
        type: a.action === "approved" ? "approve" as const : a.action === "invoice_paid" ? "payment" as const : a.action === "vendor_onboarded" || a.action === "vendor_invited" ? "invite" as const : "create" as const,
      }));
    })(),
    topVendors: vendors.map((v) => ({
      name: v.name, category: v.category, orders: v.contracts, spend: v.spendYtd,
      performance: v.complianceScore, status: v.status as string,
    })).sort((a, b) => b.spend - a.spend).slice(0, 5),
    vendorPerformance: vendors.map((v) => ({
      label: v.name.split(" ").slice(0, 2).join(" "), value: v.complianceScore, color: v.complianceScore >= 90 ? "#10b981" : v.complianceScore >= 75 ? "#f59e0b" : "#ef4444",
    })).sort((a, b) => b.value - a.value),
    aiInsights: [
      { type: "warning" as const, message: `Spend anomaly detected — ${vendors.length} vendors active` },
      { type: "warning" as const, message: `${pendingApprovals} pending approvals require attention` },
      { type: "positive" as const, message: `Vendor network expanded to ${activeVendors} active partners` },
      { type: "positive" as const, message: "Savings opportunity: Consolidate office supply vendors" },
    ],
    pendingApprovals,
  };
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function useManagerDashboard() {
  const vendors = useStore((s) => s.vendors);
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const invoices = useStore((s) => s.invoices);

  const pendingApprovals = purchaseOrders.filter((p) => p.status === "pending").length;
  const highValuePOs = purchaseOrders.filter((p) => p.amount > 20000 && p.status === "pending").length;
  const approvedThisMonth = purchaseOrders.filter((p) => p.status === "approved").length;
  const atRiskVendors = vendors.filter((v) => v.complianceScore < 75).length;

  return {
    userName: "Jordan",
    kpis: [
      { label: "Pending Approvals", value: String(pendingApprovals), trend: "+3", trendUp: true, color: "text-amber-600", bg: "bg-amber-50", icon: CheckSquare, sparkline: [5, 8, 6, 10, 7, 9, 5, 8, 11, 6, 9, pendingApprovals] },
      { label: "High Value POs", value: String(highValuePOs), trend: "+2", trendUp: true, color: "text-red-600", bg: "bg-red-50", icon: AlertTriangle, sparkline: [1, 3, 2, 4, 1, 3, 2, 5, 2, 3, 4, highValuePOs] },
      { label: "Approved This Month", value: String(approvedThisMonth), trend: "+25%", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50", icon: ThumbsUp, sparkline: [3, 5, 4, 7, 6, 5, 8, 7, 9, 6, 10, approvedThisMonth] },
      { label: "At-Risk Vendors", value: String(atRiskVendors), trend: "-1", trendUp: false, color: "text-red-600", bg: "bg-red-50", icon: ShieldAlert, sparkline: [4, 4, 3, 5, 3, 4, 3, 2, 3, 2, 2, atRiskVendors] },
    ] as KpiData[],
    approvalTrend: [
      { month: "Jan", approved: 12, rejected: 3 },
      { month: "Feb", approved: 15, rejected: 2 },
      { month: "Mar", approved: 10, rejected: 4 },
      { month: "Apr", approved: 18, rejected: 1 },
      { month: "May", approved: 14, rejected: 3 },
      { month: "Jun", approved: Math.max(approvedThisMonth, 1), rejected: atRiskVendors },
    ],
    pendingApprovalsTable: purchaseOrders.filter((p) => p.status === "pending"),
    procurementIntel: [
      { label: "Pending Approvals", value: String(pendingApprovals), icon: Clock, color: "text-amber-600", bg: "bg-amber-50", detail: "Needs your review", href: "/manager/approvals" },
      { label: "Overdue Invoices", value: String(invoices.filter((i) => i.status === "overdue").length), icon: Receipt, color: "text-red-600", bg: "bg-red-50", detail: "Past due date", href: "/invoices" },
      { label: "Risk Warnings", value: String(atRiskVendors), icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50", detail: "Needs attention", href: "/manager/risk-center" },
      { label: "Contracts Expiring", value: String(contracts.filter((c) => c.status === "expired" || c.status === "review").length), icon: FileSignature, color: "text-purple-600", bg: "bg-purple-50", detail: "Within 30 days", href: "/contracts" },
    ] as IntelData[],
    aiInsights: [
      { type: "warning" as const, message: `${pendingApprovals} PO${pendingApprovals !== 1 ? 's' : ''} awaiting your decision` },
      { type: "warning" as const, message: `${atRiskVendors} vendor${atRiskVendors !== 1 ? 's' : ''} below compliance threshold` },
      { type: "positive" as const, message: `${approvedThisMonth} PO${approvedThisMonth !== 1 ? 's' : ''} approved this period` },
      { type: "positive" as const, message: "Atlas Safety Gear price reduction of 8% available" },
    ],
    vendorPerformance: vendors.map((v) => ({
      label: v.name.split(" ").slice(0, 2).join(" "), value: v.complianceScore, color: v.complianceScore >= 90 ? "#10b981" : v.complianceScore >= 75 ? "#f59e0b" : "#ef4444",
    })).sort((a, b) => b.value - a.value),
  };
}

export function useProcurementDashboard() {
  const vendors = useStore((s) => s.vendors);
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const invoices = useStore((s) => s.invoices);
  const rfqs = useStore((s) => s.rfqs);

  const activeRfqs = rfqs.filter((r) => r.status === "open").length;
  const openPOs = purchaseOrders.filter((p) => p.status === "approved" || p.status === "pending").length;
  const pendingInvoices = invoices.filter((i) => i.status === "pending" || i.status === "overdue").length;

  return {
    userName: "Sam",
    kpis: [
      { label: "Active RFQs", value: String(activeRfqs), trend: "+2", trendUp: true, color: "text-indigo-600", bg: "bg-indigo-50", icon: FileQuestion, sparkline: [3, 5, 4, 7, 5, 8, 6, 9, 7, 10, 8, activeRfqs] },
      { label: "Vendor Network", value: String(vendors.length), trend: "+1", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50", icon: Building2, sparkline: [30, 35, 33, 38, 40, 42, 41, 45, 48, 50, 52, vendors.length] },
      { label: "Open POs", value: String(openPOs), trend: "+4", trendUp: true, color: "text-blue-600", bg: "bg-blue-50", icon: ShoppingCart, sparkline: [2, 4, 3, 5, 6, 4, 7, 5, 8, 6, 9, openPOs] },
      { label: "Pending Invoices", value: String(pendingInvoices), trend: "-2", trendUp: false, color: "text-amber-600", bg: "bg-amber-50", icon: Receipt, sparkline: [6, 5, 7, 4, 6, 5, 4, 3, 5, 4, 3, pendingInvoices] },
    ] as KpiData[],
    rfqTrend: [
      { month: "Jan", rfqs: 5, responses: 12 },
      { month: "Feb", rfqs: 7, responses: 18 },
      { month: "Mar", rfqs: 4, responses: 10 },
      { month: "Apr", rfqs: 8, responses: 22 },
      { month: "May", rfqs: 6, responses: 15 },
      { month: "Jun", rfqs: activeRfqs, responses: Math.max(activeRfqs * 2, 5) },
    ],
    openRfqs: rfqs.filter((r) => r.status === "open"),
    activeRfqList: rfqs.filter((r) => r.status !== "closed").map((r) => ({
      id: r.id, title: r.title, status: r.status, deadline: r.deadline, budget: r.budget, responses: r.responses,
    })),
    procurementIntel: [
      { label: "Active RFQs", value: String(activeRfqs), icon: FileQuestion, color: "text-indigo-600", bg: "bg-indigo-50", detail: "Awaiting responses", href: "/procurement/rfqs" },
      { label: "Open POs", value: String(openPOs), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50", detail: "In progress", href: "/procurement/purchase-orders" },
      { label: "Stock Alerts", value: String(products.filter((p) => !p.inStock).length), icon: Package, color: "text-red-600", bg: "bg-red-50", detail: "Out of stock", href: "/catalog" },
      { label: "Contracts Active", value: String(contracts.filter((c) => c.status === "active").length), icon: FileSignature, color: "text-emerald-600", bg: "bg-emerald-50", detail: "In effect", href: "/contracts" },
    ] as IntelData[],
    vendorPerformance: vendors.map((v) => ({
      label: v.name.split(" ").slice(0, 2).join(" "), value: v.complianceScore, color: v.complianceScore >= 90 ? "#10b981" : v.complianceScore >= 75 ? "#f59e0b" : "#ef4444",
    })).sort((a, b) => b.value - a.value),
    aiInsights: [
      { type: "positive" as const, message: "Optimal RFQ timing: Wednesday AM yields 40% more responses" },
      { type: "warning" as const, message: `${activeRfqs} RFQ${activeRfqs !== 1 ? 's' : ''} active — review pending quotations` },
      { type: "positive" as const, message: `Network of ${vendors.length} vendors available` },
      { type: "warning" as const, message: "GreenTech component lead time extended to 21 days" },
    ],
  };
}

export function useVendorDashboard() {
  const vendors = useStore((s) => s.vendors);
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const rfqs = useStore((s) => s.rfqs);
  const contractsList = contracts;

  const openRfqs = rfqs.filter((r) => r.status === "open").length;
  const activeContracts = contractsList.filter((c) => c.status === "active").length;
  const myPOs = purchaseOrders.filter((p) => p.vendorId === "v1");

  return {
    userName: "Elena",
    kpis: [
      { label: "Open RFQs", value: String(openRfqs), trend: "+3", trendUp: true, color: "text-indigo-600", bg: "bg-indigo-50", icon: FileQuestion, sparkline: [2, 4, 3, 5, 4, 6, 5, 7, 6, 8, 7, openRfqs] },
      { label: "Submitted Quotes", value: "3", trend: "+1", trendUp: true, color: "text-blue-600", bg: "bg-blue-50", icon: Send, sparkline: [1, 1, 2, 1, 3, 2, 2, 3, 2, 4, 3, 3] },
      { label: "Awarded Contracts", value: String(activeContracts), trend: "0", trendUp: true, color: "text-emerald-600", bg: "bg-emerald-50", icon: Award, sparkline: [1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, activeContracts] },
      { label: "Active POs", value: String(myPOs.length), trend: "+22%", trendUp: true, color: "text-cyan-600", bg: "bg-cyan-50", icon: TrendingUp, sparkline: [4500, 5200, 4800, 6100, 5800, 6500, 7200, 7000, 7800, 8200, 8000, myPOs.length * 1000] },
    ] as KpiData[],
    revenueTrend: [
      { month: "Jan", revenue: 45000, quotes: 2 },
      { month: "Feb", revenue: 52000, quotes: 3 },
      { month: "Mar", revenue: 48000, quotes: 2 },
      { month: "Apr", revenue: 61000, quotes: 4 },
      { month: "May", revenue: 72000, quotes: 3 },
      { month: "Jun", revenue: myPOs.reduce((s, p) => s + p.amount, 0) || 82000, quotes: 5 },
    ],
    openRfqs: rfqs.filter((r) => r.status === "open").slice(0, 3),
    myPOs: myPOs.slice(0, 3),
    procurementIntel: [
      { label: "Open RFQs", value: String(openRfqs), icon: FileQuestion, color: "text-indigo-600", bg: "bg-indigo-50", detail: "Browse opportunities", href: "/vendor/rfqs" },
      { label: "My Quotations", value: "3", icon: FileText, color: "text-blue-600", bg: "bg-blue-50", detail: "Submitted", href: "/vendor/submit-quotation" },
      { label: "Active POs", value: String(myPOs.filter((p) => p.status !== "rejected").length), icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50", detail: "In progress", href: "/vendor/purchase-orders" },
      { label: "My Profile", value: "92%", icon: User, color: "text-purple-600", bg: "bg-purple-50", detail: "Completion", href: "/vendor/profile" },
    ] as IntelData[],
    aiInsights: [
      { type: "positive" as const, message: "Your win rate is 67% — top quartile among vendors" },
      { type: "warning" as const, message: `${openRfqs} open RFQ${openRfqs !== 1 ? 's' : ''} available — submit bids early` },
      { type: "positive" as const, message: "Atlas Safety Gear endorsement boosts your profile score" },
      { type: "warning" as const, message: "Contract renewal: Freight SLA expires June 30" },
    ],
  };
}
