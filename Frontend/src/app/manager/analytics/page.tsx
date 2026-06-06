"use client";

import { useState } from "react";
import { Download, Filter, CheckSquare, History, AlertTriangle, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { managerAnalytics } from "@/lib/analytics-data";
import { KPICard, LineChartSimple, PieChart, HorizontalBarChart } from "@/components/analytics/charts";

const iconMap: Record<string, React.ElementType> = {
  CheckSquare, History, AlertTriangle, DollarSign, ShoppingCart, TrendingUp,
};

export default function Page() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const d = managerAnalytics;

  const statusDist = [
    { label: "Approved", value: d.kpis[1] ? Number(d.kpis[1].value) : 0, color: "#22c55e" },
    { label: "Pending", value: d.kpis[0] ? Number(d.kpis[0].value) : 0, color: "#eab308" },
    { label: "Rejected", value: d.kpis[2] ? Number(d.kpis[2].value) : 0, color: "#ef4444" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Manager approval and risk intelligence"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Export PDF</Button>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Print Report</Button>
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
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All</option>
                  <option>Finance</option>
                  <option>Operations</option>
                  <option>Manufacturing</option>
                  <option>R&D</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.kpis.slice(0, 6).map((kpi) => (
          <KPICard key={kpi.label} {...kpi} icon={iconMap[kpi.label === "Pending Approvals" ? "CheckSquare" : kpi.label === "Approved Requests" ? "History" : kpi.label === "Rejected Requests" ? "AlertTriangle" : kpi.label === "Dept. Spend" ? "DollarSign" : kpi.label === "Risk Alerts" ? "TrendingUp" : "ShoppingCart"]} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Approval Trends" />
          <CardBody>
            <LineChartSimple data={d.approvalTrends} lines={[{ key: "approved", label: "Approved", color: "#22c55e" }, { key: "pending", label: "Pending", color: "#eab308" }, { key: "rejected", label: "Rejected", color: "#ef4444" }]} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Approval Status Distribution" />
          <CardBody>
            <PieChart segments={statusDist} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Department Spend" />
          <CardBody>
            <HorizontalBarChart bars={d.deptSpend} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Risk Analysis" />
          <CardBody>
            <div className="space-y-4">
              {d.riskAnalysis.map((r) => (
                <div key={r.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{r.category}</span>
                    <span className="font-semibold text-slate-900">{r.score}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.score}%`, backgroundColor: r.color }} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="AI Intelligence Insights" action={
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">AI Powered</span>
        } />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            {d.insights.map((insight, i) => (
              <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${insight.type === "warning" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
                <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${insight.type === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                <div>
                  <p className="text-sm font-medium text-slate-900">{insight.type === "warning" ? "Action Required" : "Information"}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
