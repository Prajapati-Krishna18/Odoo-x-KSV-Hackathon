import Link from "next/link";
import { Check, RefreshCw, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SettingsSidebar } from "@/components/layout/app-shell";

const syncItems = [
  { label: "Vendors", count: 6, href: "/vendors" },
  { label: "Purchase Orders", count: 142, href: "/purchase-orders" },
  { label: "Invoices", count: 89, href: "/invoices" },
  { label: "Products", count: 24, href: "/catalog" },
];

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect VendorBridge with your business tools"
      />

      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1 space-y-6">
          <Card>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-lg font-bold text-purple-700">
                    Odoo
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">Odoo ERP</h3>
                      <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        <Check className="h-3 w-3" /> Connected
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Bi-directional sync for vendors, POs, invoices, and product catalog.
                    </p>
                    <p className="mt-2 text-xs text-slate-400">
                      Instance: ksv-manufacturing.odoo.com · Last sync: 2 minutes ago
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <RefreshCw className="h-4 w-4" />
                    Sync now
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings2 className="h-4 w-4" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Sync status" />
            <CardBody>
              <div className="grid gap-4 sm:grid-cols-2">
                {syncItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-4 hover:border-indigo-200 hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{item.count}</p>
                      <p className="text-xs text-emerald-600">Synced</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Available integrations" />
            <CardBody className="grid gap-4 sm:grid-cols-2">
              {[
                { name: "Slack", status: "Available", href: "/help" },
                { name: "QuickBooks", status: "Available", href: "/help" },
                { name: "SAP", status: "Coming soon", href: "/help" },
                { name: "NetSuite", status: "Coming soon", href: "/help" },
              ].map((int) => (
                <Link
                  key={int.name}
                  href={int.href}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:border-indigo-200"
                >
                  <span className="font-medium text-slate-900">{int.name}</span>
                  <span className={`text-xs font-medium ${int.status === "Available" ? "text-indigo-600" : "text-slate-400"}`}>
                    {int.status}
                  </span>
                </Link>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
