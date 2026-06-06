import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { contracts } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ContractsPage() {
  return (
    <div>
      <PageHeader
        title="Contracts"
        description={`${contracts.length} active and historical agreements`}
        actions={<Button href="/vendors">Link to vendor</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {contracts.map((c) => (
          <Card key={c.id} href={`/contracts/${c.id}`}>
            <CardBody>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{c.title}</h3>
                  <Link href={`/vendors/${c.vendorId}`} className="mt-1 text-sm text-indigo-600 hover:underline">
                    {c.vendorName}
                  </Link>
                  <p className="mt-2 text-sm text-slate-500">
                    {c.type} · {formatCurrency(c.value)}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDate(c.startDate)} — {formatDate(c.endDate)}
                  </p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
