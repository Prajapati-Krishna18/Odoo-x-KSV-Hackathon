import Link from "next/link";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import {
  vendors,
  purchaseOrders,
  rfqs,
  invoices,
  teamMembers,
  dashboardStats,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

type Prefix = "admin" | "procurement" | "manager" | "vendor";

export function VendorsListView({
  prefix,
  showAdd = false,
}: {
  prefix: Prefix;
  showAdd?: boolean;
}) {
  return (
    <div>
      <PageHeader
        title="Vendors"
        description={`${vendors.length} vendors in the network`}
        actions={
          showAdd ? (
            <Button href={`/${prefix}/vendors/new`}>Add vendor</Button>
          ) : undefined
        }
      />
      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Spend YTD</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/${prefix}/vendors/${v.id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {v.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{v.category}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {v.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(v.spendYtd)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={v.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export function RFQsListView({ prefix }: { prefix: Prefix }) {
  return (
    <div>
      <PageHeader
        title="RFQs"
        description="Request for quotes across the organization"
        actions={
          prefix === "procurement" ? (
            <Button href="/procurement/create-rfq">Create RFQ</Button>
          ) : undefined
        }
      />
      <div className="grid gap-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id} href={`/${prefix}/rfqs/${rfq.id}`}>
            <CardBody>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{rfq.title}</h3>
                  <p className="text-sm text-slate-500">
                    {rfq.category} · Budget {formatCurrency(rfq.budget)} · {rfq.responses} responses
                  </p>
                </div>
                <StatusBadge status={rfq.status} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function POListView({
  prefix,
  showCreate = false,
  filterVendorId,
}: {
  prefix: Prefix;
  showCreate?: boolean;
  filterVendorId?: string;
}) {
  const list = filterVendorId
    ? purchaseOrders.filter((p) => p.vendorId === filterVendorId)
    : purchaseOrders;

  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description={`${list.length} purchase orders`}
        actions={
          showCreate ? (
            <Button href={prefix === "procurement" ? "/procurement/purchase-orders/create" : `/${prefix}/purchase-orders/new`}>
              Create PO
            </Button>
          ) : undefined
        }
      />
      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-6 py-3">PO #</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Due</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/${prefix}/purchase-orders/${po.id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {po.poNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{po.vendorName}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(po.amount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(po.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export function InvoicesListView({ prefix }: { prefix: Prefix }) {
  return (
    <div>
      <PageHeader title="Invoices" description={`${invoices.length} invoices`} />
      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Due</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/${prefix}/invoices/${inv.id}`}
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{inv.vendorName}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export function UsersListView() {
  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage platform users and role assignments"
        actions={<Button href="/admin/users">Invite user</Button>}
      />
      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Department</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                  <td className="px-6 py-4 text-slate-600">{m.email}</td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{m.department}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export function AnalyticsView({ prefix }: { prefix: Prefix }) {
  return (
    <div>
      <PageHeader title="Analytics" description="Spend and procurement insights" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Spend YTD", value: formatCurrency(dashboardStats.spendYtd) },
          { label: "Active Vendors", value: String(dashboardStats.activeVendors) },
          { label: "Open POs", value: String(dashboardStats.openPOs) },
        ].map((s) => (
          <Card key={s.label}>
            <CardBody>
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SettingsView({ prefix }: { prefix: Prefix }) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Settings saved successfully.");
  }

  return (
    <div>
      <PageHeader title="Settings" description="Account and organization preferences" />
      <Card className="max-w-xl">
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Organization</label>
              <input
                type="text"
                defaultValue="KSV Manufacturing Co."
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Timezone</label>
              <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option>America/Chicago (CST)</option>
                <option>America/New_York (EST)</option>
              </select>
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
