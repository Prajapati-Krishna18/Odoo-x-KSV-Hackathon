"use client";

import { useState, useMemo } from "react";
import { Clock, FileQuestion, Building2, CheckCircle2, Receipt, Send, XCircle, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { useStore } from "@/lib/global-store";
import Link from "next/link";

const iconMap: Record<string, React.ElementType> = {
  rfq_created: FileQuestion, quotation_submitted: Send, approval_requested: Clock,
  approved: CheckCircle2, rejected: XCircle, po_generated: Receipt,
  invoice_paid: Receipt, vendor_invited: Building2, vendor_onboarded: Building2,
  submitted_for_approval: Clock, created: FileQuestion, updated: Building2,
  deleted: XCircle,
};

const colorMap: Record<string, string> = {
  rfq_created: "text-indigo-600 bg-indigo-50", quotation_submitted: "text-blue-600 bg-blue-50",
  approval_requested: "text-amber-600 bg-amber-50", approved: "text-emerald-600 bg-emerald-50",
  rejected: "text-red-600 bg-red-50", po_generated: "text-cyan-600 bg-cyan-50",
  invoice_paid: "text-emerald-600 bg-emerald-50", vendor_invited: "text-purple-600 bg-purple-50",
  vendor_onboarded: "text-green-600 bg-green-50", submitted_for_approval: "text-blue-600 bg-blue-50",
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return "Today";
  if (diff < 172800000) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type ActionFilter = "all" | "approved" | "rejected" | "rfq_created" | "quotation_submitted" | "approved" | "rejected";

export default function Page() {
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const activities = useStore((s) => s.activities);

  const events = useMemo(() => {
    let list = [...activities];
    if (actionFilter !== "all") list = list.filter((e) => e.action === actionFilter);
    if (search) { const q = search.toLowerCase(); list = list.filter((e) => e.entityName.toLowerCase().includes(q) || e.actorName.toLowerCase().includes(q)); }
    return list;
  }, [activities, actionFilter, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    events.forEach((e) => { const key = formatDate(e.timestamp); if (!groups[key]) groups[key] = []; groups[key].push(e); });
    return groups;
  }, [events]);

  return (
    <div className="space-y-6">
      <PageHeader title="Activity Timeline" description="Cross-role workflow events across the platform" />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white">
          <option value="all">All Events</option>
          <option value="approved">Approvals</option>
          <option value="rejected">Rejections</option>
          <option value="rfq_created">RFQ Created</option>
          <option value="quotation_submitted">Quotations</option>
          <option value="submitted_for_approval">Submit for Approval</option>
          <option value="invoice_paid">Invoice Paid</option>
        </select>
        <span className="text-sm text-slate-500">{events.length} events</span>
      </div>
      <div className="space-y-8">
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date}>
            <h3 className="text-sm font-semibold text-slate-500 mb-4 sticky top-0 bg-slate-50 py-2 z-10">{date}</h3>
            <div className="relative pl-8 border-l-2 border-slate-200 space-y-6">
              {dayEvents.map((ev) => {
                const Icon = iconMap[ev.action as keyof typeof iconMap] || Clock;
                const colors = colorMap[ev.action as keyof typeof colorMap] || "text-slate-600 bg-slate-50";
                return (
                  <div key={ev.id} className="relative">
                    <div className={`absolute -left-[2.15rem] rounded-full p-1.5 ${colors} ring-2 ring-white`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 capitalize">{ev.action.replace(/_/g, " ")}</p>
                          <p className="text-sm text-slate-500 mt-0.5">{ev.entityName} &middot; {ev.entityType.toUpperCase()}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {ev.actorName}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(ev.timestamp)}</span>
                          </div>
                          {ev.comments && <p className="text-xs text-slate-500 mt-1.5 italic">&ldquo;{ev.comments}&rdquo;</p>}
                          {ev.amount && <p className="text-xs text-slate-500 mt-1">Amount: ${ev.amount.toLocaleString()}</p>}
                        </div>
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          ev.action === "approved" ? "bg-emerald-50 text-emerald-700" :
                          ev.action === "rejected" ? "bg-red-50 text-red-700" : "bg-slate-100 text-slate-600"
                        }`}>{ev.action === "approved" || ev.action === "rejected" ? ev.action : ev.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <Card><CardBody><p className="text-center text-slate-500 py-8">No activity events yet. Perform actions like approving POs, creating RFQs, or submitting quotations to see them here.</p></CardBody></Card>
        )}
      </div>
    </div>
  );
}
