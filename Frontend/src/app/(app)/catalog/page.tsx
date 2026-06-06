import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { products } from "@/lib/data";

export default function CatalogPage() {
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        description={`${products.length} products from your vendor network`}
        actions={
          <>
            <Button variant="secondary" href="/settings/integrations">Sync from Odoo</Button>
            <Button href="/purchase-orders/new">Order from catalog</Button>
          </>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/catalog"
          className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white"
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/catalog?category=${encodeURIComponent(cat)}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card key={p.id} href={`/catalog/${p.id}`}>
            <CardBody>
              <p className="text-xs font-mono text-slate-400">{p.sku}</p>
              <h3 className="mt-1 font-semibold text-slate-900">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{p.vendorName}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">${p.unitPrice}</span>
                <span className={`text-xs font-medium ${p.inStock ? "text-emerald-600" : "text-orange-600"}`}>
                  {p.inStock ? "In stock" : `${p.leadTimeDays}d lead`}
                </span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
