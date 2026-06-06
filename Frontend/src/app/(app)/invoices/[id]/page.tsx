import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getInvoice, getPO } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = getInvoice(id);
  if (!invoice) notFound();

  const po = getPO(invoice.poId);

  return (
    <div>
      <PageHeader
        title={invoice.invoiceNumber}
        description={invoice.vendorName}
        breadcrumbs={[
          { label: "Invoices", href: "/invoices" },
          { label: invoice.invoiceNumber },
        ]}
        actions={
          <>
            <Button variant="secondary" href={`/vendors/${invoice.vendorId}`}>View vendor</Button>
            {invoice.status === "pending" && <Button href="/invoices">Approve payment</Button>}
            {invoice.status === "overdue" && <Button variant="danger" href="/messages">Contact vendor</Button>}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Invoice details" />
            <CardBody>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Vendor</dt>
                  <dd className="mt-1">
                    <Link href={`/vendors/${invoice.vendorId}`} className="font-medium text-indigo-600 hover:underline">
                      {invoice.vendorName}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Status</dt>
                  <dd className="mt-1"><StatusBadge status={invoice.status} /></dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Amount</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(invoice.amount)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">PO Reference</dt>
                  <dd className="mt-1">
                    <Link href={`/purchase-orders/${invoice.poId}`} className="text-indigo-600 hover:underline">
                      {po?.poNumber ?? invoice.poId}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Issued</dt>
                  <dd className="mt-1">{formatDate(invoice.issuedDate)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Due</dt>
                  <dd className={`mt-1 ${invoice.status === "overdue" ? "text-red-600 font-semibold" : ""}`}>
                    {formatDate(invoice.dueDate)}
                  </dd>
                </div>
              </dl>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Three-way match" />
            <CardBody className="space-y-3">
              {[
                { label: "Purchase Order", status: "Matched", href: `/purchase-orders/${invoice.poId}` },
                { label: "Goods Receipt", status: "Matched", href: `/purchase-orders/${invoice.poId}` },
                { label: "Invoice Amount", status: invoice.status === "rejected" ? "Mismatch" : "Matched", href: `/invoices/${invoice.id}` },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50"
                >
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span className={`text-xs font-medium ${item.status === "Matched" ? "text-emerald-600" : "text-red-600"}`}>
                    {item.status}
                  </span>
                </Link>
              ))}
            </CardBody>
          </Card>

          <Card href="/settings/billing">
            <CardBody>
              <p className="text-sm font-medium text-slate-900">Payment method</p>
              <p className="mt-1 text-xs text-slate-500">ACH · Net-30 terms</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
