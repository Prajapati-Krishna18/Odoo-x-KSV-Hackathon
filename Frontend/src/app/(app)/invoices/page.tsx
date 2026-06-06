import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { invoices } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function InvoicesPage() {
  const overdue = invoices.filter((i) => i.status === "overdue").length;

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${invoices.length} invoices · ${overdue} overdue`}
        actions={
          <Button variant="secondary" href="/settings/integrations">
            Sync from Odoo
          </Button>
        }
      />

      {overdue > 0 && (
        <Link
          href="/invoices/inv4"
          className="mb-6 block rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 hover:bg-red-100"
        >
          <strong>{overdue} overdue invoice{overdue > 1 ? "s" : ""}</strong> require immediate
          attention →
        </Link>
      )}

      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">PO Reference</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/invoices/${inv.id}`} className="font-medium text-indigo-600 hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/vendors/${inv.vendorId}`} className="text-slate-700 hover:text-indigo-600">
                      {inv.vendorName}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/purchase-orders/${inv.poId}`} className="text-indigo-600 hover:underline">
                      View PO
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={inv.status} href={`/invoices/${inv.id}`} />
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
