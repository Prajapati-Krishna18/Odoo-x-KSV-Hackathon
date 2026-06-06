"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useStore } from "@/lib/global-store";
import { useAuth } from "@/components/auth/auth-provider";
import { CheckCircle, XCircle, Clock, Search, ExternalLink } from "lucide-react";

export default function AccessRequestsPage() {
  const { user } = useAuth();
  const accessRequests = useStore((s) => s.accessRequests);
  const approveAccessRequest = useStore((s) => s.approveAccessRequest);
  const rejectAccessRequest = useStore((s) => s.rejectAccessRequest);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const filtered = accessRequests.filter((r) => {
    if (filter === "pending" && r.status !== "pending") return false;
    if (filter === "approved" && r.status !== "approved") return false;
    if (filter === "rejected" && r.status !== "rejected") return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.firstName.toLowerCase().includes(q) ||
        r.lastName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.organization.toLowerCase().includes(q)
      );
    }
    return true;
  });

  function handleApprove(id: string) {
    approveAccessRequest(id, user?.name || "Admin", user?.role || "admin");
  }

  function handleReject(id: string) {
    rejectAccessRequest(id, user?.name || "Admin", user?.role || "admin", rejectNote);
    setRejectModal(null);
    setRejectNote("");
  }

  const pendingCount = accessRequests.filter((r) => r.status === "pending").length;

  return (
    <div>
      <PageHeader
        title="Access Requests"
        description={`${pendingCount} pending requests`}
      />

      <div className="mb-4 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{accessRequests.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-1">Pending</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-emerald-600">{accessRequests.filter((r) => r.status === "approved").length}</p>
          <p className="text-xs text-slate-500 mt-1">Approved</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-red-600">{accessRequests.filter((r) => r.status === "rejected").length}</p>
          <p className="text-xs text-slate-500 mt-1">Rejected</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text" placeholder="Search by name, email, org..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          {filtered.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No access requests found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Organization</th>
                    <th className="px-6 py-3">Requested Role</th>
                    <th className="px-6 py-3 hidden lg:table-cell">Reason</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="px-6 py-4 text-slate-600">{r.email}</td>
                      <td className="px-6 py-4 text-slate-600">{r.organization}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize">
                          {r.requestedRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate hidden lg:table-cell" title={r.reason}>
                        {r.reason}
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          r.status === "pending"
                            ? "bg-amber-50 text-amber-700"
                            : r.status === "approved"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {r.status === "pending" ? <Clock className="h-3 w-3" /> : r.status === "approved" ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {r.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(r.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Approve
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => setRejectModal(r.id)}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            {r.reviewedBy ? `by ${r.reviewedBy}` : ""}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Reject Access Request</h3>
            <p className="mt-1 text-sm text-slate-500">
              Provide a reason for rejecting this request.
            </p>
            <textarea
              rows={3}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="Reason for rejection..."
              className="mt-4 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <div className="mt-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => { setRejectModal(null); setRejectNote(""); }}>
                Cancel
              </Button>
              <Button onClick={() => handleReject(rejectModal)}>
                Reject request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
