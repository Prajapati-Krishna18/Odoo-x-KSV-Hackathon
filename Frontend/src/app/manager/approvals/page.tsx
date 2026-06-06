"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, CheckCircle, XCircle, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAllPOsWithWorkflowStatus, approvePO, rejectPO, getPOStatus } from "@/lib/workflow-store";
import { setPendingToast } from "@/lib/approval-store";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/components/auth/auth-provider";

type StatusFilter = "all" | "pending" | "approved" | "rejected" | "draft";
type DateFilter = "all" | "today" | "week" | "month" | "custom";
type AmountFilter = "all" | "0-10k" | "10k-50k" | "50k-100k" | "100k+";
type SortField = "poNumber" | "amount" | "createdAt" | "vendorName";
type SortDir = "asc" | "desc";

const departments = ["Finance", "Operations", "Manufacturing", "Procurement", "IT", "R&D", "Admin", "Facilities"];

function SortHeader({
  field,
  label,
  onToggle,
}: {
  field: SortField;
  label: string;
  onToggle: (f: SortField) => void;
}) {
  return (
    <th
      className="px-6 py-3 cursor-pointer hover:text-slate-700 select-none"
      onClick={() => onToggle(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className="h-3 w-3" />
      </div>
    </th>
  );
}

export default function Page() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [allPOs, setAllPOs] = useState(() => getAllPOsWithWorkflowStatus());

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [amountFilter, setAmountFilter] = useState<AmountFilter>("all");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);

  const [approveModal, setApproveModal] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const vendorNames = useMemo(
    () => [...new Set(allPOs.map((p) => p.vendorName))].sort(),
    [allPOs]
  );

  const filtered = useMemo(() => {
    let list = [...allPOs];

    if (statusFilter !== "all") {
      list = list.filter((p) => p.effectiveStatus === statusFilter);
    }
    if (deptFilter !== "all") {
      list = list.filter((p) => p.department === deptFilter);
    }
    if (vendorFilter !== "all") {
      list = list.filter((p) => p.vendorName === vendorFilter);
    }

    const now = new Date();
    if (dateFilter === "today") {
      const today = now.toISOString().split("T")[0];
      list = list.filter((p) => p.createdAt === today);
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0];
      list = list.filter((p) => p.createdAt >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0];
      list = list.filter((p) => p.createdAt >= monthAgo);
    } else if (dateFilter === "custom" && customDateStart && customDateEnd) {
      list = list.filter((p) => p.createdAt >= customDateStart && p.createdAt <= customDateEnd);
    }

    if (amountFilter !== "all") {
      list = list.filter((p) => {
        if (amountFilter === "0-10k") return p.amount <= 10000;
        if (amountFilter === "10k-50k") return p.amount > 10000 && p.amount <= 50000;
        if (amountFilter === "50k-100k") return p.amount > 50000 && p.amount <= 100000;
        if (amountFilter === "100k+") return p.amount > 100000;
        return true;
      });
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.poNumber.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortField === "amount") cmp = a.amount - b.amount;
      else if (sortField === "createdAt") cmp = a.createdAt.localeCompare(b.createdAt);
      else if (sortField === "poNumber") cmp = a.poNumber.localeCompare(b.poNumber);
      else if (sortField === "vendorName") cmp = a.vendorName.localeCompare(b.vendorName);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [allPOs, statusFilter, deptFilter, vendorFilter, dateFilter, customDateStart, customDateEnd, amountFilter, search, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paged = filtered.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  const pendingPOs = allPOs.filter((p) => p.effectiveStatus === "pending");

  const refresh = () => setAllPOs(getAllPOsWithWorkflowStatus());

  const handleApprove = (poId: string) => {
    const name = user?.name || "Unknown";
    const role = user?.role || "manager";
    approvePO(poId, name, role);
    setPendingToast("Purchase Order Approved Successfully", "success");
    setApproveModal(null);
    showToast("PO approved — vendor and admin notified", "success");
    refresh();
  };

  const handleReject = (poId: string) => {
    if (!rejectReason.trim()) return;
    const name = user?.name || "Unknown";
    const role = user?.role || "manager";
    rejectPO(poId, name, role, rejectReason);
    setPendingToast("Purchase Order Rejected Successfully", "success");
    setRejectModal(null);
    setRejectReason("");
    showToast("PO rejected — vendor notification sent", "success");
    refresh();
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <div>
      <PageHeader
        title="Pending Approvals"
        description="Review and action procurement requests"
        actions={
          <Button variant="secondary" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        }
      />

      {showFilters && (
        <Card className="mb-6">
          <CardBody>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(0); }}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                <select
                  value={deptFilter}
                  onChange={(e) => { setDeptFilter(e.target.value); setPage(0); }}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Vendor</label>
                <select
                  value={vendorFilter}
                  onChange={(e) => { setVendorFilter(e.target.value); setPage(0); }}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  {vendorNames.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <select
                  value={dateFilter}
                  onChange={(e) => { setDateFilter(e.target.value as DateFilter); setPage(0); }}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>
              {dateFilter === "custom" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                    <input
                      type="date"
                      value={customDateStart}
                      onChange={(e) => setCustomDateStart(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
                    <input
                      type="date"
                      value={customDateEnd}
                      onChange={(e) => setCustomDateEnd(e.target.value)}
                      className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
                <select
                  value={amountFilter}
                  onChange={(e) => { setAmountFilter(e.target.value as AmountFilter); setPage(0); }}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="0-10k">$0 - $10K</option>
                  <option value="10k-50k">$10K - $50K</option>
                  <option value="50k-100k">$50K - $100K</option>
                  <option value="100k+">$100K+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="PO # or vendor..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                    className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div className="space-y-4 mb-8">
        {pendingPOs.length === 0 && (
          <p className="text-slate-500 text-center py-8">No pending approvals.</p>
        )}
        {pendingPOs.map((po) => (
          <Card key={po.id}>
            <CardBody>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900">{po.poNumber}</h3>
                  <p className="text-sm text-slate-500">{po.vendorName} · {po.department}</p>
                  <p className="mt-1 text-lg font-bold">{formatCurrency(po.amount)}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setApproveModal(po.id)}>Approve</Button>
                  <Button variant="danger" size="sm" onClick={() => { setRejectModal(po.id); setRejectReason(""); }}>Reject</Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader
          title="All Requests"
          action={
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>{filtered.length} results</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                  <SortHeader field="poNumber" label="PO #" onToggle={toggleSort} />
                  <SortHeader field="vendorName" label="Vendor" onToggle={toggleSort} />
                  <SortHeader field="amount" label="Amount" onToggle={toggleSort} />
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Status</th>
                  <SortHeader field="createdAt" label="Date" onToggle={toggleSort} />
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paged.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{po.poNumber}</td>
                    <td className="px-6 py-4 text-slate-700">{po.vendorName}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(po.amount)}</td>
                    <td className="px-6 py-4 text-slate-600">{po.department}</td>
                    <td className="px-6 py-4"><StatusBadge status={po.effectiveStatus} /></td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(po.createdAt)}</td>
                    <td className="px-6 py-4">
                      {po.effectiveStatus === "pending" ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => setApproveModal(po.id)}
                            className="rounded p-1 text-emerald-600 hover:bg-emerald-50"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => { setRejectModal(po.id); setRejectReason(""); }}
                            className="rounded p-1 text-red-600 hover:bg-red-50"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : po.effectiveStatus === "approved" ? (
                        <span className="text-xs text-emerald-600">Approved</span>
                      ) : (
                        <span className="text-xs text-red-600">Rejected</span>
                      )}
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">No requests match the selected filters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
            <span className="text-sm text-slate-500">
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {approveModal && (() => {
        const po = allPOs.find((p) => p.id === approveModal);
        if (!po) return null;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">Approve Purchase Order</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">PO Number</span><span className="font-medium">{po.poNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Vendor</span><span className="font-medium">{po.vendorName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-medium">{po.department}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold">{formatCurrency(po.amount)}</span></div>
              </div>
              <p className="mt-4 text-sm text-slate-600">Are you sure you want to approve this request?</p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setApproveModal(null)}>Cancel</Button>
                <Button onClick={() => handleApprove(po.id)}>Approve Request</Button>
              </div>
            </div>
          </div>
        );
      })()}

      {rejectModal && (() => {
        const po = allPOs.find((p) => p.id === rejectModal);
        if (!po) return null;
        const reasons = ["Budget Issue", "Vendor Issue", "Incomplete Information", "Policy Violation", "Other"];
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-slate-900">Reject Purchase Order</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">PO Number</span><span className="font-medium">{po.poNumber}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Vendor</span><span className="font-medium">{po.vendorName}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-bold">{formatCurrency(po.amount)}</span></div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Rejection Reason</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Select or type a reason..."
                  rows={3}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {reasons.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRejectReason(r)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                        rejectReason === r
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setRejectModal(null)}>Cancel</Button>
                <Button variant="danger" disabled={!rejectReason.trim()} onClick={() => handleReject(po.id)}>Reject</Button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
