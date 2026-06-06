"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { purchaseOrders, vendors } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import {
  paginate,
  sortItems,
  matchesAmountRange,
  matchesDateRange,
  type SortDir,
} from "@/lib/table-utils";
import { inputClass, selectClass } from "@/components/ui/form-field";

const STATUSES = ["all", "approved", "pending", "rejected", "draft"] as const;
const DEPARTMENTS = [...new Set(purchaseOrders.map((p) => p.department))];
const PAGE_SIZE = 5;

type SortKey = "poNumber" | "vendorName" | "department" | "amount" | "status" | "createdAt";

export function AdminApprovalsTable() {
  const [status, setStatus] = useState<string>("all");
  const [vendor, setVendor] = useState("all");
  const [department, setDepartment] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountRange, setAmountRange] = useState("all");
  const [searchId, setSearchId] = useState("");
  const [searchVendor, setSearchVendor] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...purchaseOrders];
    if (status !== "all") list = list.filter((p) => p.status === status);
    if (vendor !== "all") list = list.filter((p) => p.vendorId === vendor);
    if (department !== "all") list = list.filter((p) => p.department === department);
    if (amountRange !== "all") list = list.filter((p) => matchesAmountRange(p.amount, amountRange));
    list = list.filter((p) =>
      matchesDateRange(p.createdAt, dateRange, dateFrom, dateTo)
    );
    if (searchId) {
      const q = searchId.toLowerCase();
      list = list.filter((p) => p.poNumber.toLowerCase().includes(q));
    }
    if (searchVendor) {
      const q = searchVendor.toLowerCase();
      list = list.filter((p) => p.vendorName.toLowerCase().includes(q));
    }
    return sortItems(list, sortKey, sortDir);
  }, [status, vendor, department, dateRange, dateFrom, dateTo, amountRange, searchId, searchVendor, sortKey, sortDir]);

  const { items, total, totalPages, currentPage } = paginate(filtered, page, PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  }

  return (
    <div>
      <PageHeader title="Approvals" description={`${filtered.length} approval requests`} />

      <Card className="mb-6">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  status === s
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <select value={vendor} onChange={(e) => { setVendor(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all">All vendors</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
            <select value={department} onChange={(e) => { setDepartment(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all">All departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
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
              <option value="low">Low (&lt;$10k)</option>
              <option value="medium">Medium ($10k–$30k)</option>
              <option value="high">High (&gt;$30k)</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={inputClass} />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={inputClass} />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search approval ID (PO #)"
                value={searchId}
                onChange={(e) => { setSearchId(e.target.value); setPage(1); }}
                className={`${inputClass} pl-9`}
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search vendor"
                value={searchVendor}
                onChange={(e) => { setSearchVendor(e.target.value); setPage(1); }}
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                {([
                  ["poNumber", "PO #"],
                  ["vendorName", "Vendor"],
                  ["department", "Department"],
                  ["amount", "Amount"],
                  ["status", "Status"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-6 py-3">
                    <button
                      onClick={() => toggleSort(key)}
                      className="flex items-center gap-1 hover:text-indigo-600"
                    >
                      {label} <SortIcon col={key} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No approvals match your filters
                  </td>
                </tr>
              ) : (
                items.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <Link href={`/admin/purchase-orders/${po.id}`} className="font-medium text-indigo-600 hover:underline">
                        {po.poNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{po.vendorName}</td>
                    <td className="px-6 py-4">{po.department}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(po.amount)}</td>
                    <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Showing {items.length} of {total} results</span>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40 hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
