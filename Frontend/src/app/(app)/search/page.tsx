import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import {
  vendors,
  purchaseOrders,
  invoices,
  products,
  rfqs,
} from "@/lib/data";

export default function SearchPage() {
  const results = [
    ...vendors.map((v) => ({
      type: "Vendor",
      title: v.name,
      subtitle: v.category,
      href: `/vendors/${v.id}`,
    })),
    ...purchaseOrders.map((p) => ({
      type: "Purchase Order",
      title: p.poNumber,
      subtitle: p.vendorName,
      href: `/purchase-orders/${p.id}`,
    })),
    ...invoices.map((i) => ({
      type: "Invoice",
      title: i.invoiceNumber,
      subtitle: i.vendorName,
      href: `/invoices/${i.id}`,
    })),
    ...products.map((p) => ({
      type: "Product",
      title: p.name,
      subtitle: p.sku,
      href: `/catalog/${p.id}`,
    })),
    ...rfqs.map((r) => ({
      type: "RFQ",
      title: r.title,
      subtitle: r.category,
      href: `/rfqs/${r.id}`,
    })),
  ];

  return (
    <div>
      <PageHeader
        title="Search"
        description={`${results.length} results across vendors, POs, invoices, and more`}
      />

      <div className="mb-6">
        <input
          type="search"
          placeholder="Search vendors, POs, invoices..."
          className="w-full max-w-lg rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        {results.map((r, i) => (
          <Link
            key={i}
            href={r.href}
            className="flex items-center justify-between rounded-lg px-4 py-3 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
          >
            <div>
              <p className="font-medium text-slate-900">{r.title}</p>
              <p className="text-sm text-slate-500">{r.subtitle}</p>
            </div>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {r.type}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
