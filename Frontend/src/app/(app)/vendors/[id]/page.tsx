import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Mail, Phone, MapPin, MessageSquare, FileSignature } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import {
  getVendor,
  purchaseOrders,
  contracts,
  invoices,
  products,
  messages,
} from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vendor = getVendor(id);
  if (!vendor) notFound();

  const vendorPOs = purchaseOrders.filter((p) => p.vendorId === id);
  const vendorContracts = contracts.filter((c) => c.vendorId === id);
  const vendorInvoices = invoices.filter((i) => i.vendorId === id);
  const vendorProducts = products.filter((p) => p.vendorId === id);
  const vendorMessage = messages.find((m) => m.vendorId === id);

  return (
    <div>
      <PageHeader
        title={vendor.name}
        description={vendor.category}
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: vendor.name },
        ]}
        actions={
          <>
            <Button variant="secondary" href={vendorMessage ? `/messages/${vendorMessage.id}` : "/messages"}>
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
            <Button href="/purchase-orders/new">Create PO</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Overview" />
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">Contact</p>
                  <p className="mt-1 font-medium text-slate-900">{vendor.contactPerson}</p>
                  <a href={`mailto:${vendor.email}`} className="mt-2 flex items-center gap-2 text-sm text-indigo-600 hover:underline">
                    <Mail className="h-4 w-4" /> {vendor.email}
                  </a>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" /> {vendor.phone}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" /> {vendor.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">Performance</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Rating</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {vendor.rating}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Spend YTD</span>
                      <Link href="/analytics" className="font-medium text-indigo-600 hover:underline">
                        {formatCurrency(vendor.spendYtd)}
                      </Link>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Compliance</span>
                      <Link href="/compliance" className="font-medium text-indigo-600 hover:underline">
                        {vendor.complianceScore}%
                      </Link>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status</span>
                      <StatusBadge status={vendor.status} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {vendor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Purchase Orders"
              action={<Button variant="ghost" size="sm" href="/purchase-orders">View all</Button>}
            />
            <CardBody className="p-0">
              {vendorPOs.length === 0 ? (
                <p className="px-6 py-4 text-sm text-slate-500">No purchase orders yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {vendorPOs.map((po) => (
                      <tr key={po.id} className="hover:bg-slate-50">
                        <td className="px-6 py-3">
                          <Link href={`/purchase-orders/${po.id}`} className="font-medium text-indigo-600 hover:underline">
                            {po.poNumber}
                          </Link>
                        </td>
                        <td className="px-6 py-3 text-slate-700">{formatCurrency(po.amount)}</td>
                        <td className="px-6 py-3">
                          <StatusBadge status={po.status} href={`/purchase-orders/${po.id}`} />
                        </td>
                        <td className="px-6 py-3 text-slate-500">{formatDate(po.dueDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Product Catalog" action={<Button variant="ghost" size="sm" href="/catalog">Browse catalog</Button>} />
            <CardBody className="p-0">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {vendorProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link href={`/catalog/${p.id}`} className="font-medium text-indigo-600 hover:underline">
                          {p.name}
                        </Link>
                        <p className="text-xs text-slate-500">{p.sku}</p>
                      </td>
                      <td className="px-6 py-3 text-slate-700">${p.unitPrice}</td>
                      <td className="px-6 py-3">
                        <span className={p.inStock ? "text-emerald-600" : "text-orange-600"}>
                          {p.inStock ? "In stock" : `${p.leadTimeDays}d lead`}
                        </span>
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
            <CardHeader title="Contracts" />
            <CardBody className="space-y-3">
              {vendorContracts.map((c) => (
                <Link
                  key={c.id}
                  href={`/contracts/${c.id}`}
                  className="block rounded-lg border border-slate-100 p-3 hover:border-indigo-200 hover:bg-slate-50"
                >
                  <div className="flex items-start gap-2">
                    <FileSignature className="h-4 w-4 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.type} · {formatCurrency(c.value)}</p>
                      <StatusBadge status={c.status} className="mt-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Recent Invoices" />
            <CardBody className="space-y-3">
              {vendorInvoices.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{inv.invoiceNumber}</p>
                    <p className="text-xs text-slate-500">Due {formatDate(inv.dueDate)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(inv.amount)}</p>
                    <StatusBadge status={inv.status} />
                  </div>
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
