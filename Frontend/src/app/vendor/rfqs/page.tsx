import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { rfqs } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function Page() {
  const open = rfqs.filter((r) => r.status === "open" || r.status === "pending");

  return (
    <div>
      <PageHeader title="RFQs" description="Requests for quotation sent to your organization" />
      <div className="grid gap-4">
        {open.map((rfq) => (
          <Card key={rfq.id} href={`/vendor/rfqs/${rfq.id}`}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{rfq.title}</h3>
                  <p className="text-sm text-slate-500">
                    Budget {formatCurrency(rfq.budget)} · Deadline {formatDate(rfq.deadline)}
                  </p>
                </div>
                <StatusBadge status={rfq.status} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
