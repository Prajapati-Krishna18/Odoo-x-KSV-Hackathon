"use client";

import { useState } from "react";
import { Download, Filter, FileQuestion, FileText, ShoppingCart, TrendingUp, Clock, Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { procurementAnalytics } from "@/lib/analytics-data";
import { KPICard, LineChartSimple, HorizontalBarChart, AreaChartSimple } from "@/components/analytics/charts";
import { purchaseOrders, rfqs, invoices } from "@/lib/data";

const iconMap: Record<string, React.ElementType> = {
  FileQuestion, FileText, ShoppingCart, TrendingUp, Clock, Receipt,
};

export default function Page() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");
  const d = procurementAnalytics;

  const vendorNames = [...new Set([...purchaseOrders.map((p) => p.vendorName), ...rfqs.map((r) => r.title)])].sort();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Procurement performance and vendor intelligence"
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
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Vendor</label>
                <select value={vendorFilter} onChange={(e) => setVendorFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                  <option value="all">All Vendors</option>
                  {vendorNames.map((v) => (<option key={v} value={v}>{v}</option>))}
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {d.kpis.slice(0, 6).map((kpi) => (
          <KPICard key={kpi.label} {...kpi} icon={iconMap[kpi.label === "Active RFQs" ? "FileQuestion" : kpi.label === "Quotations Received" ? "FileText" : kpi.label === "POs Created" ? "ShoppingCart" : kpi.label === "Vendor Response Rate" ? "TrendingUp" : kpi.label === "Avg. Procurement Time" ? "Clock" : "Receipt"]} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="RFQ Trends" />
          <CardBody>
            <LineChartSimple data={d.rfqTrends} lines={[{ key: "open", label: "Open", color: "#4f46e5" }, { key: "closed", label: "Closed", color: "#22c55e" }, { key: "draft", label: "Draft", color: "#eab308" }]} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Quotation Comparison" />
          <CardBody>
            <HorizontalBarChart bars={d.quotationComparison} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="PO Creation Trends" />
          <CardBody>
            <AreaChartSimple data={d.poTrends} lines={[{ key: "approved", label: "Approved", color: "#22c55e" }, { key: "pending", label: "Pending", color: "#eab308" }, { key: "draft", label: "Draft", color: "#94a3b8" }]} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Top Vendors" />
          <CardBody className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Spend</th>
                  <th className="px-6 py-3">RFQs</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...new Set(purchaseOrders.map((p) => p.vendorName))].slice(0, 6).map((name) => {
                  const pos = purchaseOrders.filter((p) => p.vendorName === name);
                  const total = pos.reduce((s, p) => s + p.amount, 0);
                  return (
                    <tr key={name} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{name}</td>
                      <td className="px-6 py-4">{formatCurrency(total)}</td>
                      <td className="px-6 py-4">{pos.length}</td>
                      <td className="px-6 py-4"><StatusBadge status={pos[0]?.status || "active"} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Recent RFQs" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {rfqs.slice(0, 4).map((rfq) => (
                <div key={rfq.id} className="px-6 py-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900 truncate">{rfq.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={rfq.status} />
                    <span className="text-xs text-slate-500">{formatCurrency(rfq.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent POs" />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {purchaseOrders.slice(0, 4).map((po) => (
                <div key={po.id} className="px-6 py-3 hover:bg-slate-50">
                  <p className="text-sm font-medium text-slate-900">{po.poNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={po.status} />
                    <span className="text-xs text-slate-500">{po.vendorName}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Invoices" />
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
