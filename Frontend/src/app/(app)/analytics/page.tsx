import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { vendors, purchaseOrders, dashboardStats } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

const spendByCategory = [
  { category: "Raw Materials", amount: 284500, pct: 42 },
  { category: "Logistics", amount: 156200, pct: 23 },
  { category: "Safety Equipment", amount: 112400, pct: 17 },
  { category: "Electronics", amount: 92300, pct: 14 },
  { category: "Other", amount: 28000, pct: 4 },
];

export default function AnalyticsPage() {
  const topVendors = [...vendors].sort((a, b) => b.spendYtd - a.spendYtd).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Spend insights and procurement performance"
        actions={
          <Button variant="secondary" href="/help">Export report</Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {[
          { label: "Total Spend YTD", value: formatCurrency(dashboardStats.spendYtd), href: "/vendors" },
          { label: "Avg PO Value", value: formatCurrency(Math.round(dashboardStats.spendYtd / purchaseOrders.length)), href: "/purchase-orders" },
          { label: "Active Vendors", value: String(dashboardStats.activeVendors), href: "/vendors" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="rounded-xl border border-slate-200 bg-white p-6 hover:border-indigo-300 hover:shadow-md transition-all">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Spend by category" />
          <CardBody className="space-y-4">
            {spendByCategory.map((item) => (
              <Link key={item.category} href={`/catalog?category=${encodeURIComponent(item.category)}`} className="block group">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 group-hover:text-indigo-600">{item.category}</span>
                  <span className="font-medium">{formatCurrency(item.amount)}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 group-hover:bg-indigo-600 transition-colors"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Top vendors by spend"
            action={<Button variant="ghost" size="sm" href="/vendors">View all</Button>}
          />
          <CardBody className="space-y-3">
            {topVendors.map((v, i) => (
              <Link
                key={v.id}
                href={`/vendors/${v.id}`}
                className="flex items-center gap-4 rounded-lg p-2 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-semibold text-indigo-600">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{v.name}</p>
                  <p className="text-xs text-slate-500">{v.category}</p>
                </div>
                <span className="font-semibold text-slate-900">{formatCurrency(v.spendYtd)}</span>
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card href="/purchase-orders">
          <CardHeader title="PO volume trend" />
          <CardBody>
            <div className="flex items-end gap-2 h-32">
              {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-indigo-200 hover:bg-indigo-400 transition-colors"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="mt-4 text-sm text-indigo-600 font-medium">View purchase orders →</p>
          </CardBody>
        </Card>

        <Card href="/compliance">
          <CardHeader title="Compliance overview" />
          <CardBody>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-emerald-600">
                  {vendors.filter((v) => v.complianceScore >= 75).length}
                </p>
                <p className="text-sm text-slate-500">Compliant</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-orange-600">
                  {vendors.filter((v) => v.complianceScore < 75).length}
                </p>
                <p className="text-sm text-slate-500">At risk</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-indigo-600 font-medium">Review compliance hub →</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
