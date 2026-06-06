"use client";

import { useState, useMemo } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, Shield,
  Truck, Search, Filter, Download,
  ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  riskVendors, getOverallRiskScore, getHighRiskCount,
  getMediumRiskCount, getLowRiskCount, riskTrendData,
  riskCategories, overdueAging, aiInsights, aiRecommendations,
  getComplianceHeatmap, getTotalOverdueAmount,
  type RiskVendor,
} from "@/lib/risk-store";
import { DonutChart, LineChart, BarChart } from "@/components/risk/charts";
import { VendorRiskDetail } from "@/components/risk/vendor-detail";

type StatusFilter = "all" | "high" | "medium" | "low";
type DateFilter = "all" | "today" | "week" | "month" | "custom";

export default function Page() {
  const [selectedVendor, setSelectedVendor] = useState<RiskVendor | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [search, setSearch] = useState("");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => [...new Set(riskVendors.map((v) => v.category))].sort(), []);
  const complianceData = useMemo(() => getComplianceHeatmap(), []);
  const totalOverdue = getTotalOverdueAmount();

  const filteredVendors = useMemo(() => {
    let list = [...riskVendors];
    if (statusFilter !== "all") list = list.filter((v) => v.riskLevel === statusFilter);
    if (categoryFilter !== "all") list = list.filter((v) => v.category === categoryFilter);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((v) => v.name.toLowerCase().includes(q));
    }
    return list;
  }, [statusFilter, categoryFilter, search]);

  const riskScore = getOverallRiskScore();
  const highCount = getHighRiskCount();
  const mediumCount = getMediumRiskCount();
  const lowCount = getLowRiskCount();

  const kpiCards = [
    {
      label: "Overall Risk Score",
      value: `${riskScore}%`,
      trend: "down",
      trendText: "Improved by 7%",
      color: riskScore <= 35 ? "text-emerald-600" : riskScore <= 55 ? "text-amber-600" : "text-red-600",
      bg: riskScore <= 35 ? "bg-emerald-50" : riskScore <= 55 ? "bg-amber-50" : "bg-red-50",
      icon: Shield,
    },
    {
      label: "High Risk Vendors",
      value: String(highCount),
      trend: "up",
      trendText: "Needs attention",
      color: "text-red-600",
      bg: "bg-red-50",
      icon: AlertTriangle,
    },
    {
      label: "Medium Risk Vendors",
      value: String(mediumCount),
      trend: "stable",
      trendText: "Monitor closely",
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: TrendingUp,
    },
    {
      label: "Low Risk Vendors",
      value: String(lowCount),
      trend: "up",
      trendText: "Improved by 12%",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: TrendingDown,
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Risk Center"
        description="Executive risk intelligence dashboard"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        }
      />

      {showFilters && (
        <Card>
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Risk Status</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All Categories</option>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date Range</label>
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value as DateFilter)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {dateFilter === "custom" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                    <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
                    <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Vendor name..." value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{kpi.label}</p>
                  <p className={`mt-2 text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
                <div className={`rounded-lg ${kpi.bg} p-2.5 ${kpi.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {kpi.trend === "up" && <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />}
                {kpi.trend === "down" && <ArrowDownRight className="h-3.5 w-3.5 text-emerald-500" />}
                {kpi.trend === "stable" && <Minus className="h-3.5 w-3.5 text-amber-500" />}
                <span className={
                  kpi.trend === "up" ? "text-red-600" :
                  kpi.trend === "down" ? "text-emerald-600" :
                  "text-amber-600"
                }>{kpi.trendText}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Vendor Risk Distribution" />
          <CardBody>
            <DonutChart
              segments={[
                { label: "High Risk", value: highCount, color: "#ef4444" },
                { label: "Medium Risk", value: mediumCount, color: "#f97316" },
                { label: "Low Risk", value: lowCount, color: "#22c55e" },
              ]}
            />
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{riskVendors.length}</p>
              <p className="text-xs text-slate-500">Total Vendors Monitored</p>
            </div>
          </CardBody>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="AI Risk Intelligence" action={
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">AI Powered</span>
            } />
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Insights</h4>
                  <div className="space-y-2">
                    {aiInsights.map((insight, i) => (
                      <div key={i} className={`flex items-start gap-2.5 rounded-lg p-2.5 text-sm ${insight.type === "warning" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"}`}>
                        <span className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 ${insight.type === "warning" ? "bg-amber-500" : "bg-emerald-500"}`} />
                        {insight.message}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Recommended Actions</h4>
                  <div className="space-y-2">
                    {aiRecommendations.map((rec, i) => (
                      <div key={i} className={`rounded-lg border p-2.5 ${rec.priority === "high" ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}>
                        <p className="text-sm font-medium text-slate-900">{rec.action}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader title="Procurement Risk Trend" description="6-month risk score, compliance, and financial risk tracking" />
        <CardBody>
          <LineChart
            data={riskTrendData}
            lines={[
              { key: "riskScore", label: "Risk Score", color: "#ef4444" },
              { key: "complianceScore", label: "Compliance Score", color: "#4f46e5" },
              { key: "financialRisk", label: "Financial Risk", color: "#f97316" },
            ]}
          />
        </CardBody>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Risk Category Breakdown" />
          <CardBody>
            <BarChart bars={riskCategories.map((c) => ({ label: c.name, value: c.percentage, color: c.color }))} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Vendor Compliance Monitoring" />
          <CardBody>
            <div className="space-y-4">
              {complianceData.map((v, i) => {
                const color = v.score >= 85 ? "#22c55e" : v.score >= 70 ? "#f97316" : "#ef4444";
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-36 shrink-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{v.name}</p>
                    </div>
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${v.score}%`, backgroundColor: color }}
                      />
                    </div>
                    <div className="w-12 text-right shrink-0">
                      <span className={`text-sm font-bold ${color === "#22c55e" ? "text-emerald-600" : color === "#f97316" ? "text-orange-600" : "text-red-600"}`}>
                        {v.score}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Overdue Invoice Analytics" />
          <CardBody>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-red-600">{formatCurrency(totalOverdue)}</p>
              <p className="text-xs text-slate-500">Total Overdue Amount</p>
            </div>
            <div className="space-y-3">
              {overdueAging.map((bucket) => (
                <div key={bucket.bucket}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{bucket.bucket}</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(bucket.amount)}</span>
                  </div>
                  <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${bucket.percentage}%`,
                        backgroundColor: bucket.bucket === "0-30 Days" ? "#22c55e" :
                          bucket.bucket === "31-60 Days" ? "#f97316" :
                          bucket.bucket === "61-90 Days" ? "#ef4444" : "#dc2626"
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Executive Summary" />
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {[
                { label: "Network Health", value: "+7%", desc: "Improved this month", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Compliance", value: "-12%", desc: "Violations reduced", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Financial Exposure", value: `-${formatCurrency(42000)}`, desc: "Decreased", color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl ${s.bg} p-4`}>
                  <p className="text-xs text-slate-500">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-800">Recommended Focus Area</span>
              </div>
              <p className="text-sm text-amber-700">Delivery Risk Management — 82% of vendors show delivery-related risk factors. Review logistics partners and adjust SLAs.</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="At-Risk Vendors"
          description={`${filteredVendors.length} vendors monitored`}
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{filteredVendors.filter(v => v.riskLevel === "high").length} high risk</span>
            </div>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Risk Score</th>
                  <th className="px-6 py-3">Compliance</th>
                  <th className="px-6 py-3">Financial Health</th>
                  <th className="px-6 py-3">Delivery</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVendors.map((v) => {
                  const riskColor = v.riskLevel === "high" ? "text-red-600 bg-red-50" :
                    v.riskLevel === "medium" ? "text-orange-600 bg-orange-50" : "text-emerald-600 bg-emerald-50";

                  return (
                    <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                            {v.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{v.name}</p>
                            <p className="text-xs text-slate-500">{v.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${v.riskScore}%`, backgroundColor: v.riskLevel === "high" ? "#ef4444" : v.riskLevel === "medium" ? "#f97316" : "#22c55e" }}
                            />
                          </div>
                          <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${riskColor}`}>
                            {v.riskScore}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${v.complianceScore}%`, backgroundColor: v.complianceScore >= 80 ? "#22c55e" : v.complianceScore >= 70 ? "#f97316" : "#ef4444" }} />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{v.complianceScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${v.financialHealth >= 80 ? "text-emerald-600" : v.financialHealth >= 60 ? "text-amber-600" : "text-red-600"}`}>
                          {v.financialHealth}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Truck className="h-3.5 w-3.5 text-slate-400" />
                          <span className={`text-sm font-medium ${v.deliveryRating >= 80 ? "text-emerald-600" : v.deliveryRating >= 60 ? "text-amber-600" : "text-red-600"}`}>
                            {v.deliveryRating}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSelectedVendor(v)}
                            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            View Details
                          </button>
                          <button className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                            Review
                          </button>
                            <button className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                            Suspend RFQ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {selectedVendor && (
        <VendorRiskDetail
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
        />
      )}
    </div>
  );
}
