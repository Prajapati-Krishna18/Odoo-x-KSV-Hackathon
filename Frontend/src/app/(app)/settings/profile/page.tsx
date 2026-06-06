import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SettingsSidebar } from "@/components/layout/app-shell";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile" description="Your personal account settings" />

      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1 max-w-2xl">
          <Card>
            <CardHeader title="Personal information" />
            <CardBody>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                  AR
                </div>
                <Button variant="secondary" size="sm">Change avatar</Button>
              </div>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">First name</label>
                    <input
                      type="text"
                      defaultValue="Alex"
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Last name</label>
                    <input
                      type="text"
                      defaultValue="Rivera"
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    defaultValue="alex.rivera@company.com"
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Role</label>
                  <input
                    type="text"
                    defaultValue="Procurement Admin"
                    disabled
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                  />
                </div>
                <Button type="submit">Update profile</Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
