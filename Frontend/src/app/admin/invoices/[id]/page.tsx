import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getInvoice, getPO } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminInvoiceDetailPage({
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
          { label: "Invoices", href: "/admin/invoices" },
          { label: invoice.invoiceNumber },
        ]}
      />
      <Card>
        <CardHeader title="Invoice details" />
        <CardBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-400">Vendor</dt>
              <dd className="mt-1 font-medium">{invoice.vendorName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Status</dt>
              <dd className="mt-1"><StatusBadge status={invoice.status} /></dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Amount</dt>
              <dd className="mt-1 text-2xl font-bold">{formatCurrency(invoice.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">PO Reference</dt>
              <dd className="mt-1">
                <Link href={`/admin/purchase-orders/${invoice.poId}`} className="text-indigo-600 hover:underline">
                  {po?.poNumber ?? invoice.poId}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Issued</dt>
              <dd className="mt-1">{formatDate(invoice.issuedDate)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Due</dt>
              <dd className="mt-1">{formatDate(invoice.dueDate)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
