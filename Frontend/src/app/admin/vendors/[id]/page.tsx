"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { getRegisteredVendors, type VendorRegistration } from "@/lib/admin-store";
import { formatCurrency } from "@/lib/utils";

export default function AdminVendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorRegistration | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    params.then((p) => {
      const found = getRegisteredVendors().find((v) => v.id === p.id) ?? null;
      setVendor(found);
      setLoaded(true);
      if (!found) router.replace("/admin/vendors");
    });
  }, [params, router]);

  if (!loaded || !vendor) {
    return <div className="animate-pulse h-32 bg-slate-100 rounded-xl" />;
  }

  return (
    <div>
      <PageHeader
        title={vendor.name}
        description={vendor.vendorCode}
        breadcrumbs={[
          { label: "Vendors", href: "/admin/vendors" },
          { label: vendor.name },
        ]}
      />
      <Card>
        <CardBody>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="text-xs uppercase text-slate-400">Category</dt><dd className="mt-1">{vendor.category}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Type</dt><dd className="mt-1">{vendor.vendorType}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Contact</dt><dd className="mt-1">{vendor.contactPerson}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Email</dt><dd className="mt-1">{vendor.email}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Phone</dt><dd className="mt-1">{vendor.phone}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Priority</dt><dd className="mt-1">{vendor.priorityLevel}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Spend YTD</dt><dd className="mt-1">{formatCurrency(vendor.spendYtd)}</dd></div>
            <div><dt className="text-xs uppercase text-slate-400">Status</dt><dd className="mt-1"><StatusBadge status={vendor.status} /></dd></div>
            {vendor.gstNumber && <div><dt className="text-xs uppercase text-slate-400">GST</dt><dd className="mt-1">{vendor.gstNumber}</dd></div>}
            {vendor.addressLine && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase text-slate-400">Address</dt>
                <dd className="mt-1">{vendor.addressLine}, {vendor.city}, {vendor.state} {vendor.postalCode}</dd>
              </div>
            )}
          </dl>
        </CardBody>
      </Card>
    </div>
  );
}
