import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { getVendor } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function Page() {
  const vendor = getVendor("v1");

  if (!vendor) return null;

  return (
    <div>
      <PageHeader title="Vendor Profile" description="Manage your company information" />
      <Card className="max-w-2xl">
        <CardBody>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Company name</label>
              <input type="text" defaultValue={vendor.name} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Contact person</label>
                <input type="text" defaultValue={vendor.contactPerson} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Category</label>
                <input type="text" defaultValue={vendor.category} disabled className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input type="email" defaultValue={vendor.email} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-sm">
              <p><span className="text-slate-500">YTD Spend:</span> <strong>{formatCurrency(vendor.spendYtd)}</strong></p>
              <p className="mt-1"><span className="text-slate-500">Compliance Score:</span> <strong>{vendor.complianceScore}%</strong></p>
            </div>
            <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Save profile
            </button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
