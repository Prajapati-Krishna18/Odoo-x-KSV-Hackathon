import Link from "next/link";
import { AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { vendors, contracts } from "@/lib/data";

export default function CompliancePage() {
  const atRisk = vendors.filter((v) => v.complianceScore < 75 || v.status === "at-risk");
  const compliant = vendors.filter((v) => v.complianceScore >= 90);
  const expiringContracts = contracts.filter((c) => c.status === "active" || c.status === "expired");

  return (
    <div>
      <PageHeader
        title="Compliance Hub"
        description="Monitor vendor certifications, risk scores, and contract compliance"
        actions={<Button href="/vendors/new">Onboard vendor</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card href="/vendors">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-50 p-3 text-emerald-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{compliant.length}</p>
              <p className="text-sm text-slate-500">Fully compliant vendors</p>
            </div>
          </CardBody>
        </Card>
        <Card href="/vendors/v5">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-lg bg-orange-50 p-3 text-orange-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{atRisk.length}</p>
              <p className="text-sm text-slate-500">Require review</p>
            </div>
          </CardBody>
        </Card>
        <Card href="/contracts">
          <CardBody className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{expiringContracts.length}</p>
              <p className="text-sm text-slate-500">Contracts tracked</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Vendors requiring review"
            action={<Button variant="ghost" size="sm" href="/vendors">View all</Button>}
          />
          <CardBody className="space-y-3">
            {atRisk.map((v) => (
              <Link
                key={v.id}
                href={`/vendors/${v.id}`}
                className="flex items-center justify-between rounded-lg border border-orange-100 bg-orange-50/50 p-4 hover:border-orange-200"
              >
                <div>
                  <p className="font-medium text-slate-900">{v.name}</p>
                  <p className="text-sm text-slate-500">Score: {v.complianceScore}%</p>
                </div>
                <StatusBadge status={v.status} />
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Compliance checklist" />
          <CardBody className="space-y-3">
            {[
              { label: "Insurance certificates", done: 5, total: 6, href: "/vendors" },
              { label: "ISO certifications", done: 4, total: 6, href: "/vendors/v1" },
              { label: "Tax documentation", done: 6, total: 6, href: "/vendors" },
              { label: "Contract renewals", done: 2, total: 4, href: "/contracts" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between rounded-lg p-3 hover:bg-slate-50"
              >
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className={`text-sm font-medium ${item.done === item.total ? "text-emerald-600" : "text-orange-600"}`}>
                  {item.done}/{item.total}
                </span>
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
