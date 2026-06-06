import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SettingsSidebar } from "@/components/layout/app-shell";

export default function BillingPage() {
  return (
    <div>
      <PageHeader title="Billing" description="Manage your subscription and payment methods" />

      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1 max-w-2xl space-y-6">
          <Card>
            <CardHeader
              title="Current plan"
              action={<Button variant="outline" size="sm" href="/#pricing">Upgrade</Button>}
            />
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-slate-900">Professional</p>
                  <p className="text-sm text-slate-500">$149/month · Renews July 1, 2026</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  Active
                </span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>✓ Unlimited vendors & POs</li>
                <li>✓ Odoo ERP integration</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Payment method" />
            <CardBody>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div>
                  <p className="font-medium text-slate-900">Visa ending in 4242</p>
                  <p className="text-sm text-slate-500">Expires 12/2027</p>
                </div>
                <Button variant="secondary" size="sm">Update</Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Billing history" />
            <CardBody className="space-y-3">
              {[
                { date: "Jun 1, 2026", amount: "$149.00", status: "Paid" },
                { date: "May 1, 2026", amount: "$149.00", status: "Paid" },
                { date: "Apr 1, 2026", amount: "$149.00", status: "Paid" },
              ].map((inv) => (
                <Link
                  key={inv.date}
                  href="/help"
                  className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50"
                >
                  <span className="text-sm text-slate-700">{inv.date}</span>
                  <span className="text-sm font-medium">{inv.amount}</span>
                  <span className="text-xs text-emerald-600">{inv.status}</span>
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
