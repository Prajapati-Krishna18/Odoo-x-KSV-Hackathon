"use client";

import { useState, useMemo } from "react";
import {
  Clock, FileQuestion, Building2, CheckCircle2, Receipt, Send, XCircle, Search,
  ShoppingCart, UserPlus, Settings, Shield,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { useStore } from "@/lib/global-store";

const iconMap: Record<string, React.ElementType> = {
  rfq_created: FileQuestion, quotation_submitted: Send, approval_requested: Clock,
  approved: CheckCircle2, rejected: XCircle, po_generated: Receipt,
  invoice_paid: Receipt, vendor_invited: Building2, vendor_onboarded: Building2,
  submitted_for_approval: Clock, created: FileQuestion, updated: Building2,
  deleted: XCircle, profile_updated: Settings, user_invited: UserPlus,
  settings_changed: Settings, po_created: ShoppingCart, invoice_overdue: Receipt,
};

const colorMap: Record<string, string> = {
  rfq_created: "text-indigo-600 bg-indigo-50", quotation_submitted: "text-blue-600 bg-blue-50",
  approval_requested: "text-amber-600 bg-amber-50", approved: "text-emerald-600 bg-emerald-50",
  rejected: "text-red-600 bg-red-50", po_generated: "text-cyan-600 bg-cyan-50",
  invoice_paid: "text-emerald-600 bg-emerald-50", vendor_invited: "text-purple-600 bg-purple-50",
  vendor_onboarded: "text-green-600 bg-green-50", submitted_for_approval: "text-blue-600 bg-blue-50",
  profile_updated: "text-slate-600 bg-slate-100", user_invited: "text-violet-600 bg-violet-50",
  settings_changed: "text-orange-600 bg-orange-50", po_created: "text-cyan-600 bg-cyan-50",
  invoice_overdue: "text-red-600 bg-red-50",
};

const actionLabels: Record<string, string> = {
  rfq_created: "RFQ Created", quotation_submitted: "Quotation Submitted",
  approval_requested: "Approval Requested", approved: "Approved",
  rejected: "Rejected", po_generated: "PO Generated",
  invoice_paid: "Invoice Paid", vendor_invited: "Vendor Invited",
  vendor_onboarded: "Vendor Onboarded", submitted_for_approval: "Submitted for Approval",
  profile_updated: "Profile Updated", user_invited: "User Invited",
  settings_changed: "Settings Changed", po_created: "PO Created",
  invoice_overdue: "Invoice Overdue",
};

const filterGroups = [
  { key: "all", label: "All Events", icon: Clock },
  { key: "approval", label: "Approvals", icon: CheckCircle2 },
  { key: "rfq", label: "RFQs", icon: FileQuestion },
  { key: "po", label: "POs", icon: ShoppingCart },
  { key: "invoice", label: "Invoices", icon: Receipt },
  { key: "vendor", label: "Vendors", icon: Building2 },
  { key: "user", label: "Users", icon: UserPlus },
  { key: "settings", label: "Settings", icon: Settings },
];

const actionGroupMap: Record<string, string[]> = {
  all: [],
  approval: ["approved", "rejected", "submitted_for_approval", "approval_requested"],
  rfq: ["rfq_created", "quotation_submitted"],
  po: ["po_created", "po_generated", "approved", "rejected", "submitted_for_approval"],
  invoice: ["invoice_paid", "invoice_overdue"],
  vendor: ["vendor_onboarded", "vendor_invited"],
  user: ["user_invited", "profile_updated"],
  settings: ["settings_changed"],
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

export default function Page() {
  const [filterGroup, setFilterGroup] = useState("all");
  const [search, setSearch] = useState("");
  const activities = useStore((s) => s.activities);

  const events = useMemo(() => {
    let list = [...activities];
    const allowed = actionGroupMap[filterGroup];
    if (filterGroup !== "all" && allowed) {
      list = list.filter((e) => allowed.includes(e.action));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) => e.entityName.toLowerCase().includes(q) || e.actorName.toLowerCase().includes(q) || actionLabels[e.action as keyof typeof actionLabels]?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activities, filterGroup, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof events> = {};
    events.forEach((e) => {
      const key = formatDate(e.timestamp);
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return groups;
  }, [events]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Timeline"
        description="Cross-role workflow events across the platform"
      />

      <div className="flex flex-wrap items-center gap-2">
        {filterGroups.map((fg) => {
          const Icon = fg.icon;
          return (
            <button
              key={fg.key}
              onClick={() => setFilterGroup(fg.key)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filterGroup === fg.key
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {fg.label}
            </button>
          );
        })}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text" placeholder="Search activity..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
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
                const label = actionLabels[ev.action as keyof typeof actionLabels] || ev.action.replace(/_/g, " ");
                return (
                  <div key={ev.id} className="relative">
                    <div className={`absolute -left-[2.15rem] rounded-full p-1.5 ${colors} ring-2 ring-white`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{label}</p>
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
                        }`}>{ev.status}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <Card>
            <CardBody>
              <div className="py-12 text-center">
                <Clock className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <p className="text-lg font-medium text-slate-600 mb-1">No activity events yet</p>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Activity is automatically generated as you use the platform. Try approving POs, creating RFQs, submitting quotations, or updating your profile to see events here.
                </p>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
