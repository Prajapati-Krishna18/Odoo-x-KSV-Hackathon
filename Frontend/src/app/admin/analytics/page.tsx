"use client";

import { useState } from "react";
import { Download, Filter, TrendingUp, Building2, Users, FileQuestion, CheckSquare, ShoppingCart, DollarSign, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { adminAnalytics } from "@/lib/analytics-data";
import { KPICard, PieChart, LineChartSimple, HorizontalBarChart, AreaChartSimple } from "@/components/analytics/charts";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp, Building2, Users, FileQuestion, CheckSquare, ShoppingCart, DollarSign, Shield,
};

export default function Page() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const d = adminAnalytics;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Executive procurement intelligence dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Export PDF</Button>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Export Excel</Button>
          </div>
        }
      />

      {showFilters && (
        <Card>
          <CardBody>
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date Range</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {dateRange === "custom" && (
                <>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">From</label><input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
                  <div><label className="block text-xs font-medium text-slate-500 mb-1">To</label><input type="date" className="rounded-lg border border-slate-300 px-3 py-2 text-sm" /></div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All Departments</option>
                  <option>Finance</option>
                  <option>Operations</option>
                  <option>Manufacturing</option>
                  <option>Procurement</option>
                  <option>IT</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {d.kpis.slice(0, 8).map((kpi) => (
          <KPICard key={kpi.label} {...kpi} icon={iconMap[kpi.label === "Total Spend" ? "DollarSign" : kpi.label === "Total Vendors" ? "Building2" : kpi.label === "Total Users" ? "Users" : kpi.label === "Open RFQs" ? "FileQuestion" : kpi.label === "Pending Approvals" ? "CheckSquare" : kpi.label === "Active POs" ? "ShoppingCart" : kpi.label === "Monthly Savings" ? "TrendingUp" : "Shield"]} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Vendor Spend Distribution" />
          <CardBody>
            <PieChart segments={d.vendorSpend.map((v) => ({ label: v.label, value: v.value, color: v.color }))} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Monthly Spend Trend" />
          <CardBody>
            <LineChartSimple data={d.monthlySpend} lines={[{ key: "spend", label: "Actual Spend", color: "#4f46e5" }, { key: "target", label: "Target", color: "#22c55e" }]} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Department Spending" />
          <CardBody>
            <HorizontalBarChart bars={d.deptSpend} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Approval Performance" />
          <CardBody>
            <AreaChartSimple data={d.approvalPerf} lines={[{ key: "approved", label: "Approved", color: "#22c55e" }, { key: "rejected", label: "Rejected", color: "#ef4444" }]} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Top Vendors by Spend" />
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Total Spend</th>
                  <th className="px-6 py-3">Performance</th>
                  <th className="px-6 py-3">Risk Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {d.topVendors.map((v) => (
                  <tr key={v.name} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">{v.name}</td>
                    <td className="px-6 py-4">{formatCurrency(v.spend)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${v.performance}%`, backgroundColor: v.performance >= 80 ? "#22c55e" : v.performance >= 60 ? "#f97316" : "#ef4444" }} />
                        </div>
                        <span className="text-xs">{v.performance}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.risk === "Low" ? "bg-emerald-50 text-emerald-700" : v.risk === "Medium" ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"}`}>{v.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Activities" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {d.recentActivities.map((a, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50">
                  <div className={`h-2 w-2 rounded-full ${a.action === "User Added" ? "bg-blue-500" : a.action === "Vendor Approved" ? "bg-emerald-500" : a.action === "PO Generated" ? "bg-indigo-500" : "bg-amber-500"}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{a.action}</p>
                    <p className="text-xs text-slate-500">{a.detail}</p>
                  </div>
                  <span className="text-xs text-slate-400">{a.time}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
