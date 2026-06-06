import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { vendors } from "@/lib/data";

export default function Page() {
  return (
    <div>
      <PageHeader title="Create RFQ" description="Request quotes from vendors" />
      <Card className="max-w-2xl">
        <CardBody>
          <form className="space-y-4" action="/procurement/rfqs/rfq1">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input type="text" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Q3 Steel Sheet Procurement" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Budget</label>
                <input type="number" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Deadline</label>
                <input type="date" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Invite vendors</label>
              {vendors.slice(0, 4).map((v) => (
                <label key={v.id} className="flex items-center gap-2 text-sm mb-1">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  {v.name}
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <Button type="submit">Send RFQ</Button>
              <Button variant="secondary" href="/procurement/rfqs">Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
