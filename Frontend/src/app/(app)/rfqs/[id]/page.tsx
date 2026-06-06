import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getRFQ, getVendor } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function RFQDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rfq = getRFQ(id);
  if (!rfq) notFound();

  return (
    <div>
      <PageHeader
        title={rfq.title}
        description={rfq.category}
        breadcrumbs={[
          { label: "RFQs", href: "/rfqs" },
          { label: rfq.title },
        ]}
        actions={
          <>
            <Button variant="secondary" href="/purchase-orders/new">Convert to PO</Button>
            {rfq.status === "open" && <Button href="/rfqs">Close RFQ</Button>}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="RFQ details" />
            <CardBody>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Status</dt>
                  <dd className="mt-1"><StatusBadge status={rfq.status} /></dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Budget</dt>
                  <dd className="mt-1 font-semibold">{formatCurrency(rfq.budget)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Deadline</dt>
                  <dd className="mt-1">{formatDate(rfq.deadline)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-slate-400">Created</dt>
                  <dd className="mt-1">{formatDate(rfq.createdAt)}</dd>
                </div>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Vendor responses" />
            <CardBody className="space-y-3">
              {rfq.vendorIds.map((vid, i) => {
                const vendor = getVendor(vid);
                if (!vendor) return null;
                const hasResponse = i < rfq.responses;
                return (
                  <Link
                    key={vid}
                    href={`/vendors/${vid}`}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:border-indigo-200 hover:bg-slate-50"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{vendor.name}</p>
                      <p className="text-sm text-slate-500">{vendor.category}</p>
                    </div>
                    <div className="text-right">
                      {hasResponse ? (
                        <>
                          <p className="font-semibold text-slate-900">
                            {formatCurrency(rfq.budget * (0.85 + i * 0.05))}
                          </p>
                          <span className="text-xs text-emerald-600">Quote received</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">Awaiting response</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader title="Actions" />
          <CardBody className="space-y-2">
            <Button href="/messages" variant="secondary" className="w-full">
              Message vendors
            </Button>
            <Button href="/purchase-orders/new" variant="secondary" className="w-full">
              Award & create PO
            </Button>
            <Button href="/analytics" variant="ghost" className="w-full">
              View spend forecast
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
