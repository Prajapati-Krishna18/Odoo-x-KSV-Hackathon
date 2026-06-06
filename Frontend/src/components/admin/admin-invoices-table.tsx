"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Download, FileSpreadsheet, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { invoices, vendors } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  paginate,
  sortItems,
  matchesAmountRange,
  matchesDateRange,
  type SortDir,
} from "@/lib/table-utils";
import { inputClass, selectClass } from "@/components/ui/form-field";
import { exportInvoicesPdf, exportInvoicesCsv } from "@/lib/export-pdf";
import { useToast } from "@/components/ui/toast";

const STATUSES = ["all", "pending", "approved", "paid", "rejected", "overdue"] as const;
const PAGE_SIZE = 5;
type SortKey = "invoiceNumber" | "vendorName" | "amount" | "dueDate" | "status";

export function AdminInvoicesTable() {
  const { showToast } = useToast();
  const [status, setStatus] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountRange, setAmountRange] = useState("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("dueDate");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...invoices];
    if (status !== "all") list = list.filter((i) => i.status === status);
    if (vendor !== "all") list = list.filter((i) => i.vendorId === vendor);
    if (amountRange !== "all") list = list.filter((i) => matchesAmountRange(i.amount, amountRange));
    list = list.filter((i) => matchesDateRange(i.issuedDate, dateRange, dateFrom, dateTo));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.vendorName.toLowerCase().includes(q)
      );
    }
    return sortItems(list, sortKey, sortDir);
  }, [status, vendor, dateRange, dateFrom, dateTo, amountRange, search, sortKey, sortDir]);

  const { items, total, totalPages, currentPage } = paginate(filtered, page, PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  }

  function handleExportPdf() {
    if (filtered.length === 0) {
      showToast("No invoices to export", "error");
      return;
    }
    exportInvoicesPdf(filtered);
    showToast(`Exported ${filtered.length} invoices to PDF`);
  }

  function handleExportCsv() {
    if (filtered.length === 0) {
      showToast("No invoices to export", "error");
      return;
    }
    exportInvoicesCsv(filtered);
    showToast(`Exported ${filtered.length} invoices to CSV`);
  }

  return (
    <div>
      <PageHeader
        title="Invoices"
        description={`${filtered.length} invoices`}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleExportCsv}>
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button size="sm" onClick={handleExportPdf}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        }
      />

      <Card className="mb-6">
        <CardBody className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize ${
                  status === s ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-600 hover:border-indigo-300"
                }`}
              >
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
              <option value="custom">Custom</option>
            </select>
            <select value={amountRange} onChange={(e) => { setAmountRange(e.target.value); setPage(1); }} className={selectClass}>
              <option value="all">All amounts</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search invoice or vendor"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className={`${inputClass} pl-9`}
              />
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
                  ["invoiceNumber", "Invoice #"],
                  ["vendorName", "Vendor"],
                  ["amount", "Amount"],
                  ["dueDate", "Due"],
                  ["status", "Status"],
                ] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="px-6 py-3">
                    <button onClick={() => toggleSort(key)} className="flex items-center gap-1 hover:text-indigo-600">
                      {label} <SortIcon col={key} />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <Link href={`/admin/invoices/${inv.id}`} className="font-medium text-indigo-600 hover:underline">
                      {inv.invoiceNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{inv.vendorName}</td>
                  <td className="px-6 py-4 font-medium">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-4 text-slate-500">{formatDate(inv.dueDate)}</td>
                  <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>{total} results</span>
        <div className="flex gap-2">
          <button disabled={currentPage <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Previous</button>
          <span>Page {currentPage} / {totalPages}</span>
          <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border px-3 py-1.5 disabled:opacity-40">Next</button>
        </div>
      </div>
    </div>
  );
}
