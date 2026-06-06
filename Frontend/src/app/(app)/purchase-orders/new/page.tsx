import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { vendors } from "@/lib/data";

export default function NewPOPage() {
  return (
    <div>
      <PageHeader
        title="Create Purchase Order"
        description="Issue a new PO to a vendor"
        breadcrumbs={[
          { label: "Purchase Orders", href: "/purchase-orders" },
          { label: "Create PO" },
        ]}
      />

      <Card className="max-w-2xl">
        <CardBody>
          <form className="space-y-4" action="/purchase-orders/po1">
            <div>
              <label className="block text-sm font-medium text-slate-700">Vendor</label>
              <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Department</label>
                <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {["Manufacturing", "Operations", "Facilities", "R&D", "Admin"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Due date</label>
                <input
                  type="date"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Notes</label>
              <textarea
                rows={3}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Create PO</Button>
              <Button variant="secondary" href="/catalog">Add from catalog</Button>
              <Button variant="ghost" href="/purchase-orders">Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
