import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SettingsSidebar } from "@/components/layout/app-shell";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Manage your organization preferences" />

      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1 max-w-2xl space-y-6">
          <Card>
            <CardHeader title="Organization" />
            <CardBody>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Company name</label>
                  <input
                    type="text"
                    defaultValue="KSV Manufacturing Co."
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Default currency</label>
                  <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Fiscal year start</label>
                  <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500">
                    <option>January</option>
                    <option>April</option>
                    <option>July</option>
                  </select>
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Notifications preferences" />
            <CardBody className="space-y-3">
              {[
                "Email alerts for overdue invoices",
                "RFQ response notifications",
                "Compliance score changes",
                "Weekly spend digest",
              ].map((pref) => (
                <label key={pref} className="flex items-center gap-3 text-sm text-slate-700">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600" />
                  {pref}
                </label>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
