"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { useStore } from "@/lib/global-store";
import { CheckCircle } from "lucide-react";

export default function SignupPage() {
  const addAccessRequest = useStore((s) => s.addAccessRequest);
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [requestedRole, setRequestedRole] = useState("");
  const [reason, setReason] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    addAccessRequest({ firstName, lastName, email, organization, requestedRole, reason });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-emerald-100 p-4">
              <CheckCircle className="h-12 w-12 text-emerald-600" />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Request submitted</h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Your access request has been received. An administrator will review
            your details and grant access shortly. You&apos;ll be notified once
            your account is ready.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size="2xs" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Request access</h1>
          <p className="mt-2 text-sm text-slate-500">
            Fill in the details below and we&apos;ll set up your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">First name</label>
              <input
                type="text" required value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Last name</label>
              <input
                type="text" required value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Organization</label>
            <input
              type="text" required value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Role requested</label>
            <select
              required value={requestedRole}
              onChange={(e) => setRequestedRole(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a role...</option>
              <option value="admin">Administrator</option>
              <option value="procurement">Procurement Officer</option>
              <option value="manager">Manager</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Reason for access</label>
            <textarea
              rows={3} required value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Tell us why you need access..."
            />
          </div>
          <Button type="submit" className="w-full">
            Submit request
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
