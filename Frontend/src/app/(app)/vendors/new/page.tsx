import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
export default function NewVendorPage() {
  return (
    <div>
      <PageHeader
        title="Add Vendor"
        description="Onboard a new vendor to your network"
        breadcrumbs={[
          { label: "Vendors", href: "/vendors" },
          { label: "Add vendor" },
        ]}
      />

      <Card className="max-w-2xl">
        <CardBody>
          <form className="space-y-4" action="/vendors/v1">
            <div>
              <label className="block text-sm font-medium text-slate-700">Company name</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                  {["Raw Materials", "Logistics", "Electronics", "Office Supplies", "Packaging", "Safety Equipment"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Contact person</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Location</label>
              <input
                type="text"
                placeholder="City, State"
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="submit">Add vendor</Button>
              <Button variant="secondary" href="/vendors">Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      <p className="mt-6 text-sm text-slate-500">
        Or import from{" "}
        <Link href="/settings/integrations" className="text-indigo-600 hover:underline">
          Odoo
        </Link>{" "}
        to sync existing vendors automatically.
      </p>
    </div>
  );
}
