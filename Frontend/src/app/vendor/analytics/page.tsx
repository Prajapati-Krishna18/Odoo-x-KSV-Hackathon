"use client";

import { useState } from "react";
import { Download, Filter, FileQuestion, FileText, ShoppingCart, TrendingUp, DollarSign, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { vendorAnalyticsData } from "@/lib/analytics-data";
import { KPICard, PieChart, LineChartSimple, HorizontalBarChart } from "@/components/analytics/charts";
import { invoices, purchaseOrders } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  FileQuestion, FileText, ShoppingCart, TrendingUp, DollarSign, Star,
};

export default function Page() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const d = vendorAnalyticsData;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Your vendor performance and business intelligence"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button variant="secondary" size="sm"><Download className="h-4 w-4" /> Export PDF</Button>
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
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.kpis.slice(0, 6).map((kpi) => (
          <KPICard key={kpi.label} {...kpi} icon={iconMap[kpi.label === "Open RFQs" ? "FileQuestion" : kpi.label === "Submitted Quotations" ? "FileText" : kpi.label === "Won Contracts" ? "ShoppingCart" : kpi.label === "Revenue Earned" ? "DollarSign" : kpi.label === "Pending Invoices" ? "TrendingUp" : "Star"]} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Revenue Trend" />
          <CardBody>
            <LineChartSimple data={d.revenueTrend} lines={[{ key: "revenue", label: "Revenue", color: "#22c55e" }, { key: "target", label: "Target", color: "#4f46e5" }]} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quotation Success Rate" />
          <CardBody>
            <PieChart segments={d.quotationSuccess} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Monthly Contract Value" />
          <CardBody>
            <HorizontalBarChart bars={d.contractValue} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Payment Status" />
          <CardBody>
            <PieChart segments={d.paymentStatus} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Recent Quotations" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { title: "Steel Sheet Supply Q3", amount: 48200, status: "pending" as const },
                { title: "Safety Equipment Refresh", amount: 8900, status: "approved" as const },
                { title: "Office Supplies Annual", amount: 3200, status: "approved" as const },
              ].map((q, i) => (
                <div key={i} className="px-6 py-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900 truncate">{q.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={q.status} />
                    <span className="text-xs text-slate-500">{formatCurrency(q.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Contracts" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { title: "Master Supply Agreement", value: 500000, status: "active" as const },
                { title: "Freight Services SLA", value: 180000, status: "active" as const },
                { title: "Component Supply SOW", value: 95000, status: "review" as const },
              ].map((c, i) => (
                <div key={i} className="px-6 py-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900 truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={c.status} />
                    <span className="text-xs text-slate-500">{formatCurrency(c.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Payments" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {invoices.slice(0, 4).map((inv) => (
                <div key={inv.id} className="px-6 py-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900">{inv.invoiceNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={inv.status} />
                    <span className="text-xs text-slate-500">{formatCurrency(inv.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
