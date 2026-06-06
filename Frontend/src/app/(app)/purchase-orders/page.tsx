import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { purchaseOrders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function PurchaseOrdersPage() {
  return (
    <div>
      <PageHeader
        title="Purchase Orders"
        description={`${purchaseOrders.length} purchase orders`}
        actions={<Button href="/procurement/purchase-orders/create">Create PO</Button>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Pending", "Approved", "Draft", "Rejected"].map((filter) => (
          <Link
            key={filter}
            href={filter === "All" ? "/purchase-orders" : `/purchase-orders?status=${filter.toLowerCase()}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          >
            {filter}
          </Link>
        ))}
      </div>

      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">PO Number</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/purchase-orders/${po.id}`} className="font-medium text-indigo-600 hover:underline">
                      {po.poNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/vendors/${po.vendorId}`} className="text-slate-700 hover:text-indigo-600">
                      {po.vendorName}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{po.department}</td>
                  <td className="px-6 py-4 text-slate-600">{po.items}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(po.amount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={po.status} href={`/purchase-orders/${po.id}`} />
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
