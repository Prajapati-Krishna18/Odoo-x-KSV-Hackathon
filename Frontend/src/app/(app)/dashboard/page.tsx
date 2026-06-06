import Link from "next/link";
import {
  Building2,
  ShoppingCart,
  Receipt,
  DollarSign,
  FileQuestion,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody, StatCard } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import {
  dashboardStats,
  purchaseOrders,
  invoices,
  notifications,
  vendors,
  rfqs,
} from "@/lib/data";
import { formatCurrency, formatDate, formatRelative } from "@/lib/utils";

export default function DashboardPage() {
  const recentPOs = purchaseOrders.slice(0, 5);
  const recentNotifications = notifications.slice(0, 4);
  const atRiskVendors = vendors.filter((v) => v.status === "at-risk" || v.complianceScore < 75);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your vendor operations and procurement activity."
        actions={
          <>
            <Button variant="secondary" href="/rfqs/new">
              New RFQ
            </Button>
            <Button href="/purchase-orders/new">Create PO</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Active Vendors"
          value={String(dashboardStats.activeVendors)}
          change="+2 this quarter"
          href="/vendors"
          icon={<Building2 className="h-5 w-5" />}
        />
        <StatCard
          label="Open POs"
          value={String(dashboardStats.openPOs)}
          href="/purchase-orders"
          icon={<ShoppingCart className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Invoices"
          value={String(dashboardStats.pendingInvoices)}
          href="/invoices"
          icon={<Receipt className="h-5 w-5" />}
        />
        <StatCard
          label="Spend YTD"
          value={formatCurrency(dashboardStats.spendYtd)}
          change="↑ 12% vs last year"
          href="/analytics"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent Purchase Orders"
              action={
                <Button variant="ghost" size="sm" href="/purchase-orders">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              }
            />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-3">PO #</th>
                    <th className="px-6 py-3">Vendor</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentPOs.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link
                          href={`/purchase-orders/${po.id}`}
                          className="font-medium text-indigo-600 hover:underline"
                        >
                          {po.poNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-3">
                        <Link
                          href={`/vendors/${po.vendorId}`}
                          className="text-slate-700 hover:text-indigo-600"
                        >
                          {po.vendorName}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-700">
                        {formatCurrency(po.amount)}
                      </td>
                      <td className="px-6 py-3">
                        <StatusBadge status={po.status} href={`/purchase-orders/${po.id}`} />
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        {formatDate(po.dueDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Notifications"
              action={
                <Button variant="ghost" size="sm" href="/notifications">
                  View all
                </Button>
              }
            />
            <CardBody className="space-y-3 p-4">
              {recentNotifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  className={`block rounded-lg p-3 transition-colors hover:bg-slate-50 ${
                    !n.read ? "bg-indigo-50/50" : ""
                  }`}
                >
                  <p className="text-sm font-medium text-slate-900">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatRelative(n.createdAt)}</p>
                </Link>
              ))}
            </CardBody>
          </Card>

          {atRiskVendors.length > 0 && (
            <Card href="/compliance">
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Compliance alerts</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {atRiskVendors.length} vendor{atRiskVendors.length > 1 ? "s" : ""} need
                      review
                    </p>
                    <span className="mt-2 inline-flex text-sm font-medium text-indigo-600">
                      Review now →
                    </span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Card href="/rfqs">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Open RFQs</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {dashboardStats.openRfqs}
                </p>
              </div>
              <FileQuestion className="h-8 w-8 text-indigo-400" />
            </div>
            <p className="mt-3 text-sm text-indigo-600 font-medium">
              {rfqs.filter((r) => r.status === "open")[0]?.title ?? "View RFQs"} →
            </p>
          </CardBody>
        </Card>
        <Card href="/invoices">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Overdue Invoices</p>
                <p className="mt-1 text-2xl font-bold text-red-600">
                  {invoices.filter((i) => i.status === "overdue").length}
                </p>
              </div>
              <Receipt className="h-8 w-8 text-red-400" />
            </div>
            <p className="mt-3 text-sm text-indigo-600 font-medium">
              Review overdue payments →
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
