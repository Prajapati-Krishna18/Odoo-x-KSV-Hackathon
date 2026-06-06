"use client";

import { useState, useMemo } from "react";
import { Search, Download, CheckCircle, XCircle, FileQuestion } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { useStore } from "@/lib/global-store";
import type { AuditEntry } from "@/lib/global-store";

type DateRange = "all" | "today" | "week" | "month";
type RoleFilter = "all" | "admin" | "manager" | "procurement" | "vendor";

function formatTimestamp(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

export default function Page() {
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const auditLogs = useStore((s) => s.auditLogs);

  const events = useMemo(() => {
    let list = [...auditLogs];
    if (roleFilter !== "all") list = list.filter((e) => e.actorRole === roleFilter);
    if (actionFilter !== "all") list = list.filter((e) => e.action === actionFilter);
    const now = new Date();
    if (dateRange === "today") { const t = now.toISOString().split("T")[0]; list = list.filter((e) => e.timestamp.startsWith(t)); }
    else if (dateRange === "week") { const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString(); list = list.filter((e) => e.timestamp >= weekAgo); }
    else if (dateRange === "month") { const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString(); list = list.filter((e) => e.timestamp >= monthAgo); }
    if (search) { const q = search.toLowerCase(); list = list.filter((e) => e.actorName.toLowerCase().includes(q) || e.entityName.toLowerCase().includes(q) || e.entityId.toLowerCase().includes(q)); }
    return list;
  }, [auditLogs, dateRange, roleFilter, actionFilter, search]);

  const exportData = (format: "csv" | "json") => {
    const data = events.map((e) => ({ Timestamp: formatTimestamp(e.timestamp), User: e.actorName, Role: e.actorRole, Action: e.action, EntityType: e.entityType, EntityID: e.entityId, Status: e.status, "IP Address": e.ipAddress }));
    if (format === "json") {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "audit-logs.json"; a.click(); URL.revokeObjectURL(url);
    } else {
      const headers = Object.keys(data[0] || {});
      const csv = headers.join(",") + "\n" + data.map((r) => headers.map((h) => `"${(r as any)[h]}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "audit-logs.csv"; a.click(); URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="Complete audit trail of all platform activities"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => exportData("csv")}><Download className="h-4 w-4" /> CSV</Button>
            <Button variant="secondary" size="sm" onClick={() => exportData("json")}><Download className="h-4 w-4" /> JSON</Button>
          </div>
        }
      />
      <Card>
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Date Range</label>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value as DateRange)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Role</label>
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as RoleFilter)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="procurement">Procurement</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Action Type</label>
              <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                <option value="all">All Actions</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="rfq_created">RFQ Created</option>
                <option value="quotation_submitted">Quotation Submitted</option>
                <option value="submitted_for_approval">Submitted for Approval</option>
                <option value="invoice_paid">Invoice Paid</option>
                <option value="created">Created</option>
              </select>
            </div>
            <div className="lg:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" placeholder="User, entity, or ID..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm" />
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title={`${events.length} audit entries`} />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Action</th>
                <th className="px-6 py-3">Entity Type</th>
                <th className="px-6 py-3">Entity ID</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-600 whitespace-nowrap">{formatTimestamp(ev.timestamp)}</td>
                  <td className="px-6 py-3 font-medium text-slate-900">{ev.actorName}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 capitalize">{ev.actorRole}</span>
                  </td>
                  <td className="px-6 py-3">
                    <span className="flex items-center gap-1.5 text-slate-700 capitalize">
                      {ev.action === "approved" && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                      {ev.action === "rejected" && <XCircle className="h-3.5 w-3.5 text-red-500" />}
                      {ev.action === "rfq_created" && <FileQuestion className="h-3.5 w-3.5 text-indigo-500" />}
                      {ev.action.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-600 uppercase text-xs font-medium">{ev.entityType}</td>
                  <td className="px-6 py-3 text-slate-500 font-mono text-xs">{ev.entityId}</td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      ev.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                      ev.status === "rejected" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
                    }`}>{ev.status}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-400 font-mono text-xs">{ev.ipAddress}</td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={8} className="px-6 py-8 text-center text-slate-500">No audit entries match the selected filters.</td></tr>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
