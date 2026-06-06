import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getPO, invoices } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function PODetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const po = getPO(id);
  if (!po) notFound();

  const relatedInvoice = invoices.find((i) => i.poId === id);

  return (
    <div>
      <PageHeader
        title={po.poNumber}
        description={`${po.vendorName} · ${po.department}`}
        breadcrumbs={[
          { label: "Purchase Orders", href: "/purchase-orders" },
          { label: po.poNumber },
        ]}
        actions={
          <>
            {relatedInvoice && (
              <Button variant="secondary" href={`/invoices/${relatedInvoice.id}`}>
                View invoice
              </Button>
            )}
            <Button variant="secondary" href={`/vendors/${po.vendorId}`}>
              View vendor
            </Button>
            {po.status === "pending" && <Button href="/purchase-orders">Approve</Button>}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Order details" />
            <CardBody>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Vendor</dt>
                  <dd className="mt-1">
                    <Link href={`/vendors/${po.vendorId}`} className="font-medium text-indigo-600 hover:underline">
                      {po.vendorName}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Status</dt>
                  <dd className="mt-1"><StatusBadge status={po.status} /></dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Amount</dt>
                  <dd className="mt-1 font-semibold text-slate-900">{formatCurrency(po.amount)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Line items</dt>
                  <dd className="mt-1 text-slate-700">{po.items} items</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Created</dt>
                  <dd className="mt-1 text-slate-700">{formatDate(po.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Due date</dt>
                  <dd className="mt-1 text-slate-700">{formatDate(po.dueDate)}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Line items" />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                    <th className="px-6 py-3">Item</th>
                    <th className="px-6 py-3">Qty</th>
                    <th className="px-6 py-3">Unit price</th>
                    <th className="px-6 py-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: Math.min(po.items, 4) }).map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link href="/catalog" className="text-indigo-600 hover:underline">
                          Line item #{i + 1}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-slate-600">{Math.ceil(po.items / 4)}</td>
                      <td className="px-6 py-3 text-slate-600">
                        {formatCurrency(Math.round(po.amount / po.items))}
                      </td>
                      <td className="px-6 py-3 font-medium">
                        {formatCurrency(Math.round((po.amount / po.items) * Math.ceil(po.items / 4)))}
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
            <CardHeader title="Activity" />
            <CardBody className="space-y-4">
              <div className="border-l-2 border-indigo-200 pl-4">
                <p className="text-sm font-medium text-slate-900">PO created</p>
                <p className="text-xs text-slate-500">{formatDate(po.createdAt)}</p>
              </div>
              {po.status === "approved" && (
                <div className="border-l-2 border-emerald-200 pl-4">
                  <p className="text-sm font-medium text-slate-900">Approved by Finance</p>
                  <p className="text-xs text-slate-500">
                    <Link href="/settings/team" className="text-indigo-600 hover:underline">Jordan Kim</Link>
                  </p>
                </div>
              )}
              {relatedInvoice && (
                <div className="border-l-2 border-blue-200 pl-4">
                  <p className="text-sm font-medium text-slate-900">Invoice received</p>
                  <Link href={`/invoices/${relatedInvoice.id}`} className="text-xs text-indigo-600 hover:underline">
                    {relatedInvoice.invoiceNumber}
                  </Link>
                </div>
              )}
            </CardBody>
          </Card>

          <Card href="/settings/integrations">
            <CardBody>
              <p className="text-sm font-medium text-slate-900">Odoo sync</p>
              <p className="mt-1 text-xs text-slate-500">Synced to Odoo ERP · Last update 2 min ago</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
