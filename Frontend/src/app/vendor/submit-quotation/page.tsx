import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { rfqs } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const open = rfqs.filter((r) => r.status === "open");

  return (
    <div>
      <PageHeader title="Submit Quotation" description="Respond to open RFQs with your pricing" />
      <div className="space-y-4 max-w-2xl">
        {open.map((rfq) => (
          <Card key={rfq.id}>
            <CardBody>
              <h3 className="font-semibold text-slate-900">{rfq.title}</h3>
              <p className="text-sm text-slate-500 mt-1">Budget: {formatCurrency(rfq.budget)}</p>
              <form className="mt-4 space-y-3" action={`/vendor/rfqs/${rfq.id}`}>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Your quote amount</label>
                  <input type="number" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Enter amount" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Notes</label>
                  <textarea rows={2} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                </div>
                <Button type="submit" size="sm">Submit quotation</Button>
              </form>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
