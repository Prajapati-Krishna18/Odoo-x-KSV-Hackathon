"use client";

import Link from "next/link";
import { ShieldX, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth, useDashboardPath } from "@/components/auth/auth-provider";

export default function ForbiddenPage() {
  const { user } = useAuth();
  const dashboard = useDashboardPath(user?.role);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-slate-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600">
        <ShieldX className="h-8 w-8" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-slate-900">Access Denied</h1>
      <p className="mt-3 max-w-md text-slate-500">
        You do not have permission to access this resource. Your account role does not
        include access to this module.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button href={dashboard}>Back to Dashboard</Button>
        <Button variant="secondary" href="mailto:admin@vendorbridge.io">
          <Mail className="h-4 w-4" />
          Contact Administrator
        </Button>
      </div>
      {user && (
        <p className="mt-6 text-sm text-slate-400">
          Signed in as {user.email}
        </p>
      )}
    </div>
  );
}
