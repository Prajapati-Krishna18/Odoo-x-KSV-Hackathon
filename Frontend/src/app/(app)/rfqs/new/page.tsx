import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { vendors } from "@/lib/data";

export default function NewRFQPage() {
  return (
    <div>
      <PageHeader
        title="Create RFQ"
        description="Request quotes from vendors"
        breadcrumbs={[
          { label: "RFQs", href: "/rfqs" },
          { label: "New RFQ" },
        ]}
      />

      <Card className="max-w-2xl">
        <CardBody>
          <form className="space-y-4" action="/rfqs/rfq1">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input
                type="text"
                placeholder="e.g. Q3 Steel Sheet Procurement"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {["Raw Materials", "Logistics", "Electronics", "Safety Equipment"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Budget</label>
                <input
                  type="number"
                  placeholder="100000"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Deadline</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Invite vendors</label>
              <div className="mt-2 space-y-2">
                {vendors.slice(0, 4).map((v) => (
                  <label key={v.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600" />
                    {v.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Send RFQ</Button>
              <Button variant="secondary" href="/rfqs">Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
