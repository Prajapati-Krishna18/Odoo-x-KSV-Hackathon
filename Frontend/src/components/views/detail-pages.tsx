import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getPO, getRFQ } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

type Prefix = "admin" | "procurement" | "manager" | "vendor";

export function RFQDetailView({ id, prefix }: { id: string; prefix: Prefix }) {
  const rfq = getRFQ(id);
  if (!rfq) notFound();

  return (
    <div>
      <PageHeader
        title={rfq.title}
        breadcrumbs={[
          { label: "RFQs", href: `/${prefix}/rfqs` },
          { label: rfq.title },
        ]}
      />
      <Card>
        <CardHeader title="RFQ details" />
        <CardBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-400">Status</dt>
              <dd className="mt-1"><StatusBadge status={rfq.status} /></dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Budget</dt>
              <dd className="mt-1 font-semibold">{formatCurrency(rfq.budget)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Deadline</dt>
              <dd className="mt-1">{formatDate(rfq.deadline)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Responses</dt>
              <dd className="mt-1">{rfq.responses}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}

export function PODetailView({ id, prefix }: { id: string; prefix: Prefix }) {
  const po = getPO(id);
  if (!po) notFound();

  return (
    <div>
      <PageHeader
        title={po.poNumber}
        breadcrumbs={[
          { label: "Purchase Orders", href: `/${prefix}/purchase-orders` },
          { label: po.poNumber },
        ]}
      />
      <Card>
        <CardHeader title="Order details" />
        <CardBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-slate-400">Vendor</dt>
              <dd className="mt-1 font-medium">{po.vendorName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Status</dt>
              <dd className="mt-1"><StatusBadge status={po.status} /></dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Amount</dt>
              <dd className="mt-1 text-xl font-bold">{formatCurrency(po.amount)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-slate-400">Due date</dt>
              <dd className="mt-1">{formatDate(po.dueDate)}</dd>
            </div>
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
