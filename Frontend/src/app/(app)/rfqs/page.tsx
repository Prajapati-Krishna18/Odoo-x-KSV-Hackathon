import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { rfqs } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function RFQsPage() {
  return (
    <div>
      <PageHeader
        title="Request for Quotes"
        description="Manage RFQs and vendor responses"
        actions={<Button href="/rfqs/new">New RFQ</Button>}
      />

      <div className="grid gap-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id} href={`/rfqs/${rfq.id}`}>
            <CardBody>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-slate-900">{rfq.title}</h3>
                    <StatusBadge status={rfq.status} />
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {rfq.category} · Budget {formatCurrency(rfq.budget)} · Deadline {formatDate(rfq.deadline)}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-slate-400">Responses</p>
                    <p className="font-semibold text-slate-900">{rfq.responses}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Vendors</p>
                    <p className="font-semibold text-indigo-600">{rfq.vendorIds.length} invited</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
