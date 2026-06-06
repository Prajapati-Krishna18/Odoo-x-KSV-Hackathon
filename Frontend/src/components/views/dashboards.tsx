"use client";

import Link from "next/link";
import {
  DollarSign, ShoppingCart, Building2, TrendingDown, TrendingUp, Clock, Package, Truck,
  Sparkles, FileQuestion, AlertTriangle, CheckSquare, ThumbsUp, ShieldAlert, Receipt,
  FileText, Award, User, Send, Plus, ChevronRight, Search, ArrowUpRight, ArrowDownRight,
  CheckCircle2, XCircle, ExternalLink, FileSignature,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAdminDashboard, useManagerDashboard, useProcurementDashboard, useVendorDashboard, greeting } from "@/components/dashboard/data";
import { Sparkline, LineChart, BarChart, PieChart } from "@/components/dashboard/charts";
import { useState } from "react";

function KpiCard({ icon: Icon, label, value, trend, trendUp, bg, color, sparkline }: {
  icon: React.ElementType; label: string; value: string; trend: string; trendUp: boolean;
  bg: string; color: string; sparkline: number[];
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`text-3xl font-bold tracking-tight ${color}`}>{value}</p>
          <div className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
            {trendUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            <span>{trend} vs last month</span>
          </div>
        </div>
        <div className={`rounded-xl ${bg} p-3 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-3">
        <Sparkline data={sparkline} color={color.replace("text-", "#")} />
      </div>
    </div>
  );
}

function IntelCard({ icon: Icon, label, value, color, bg, detail, href }: {
  icon: React.ElementType; label: string; value: string; color: string; bg: string; detail: string; href: string;
}) {
  return (
    <Link href={href} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
      <div className={`rounded-lg ${bg} p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
    </Link>
  );
}

function AiInsightCard({ type, message }: { type: "warning" | "positive"; message: string }) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3.5 transition-all hover:shadow-sm ${
      type === "warning" ? "border-amber-200 bg-amber-50/50" : "border-emerald-200 bg-emerald-50/50"
    }`}>
      <div className={`mt-0.5 rounded-full p-1.5 ${type === "warning" ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`}>
        {type === "warning" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
      </div>
      <p className={`text-sm leading-snug ${type === "warning" ? "text-amber-800" : "text-emerald-800"}`}>{message}</p>
    </div>
  );
}

function ActivityItem({ action, detail, time, type }: { action: string; detail: string; time: string; type: string }) {
  const iconMap: Record<string, React.ElementType> = { create: FileQuestion, invite: Building2, approve: CheckCircle2, payment: Receipt };
  const Icon = iconMap[type] || Clock;
  const colorMap: Record<string, string> = { create: "text-indigo-600 bg-indigo-50", invite: "text-blue-600 bg-blue-50", approve: "text-emerald-600 bg-emerald-50", payment: "text-cyan-600 bg-cyan-50" };
  const colors = colorMap[type] || "text-slate-600 bg-slate-50";
  return (
    <div className="flex items-start gap-4 py-3 group">
      <div className={`rounded-lg p-2 ${colors} shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900">{action}</p>
        <p className="text-sm text-slate-500 truncate">{detail}</p>
      </div>
      <span className="text-xs text-slate-400 shrink-0 mt-0.5">{time}</span>
    </div>
  );
}

function TopVendorsTable({ data }: {
  data: { name: string; category: string; orders: number; spend: number; performance: number; status: string }[];
}) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("spend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const filtered = data.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));
  const sorted = [...filtered].sort((a, b) => {
    const av = sortKey === "name" ? a.name : sortKey === "spend" ? a.spend : sortKey === "performance" ? a.performance : a.name;
    const bv = sortKey === "name" ? b.name : sortKey === "spend" ? b.spend : sortKey === "performance" ? b.performance : b.name;
    if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  function cycleSort(key: string) {
    if (sortKey === key) { setSortDir((d) => d === "asc" ? "desc" : "asc"); }
    else { setSortKey(key); setSortDir("desc"); }
  }

  const exportCsv = () => {
    const rows = data.map((v) => `${v.name},${v.category},${v.orders},${v.spend},${v.performance},${v.status}`);
    const csv = "Vendor,Category,Orders,Spend,Performance,Status\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "vendors.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <button onClick={exportCsv} className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {(["name", "category", "orders", "spend", "performance", "status"] as const).map((k) => (
                <th key={k} className="px-6 py-3 text-left">
                  <button onClick={() => cycleSort(k)} className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-700">
                    {k === "spend" ? "Spend" : k === "performance" ? "Score" : k.charAt(0).toUpperCase() + k.slice(1)}
                    {sortKey === k && <span className="text-indigo-500">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((v) => (
              <tr key={v.name} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-3 font-medium text-slate-900">{v.name}</td>
                <td className="px-6 py-3 text-slate-500">{v.category}</td>
                <td className="px-6 py-3 text-slate-700">{v.orders}</td>
                <td className="px-6 py-3 font-semibold text-slate-900">{formatCurrency(v.spend)}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full rounded-full ${v.performance >= 90 ? "bg-emerald-500" : v.performance >= 75 ? "bg-amber-500" : "bg-red-500"}`}
                        style={{ width: `${v.performance}%` }} />
                    </div>
                    <span className={`text-xs font-medium ${v.performance >= 90 ? "text-emerald-600" : v.performance >= 75 ? "text-amber-600" : "text-red-600"}`}>
                      {v.performance}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-3"><StatusBadge status={v.status as any} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {action}
    </div>
  );
}

function CtaButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-500 hover:shadow-md active:scale-[0.97]">
      {children}
    </Link>
  );
}

function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors inline-flex items-center gap-1">
      {children} <ChevronRight className="h-3.5 w-3.5" />
    </Link>
  );
}

// ============= ADMIN DASHBOARD =============
export function AdminDashboard() {
  const d = useAdminDashboard();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title={`${greeting}, ${d.userName} 👋`} description="Here's what's happening across your procurement ecosystem today." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Procurement Spend Trend" action={<LinkButton href="/admin/analytics">View Analytics</LinkButton>} />
            </div>
            <CardBody className="pt-0">
              <LineChart data={d.spendTrend} lines={[{ key: "spend", label: "Spend", color: "#2563eb" }, { key: "target", label: "Target", color: "#94a3b8" }]} height={220} />
            </CardBody>
          </Card>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Recent Procurement Activity" />
            </div>
            <CardBody className="pt-0 divide-y divide-slate-100">
              {d.activityFeed.map((a) => <ActivityItem key={a.action + a.time} {...a} />)}
            </CardBody>
          </Card>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Top Vendors" action={<LinkButton href="/vendors">View All</LinkButton>} />
            </div>
            <CardBody className="pt-0">
              <TopVendorsTable data={d.topVendors} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Procurement Intelligence</h3>
            {d.procurementIntel.map((intel) => <IntelCard key={intel.label} {...intel} />)}
          </div>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Vendor Performance" />
            </div>
            <CardBody className="pt-0">
              <BarChart bars={d.vendorPerformance} />
            </CardBody>
          </Card>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/50 to-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {d.aiInsights.map((insight, i) => <AiInsightCard key={i} {...insight} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= MANAGER DASHBOARD =============
export function ManagerDashboard() {
  const d = useManagerDashboard();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title={`${greeting}, ${d.userName} 👋`} description="Your approval queue and risk overview for today." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Approval Trends" action={<LinkButton href="/manager/analytics">View Analytics</LinkButton>} />
            </div>
            <CardBody className="pt-0">
              <LineChart data={d.approvalTrend} lines={[
                { key: "approved", label: "Approved", color: "#10b981" },
                { key: "rejected", label: "Rejected", color: "#ef4444" },
              ]} height={220} />
            </CardBody>
          </Card>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Awaiting Your Approval</h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    {d.pendingApprovalsTable.length} pending
                  </span>
                  <LinkButton href="/manager/approvals">Review All</LinkButton>
                </div>
              </div>
            </div>
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["PO Number", "Vendor", "Amount", "Department", "Status"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {d.pendingApprovalsTable.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-indigo-600">{po.poNumber}</td>
                      <td className="px-6 py-3 text-slate-700">{po.vendorName}</td>
                      <td className="px-6 py-3 font-semibold text-slate-900">{formatCurrency(po.amount)}</td>
                      <td className="px-6 py-3 text-slate-500">{po.department}</td>
                      <td className="px-6 py-3"><StatusBadge status={po.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Procurement Intelligence</h3>
            {d.procurementIntel.map((intel) => <IntelCard key={intel.label} {...intel} />)}
          </div>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Vendor Performance" />
            </div>
            <CardBody className="pt-0">
              <BarChart bars={d.vendorPerformance} />
            </CardBody>
          </Card>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50/50 to-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {d.aiInsights.map((insight, i) => <AiInsightCard key={i} {...insight} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= PROCUREMENT DASHBOARD =============
export function ProcurementDashboard() {
  const d = useProcurementDashboard();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={`${greeting}, ${d.userName} 👋`}
        description="Your procurement pipeline and vendor activity at a glance."
        actions={<CtaButton href="/procurement/create-rfq"><Plus className="h-4 w-4" /> Create RFQ</CtaButton>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="RFQ & Response Activity" action={<LinkButton href="/procurement/analytics">View Analytics</LinkButton>} />
            </div>
            <CardBody className="pt-0">
              <LineChart data={d.rfqTrend} lines={[
                { key: "rfqs", label: "RFQs Issued", color: "#2563eb" },
                { key: "responses", label: "Responses", color: "#10b981" },
              ]} height={220} />
            </CardBody>
          </Card>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">Active RFQs</h3>
                <LinkButton href="/procurement/rfqs">View All</LinkButton>
              </div>
            </div>
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Title", "Status", "Deadline", "Budget", "Responses"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {d.activeRfqList.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3 font-medium text-indigo-600">{r.title}</td>
                      <td className="px-6 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-6 py-3 text-slate-500">{formatDate(r.deadline)}</td>
                      <td className="px-6 py-3 font-semibold text-slate-900">{formatCurrency(r.budget)}</td>
                      <td className="px-6 py-3 text-slate-700">{r.responses}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Procurement Intelligence</h3>
            {d.procurementIntel.map((intel) => <IntelCard key={intel.label} {...intel} />)}
          </div>
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Vendor Performance" />
            </div>
            <CardBody className="pt-0">
              <BarChart bars={d.vendorPerformance} />
            </CardBody>
          </Card>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-blue-50/50 to-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {d.aiInsights.map((insight, i) => <AiInsightCard key={i} {...insight} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= VENDOR DASHBOARD =============
export function VendorDashboard() {
  const d = useVendorDashboard();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader title={`${greeting}, ${d.userName} 👋`} description="Your business performance and opportunities at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.kpis.map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <div className="px-6 pt-5 pb-3">
              <SectionHeader title="Revenue Trend" action={<LinkButton href="/vendor/analytics">View Analytics</LinkButton>} />
            </div>
            <CardBody className="pt-0">
              <LineChart data={d.revenueTrend} lines={[
                { key: "revenue", label: "Revenue", color: "#2563eb" },
              ]} height={220} />
            </CardBody>
          </Card>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <div className="px-6 pt-5 pb-3">
                <SectionHeader title="Open RFQs" action={<LinkButton href="/vendor/rfqs">Browse</LinkButton>} />
              </div>
              <CardBody className="pt-0 space-y-3">
                {d.openRfqs.map((r) => (
                  <Link key={r.id} href={`/vendor/rfqs/${r.id}`} className="block rounded-lg border border-slate-100 p-3 transition-all hover:border-indigo-200 hover:shadow-sm">
                    <p className="text-sm font-medium text-indigo-600">{r.title}</p>
                    <p className="text-xs text-slate-500 mt-1">Due {formatDate(r.deadline)} · Budget {formatCurrency(r.budget)}</p>
                  </Link>
                ))}
              </CardBody>
            </Card>
            <Card>
              <div className="px-6 pt-5 pb-3">
                <SectionHeader title="Purchase Orders" action={<LinkButton href="/vendor/purchase-orders">View All</LinkButton>} />
              </div>
              <CardBody className="pt-0 space-y-3">
                {d.myPOs.map((po) => (
                  <Link key={po.id} href={`/vendor/purchase-orders/${po.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition-all hover:border-indigo-200 hover:shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">{po.poNumber}</p>
                      <p className="text-xs text-slate-500">{formatDate(po.createdAt)}</p>
                    </div>
                    <span className="font-semibold text-slate-900 text-sm">{formatCurrency(po.amount)}</span>
                  </Link>
                ))}
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Account Overview</h3>
            {d.procurementIntel.map((intel) => <IntelCard key={intel.label} {...intel} />)}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-bold text-white shadow-sm">
                {d.userName.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-slate-900">{d.userName} Rodriguez</p>
                <p className="text-sm text-slate-500">GreenTech Components</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Compliance", value: "72%", color: "text-amber-600" },
                { label: "Rating", value: "4.2/5", color: "text-emerald-600" },
                { label: "Contracts", value: "1", color: "text-blue-600" },
                { label: "Win Rate", value: "67%", color: "text-indigo-600" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50/50 to-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-slate-900">AI Insights</h3>
            </div>
            <div className="space-y-3">
              {d.aiInsights.map((insight, i) => <AiInsightCard key={i} {...insight} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
