"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getRegisteredVendors, type VendorRegistration } from "@/lib/admin-store";
import { formatCurrency } from "@/lib/utils";

export function AdminVendorsList() {
  const [list, setList] = useState<VendorRegistration[]>([]);

  useEffect(() => {
    setList(getRegisteredVendors());
  }, []);

  return (
    <div>
      <PageHeader
        title="Vendors"
        description={`${list.length} vendors in the network`}
        actions={<Button href="/admin/vendors/new">Add vendor</Button>}
      />
      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Rating</th>
                <th className="px-6 py-3">Spend YTD</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/vendors/${v.id}`} className="font-medium text-indigo-600 hover:underline">
                      {v.name}
                    </Link>
                    <p className="text-xs text-slate-500">{v.location}</p>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{v.vendorCode}</td>
                  <td className="px-6 py-4 text-slate-600">{v.category}</td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {v.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(v.spendYtd)}</td>
                  <td className="px-6 py-4"><StatusBadge status={v.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
