import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { rfqs, getVendor } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  return (
    <div>
      <PageHeader
        title="Quotations"
        description="Compare vendor quotes across RFQs"
        actions={<Button href="/procurement/create-rfq">New RFQ</Button>}
      />
      <div className="space-y-4">
        {rfqs.filter((r) => r.responses > 0).map((rfq) => (
          <Card key={rfq.id}>
            <CardBody>
              <Link href={`/procurement/rfqs/${rfq.id}`} className="font-semibold text-indigo-600 hover:underline">
                {rfq.title}
              </Link>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {rfq.vendorIds.map((vid, i) => {
                  const vendor = getVendor(vid);
                  if (!vendor || i >= rfq.responses) return null;
                  return (
                    <Link
                      key={vid}
                      href={`/procurement/rfqs/${rfq.id}`}
                      className="flex justify-between rounded-lg border border-slate-100 p-3 hover:border-indigo-200"
                    >
                      <span className="text-sm font-medium">{vendor.name}</span>
                      <span className="text-sm font-semibold">{formatCurrency(rfq.budget * (0.85 + i * 0.05))}</span>
                    </Link>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
