"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getAllPOsWithActionInfo } from "@/lib/workflow-store";

type StatusFilter = "all" | "approved" | "rejected";
type DateFilter = "all" | "today" | "week" | "month" | "custom";
type SortKey = "latest" | "oldest" | "highest" | "lowest";

export default function Page() {
  const allPOs = useMemo(() => getAllPOsWithActionInfo(), []);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [customDateStart, setCustomDateStart] = useState("");
  const [customDateEnd, setCustomDateEnd] = useState("");
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("latest");
  const [showFilters, setShowFilters] = useState(false);

  const vendorNames = useMemo(
    () => [...new Set(allPOs.map((p) => p.vendorName))].sort(),
    [allPOs]
  );

  const history = useMemo(() => {
    let list = allPOs.filter(
      (p) => p.effectiveStatus === "approved" || p.effectiveStatus === "rejected"
    );

    if (statusFilter === "approved") list = list.filter((p) => p.effectiveStatus === "approved");
    else if (statusFilter === "rejected") list = list.filter((p) => p.effectiveStatus === "rejected");

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

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.poNumber.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sort === "latest") return b.createdAt.localeCompare(a.createdAt);
      if (sort === "oldest") return a.createdAt.localeCompare(b.createdAt);
      if (sort === "highest") return b.amount - a.amount;
      if (sort === "lowest") return a.amount - b.amount;
      return 0;
    });

    return list;
  }, [allPOs, statusFilter, dateFilter, customDateStart, customDateEnd, vendorFilter, search, sort]);

  return (
    <div>
      <PageHeader
        title="Approval History"
        description="Past procurement decisions"
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
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="custom">Custom</option>
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
                <label className="block text-xs font-medium text-slate-500 mb-1">Vendor</label>
                <select
                  value={vendorFilter}
                  onChange={(e) => setVendorFilter(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="all">All</option>
                  {vendorNames.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
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
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="latest">Latest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Amount</option>
                  <option value="lowest">Lowest Amount</option>
                </select>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader title={`${history.length} decisions`} />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                  <th className="px-6 py-3">PO #</th>
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Decision</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Approved/Rejected By</th>
                  <th className="px-6 py-3">Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((po) => (
                  <tr key={po.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{po.poNumber}</td>
                    <td className="px-6 py-4 text-slate-700">{po.vendorName}</td>
                    <td className="px-6 py-4 font-medium">{formatCurrency(po.amount)}</td>
                    <td className="px-6 py-4"><StatusBadge status={po.effectiveStatus as any} /></td>
                    <td className="px-6 py-4 text-slate-500">
                      {po.actionTimestamp ? formatDate(po.actionTimestamp) : formatDate(po.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {po.actorName || "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={po.comments}>
                      {po.comments || "-"}
                    </td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      No approval history matches the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
