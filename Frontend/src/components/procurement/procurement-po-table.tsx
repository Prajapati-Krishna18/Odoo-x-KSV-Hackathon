"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search, Send, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { vendors } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useStore } from "@/lib/global-store";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/components/ui/toast";
import {
  paginate,
  sortItems,
  matchesDateRange,
  matchesProcurementAmountRange,
  type SortDir,
} from "@/lib/table-utils";
import { inputClass, selectClass } from "@/components/ui/form-field";

const STATUSES = ["all", "approved", "pending", "draft", "rejected"] as const;
const PAGE_SIZE = 5;
type SortKey = "poNumber" | "vendorName" | "amount" | "status" | "dueDate";

function ConfirmModal({ open, onClose, onConfirm, title, children }: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
        <div className="text-sm text-slate-600 mb-6">{children}</div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export function ProcurementPOTable() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const purchaseOrders = useStore((s) => s.purchaseOrders);
  const submitPOForApproval = useStore((s) => s.submitPOForApproval);
  const deletePO = useStore((s) => s.deletePO);

  const [status, setStatus] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountRange, setAmountRange] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const [submitTarget, setSubmitTarget] = useState<{ id: string; poNumber: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; poNumber: string } | null>(null);

  const filtered = useMemo(() => {
    let list = [...purchaseOrders];
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (vendor !== "all") list = list.filter((p) => p.vendorId === vendor);
    if (amountRange !== "all") list = list.filter((p) => matchesProcurementAmountRange(p.amount, amountRange));
    list = list.filter((p) => matchesDateRange(p.createdAt, dateRange, dateFrom, dateTo));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.poNumber.toLowerCase().includes(q) || p.vendorName.toLowerCase().includes(q));
    }
    return sortItems(list, sortKey, sortDir);
  }, [purchaseOrders, status, vendor, dateRange, dateFrom, dateTo, amountRange, search, sortKey, sortDir]);

  const { items, total, totalPages, currentPage } = paginate(filtered, page, PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  }

  const actorName = user?.name || "Procurement Officer";
  const actorRole = user?.role || "procurement";

  return (
    <div>
      <PageHeader title="Purchase Orders" description={`${filtered.length} purchase orders`} actions={<Button href="/procurement/purchase-orders/create">Create PO</Button>} />

      <ConfirmModal open={!!submitTarget} onClose={() => setSubmitTarget(null)} onConfirm={() => { submitPOForApproval(submitTarget!.id, actorName, actorRole); showToast(`PO ${submitTarget!.poNumber} submitted for approval`); setSubmitTarget(null); }} title="Submit for Approval">
        <p>Submit <strong>{submitTarget?.poNumber}</strong> for manager approval?</p>
        <p className="text-slate-500 mt-1">Status will change from Draft to Pending.</p>
      </ConfirmModal>

      <ConfirmModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => { deletePO(deleteTarget!.id, actorName, actorRole); showToast(`Draft ${deleteTarget!.poNumber} deleted`, "info"); setDeleteTarget(null); }} title="Delete Draft">
        <p>Permanently delete draft <strong>{deleteTarget?.poNumber}</strong>?</p>
        <p className="text-slate-500 mt-1">This action cannot be undone.</p>
      </ConfirmModal>

      <Card className="mb-6">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${status === s ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                {s}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select value={vendor} onChange={(e) => { setVendor(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all">All vendors</option>
              {vendors.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
            <select value={dateRange} onChange={(e) => { setDateRange(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all">All dates</option>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="custom">Custom range</option>
            </select>
            <select value={amountRange} onChange={(e) => { setAmountRange(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all">All amounts</option>
              <option value="0-10k">$0 &ndash; $10K</option>
              <option value="10k-50k">$10K &ndash; $50K</option>
              <option value="50k-100k">$50K &ndash; $100K</option>
              <option value="100k+">$100K+</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search PO # or vendor" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className={`${inputClass} pl-9`} />
            </div>
          </div>
          {dateRange === "custom" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase text-slate-500">
                {([
                  ["poNumber", "PO #"],
                  ["vendorName", "Vendor"],
                  ["amount", "Amount"],
                  ["status", "Status"],
                  ["dueDate", "Due"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-6 py-3">
                    <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-indigo-600">
                      {label} <SortIcon col={key} />
                    </button>
                  </th>
                ))}
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">No purchase orders match your filters</td></tr>
              ) : (
                items.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link href={`/procurement/purchase-orders/${po.id}`} className="font-medium text-indigo-600 hover:underline">{po.poNumber}</Link>
                    </td>
                    <td className="px-6 py-4">{po.vendorName}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(po.amount)}</td>
                    <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(po.dueDate)}</td>
                    <td className="px-6 py-4 text-right">
                      {po.status === "draft" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/procurement/purchase-orders/${po.id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100">
                            Edit
                          </Link>
                          <button onClick={() => setSubmitTarget({ id: po.id, poNumber: po.poNumber })}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100">
                            <Send className="h-3.5 w-3.5" /> Submit
                          </button>
                          <button onClick={() => setDeleteTarget({ id: po.id, poNumber: po.poNumber })}
                            className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100">
                            Delete
                          </button>
                        </div>
                      ) : (
                        <Link href={`/procurement/purchase-orders/${po.id}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100">
                          View Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Showing {items.length} of {total} results</span>
        <div className="flex gap-2">
          <button disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-slate-50">Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </div>
  );
}
