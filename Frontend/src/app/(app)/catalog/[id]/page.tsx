import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { getProduct } from "@/lib/data";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div>
      <PageHeader
        title={product.name}
        description={product.sku}
        breadcrumbs={[
          { label: "Catalog", href: "/catalog" },
          { label: product.name },
        ]}
        actions={
          <>
            <Button variant="secondary" href={`/vendors/${product.vendorId}`}>View vendor</Button>
            <Button href="/purchase-orders/new">Add to PO</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Product details" />
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">SKU</dt>
                <dd className="mt-1 font-mono text-sm">{product.sku}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Category</dt>
                <dd className="mt-1">
                  <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} className="text-indigo-600 hover:underline">
                    {product.category}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Unit price</dt>
                <dd className="mt-1 text-2xl font-bold">${product.unitPrice}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Availability</dt>
                <dd className={`mt-1 font-medium ${product.inStock ? "text-emerald-600" : "text-orange-600"}`}>
                  {product.inStock ? "In stock" : `Backordered · ${product.leadTimeDays} day lead time`}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Vendor</dt>
                <dd className="mt-1">
                  <Link href={`/vendors/${product.vendorId}`} className="font-medium text-indigo-600 hover:underline">
                    {product.vendorName}
                  </Link>
                </dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card href="/rfqs/new">
            <CardBody>
              <p className="font-medium text-slate-900">Request better pricing</p>
              <p className="mt-1 text-sm text-slate-500">Create an RFQ for bulk orders</p>
            </CardBody>
          </Card>
          <Card href="/settings/integrations">
            <CardBody>
              <p className="font-medium text-slate-900">Odoo inventory</p>
              <p className="mt-1 text-sm text-slate-500">Synced to Odoo product catalog</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
