import Link from "next/link";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { vendors } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function VendorsPage() {
  return (
    <div>
      <PageHeader
        title="Vendors"
        description={`${vendors.length} vendors in your network`}
        actions={<Button href="/vendors/new">Add vendor</Button>}
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Active", "At-risk", "Under review"].map((filter) => (
          <Link
            key={filter}
            href={filter === "All" ? "/vendors" : `/vendors?status=${filter.toLowerCase()}`}
            className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600"
          >
            {filter}
          </Link>
        ))}
      </div>

      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Spend YTD</th>
                <th className="px-6 py-3">Compliance</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/vendors/${v.id}`} className="group">
                      <p className="font-medium text-indigo-600 group-hover:underline">
                        {v.name}
                      </p>
                      <p className="text-xs text-slate-500">{v.location}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/catalog?category=${encodeURIComponent(v.category)}`} className="text-slate-600 hover:text-indigo-600">
                      {v.category}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {v.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-700">{formatCurrency(v.spendYtd)}</td>
                  <td className="px-6 py-4">
                    <Link
                      href="/compliance"
                      className={`font-medium ${v.complianceScore < 75 ? "text-orange-600" : "text-emerald-600"}`}
                    >
                      {v.complianceScore}%
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={v.status} href={`/vendors/${v.id}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
