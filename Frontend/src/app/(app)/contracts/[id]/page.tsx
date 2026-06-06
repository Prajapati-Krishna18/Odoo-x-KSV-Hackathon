import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getContract, purchaseOrders } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const contract = getContract(id);
  if (!contract) notFound();

  const relatedPOs = purchaseOrders.filter((p) => p.vendorId === contract.vendorId);

  return (
    <div>
      <PageHeader
        title={contract.title}
        description={`${contract.type} with ${contract.vendorName}`}
        breadcrumbs={[
          { label: "Contracts", href: "/contracts" },
          { label: contract.title },
        ]}
        actions={
          <>
            <Button variant="secondary" href={`/vendors/${contract.vendorId}`}>View vendor</Button>
            {contract.status === "expired" && <Button href="/rfqs/new">Renew via RFQ</Button>}
            {contract.status === "active" && <Button href="/purchase-orders/new">Create PO</Button>}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Contract terms" />
          <CardBody>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Vendor</dt>
                <dd className="mt-1">
                  <Link href={`/vendors/${contract.vendorId}`} className="font-medium text-indigo-600 hover:underline">
                    {contract.vendorName}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Status</dt>
                <dd className="mt-1"><StatusBadge status={contract.status} /></dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Contract value</dt>
                <dd className="mt-1 font-semibold text-lg">{formatCurrency(contract.value)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Type</dt>
                <dd className="mt-1">{contract.type}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">Start date</dt>
                <dd className="mt-1">{formatDate(contract.startDate)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-slate-400">End date</dt>
                <dd className="mt-1">{formatDate(contract.endDate)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Related POs" />
          <CardBody className="space-y-2">
            {relatedPOs.slice(0, 3).map((po) => (
              <Link
                key={po.id}
                href={`/purchase-orders/${po.id}`}
                className="block rounded-lg p-2 hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-indigo-600">{po.poNumber}</p>
                <p className="text-xs text-slate-500">{formatCurrency(po.amount)}</p>
              </Link>
            ))}
            <Button variant="ghost" size="sm" href="/purchase-orders" className="w-full mt-2">
              View all POs
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
