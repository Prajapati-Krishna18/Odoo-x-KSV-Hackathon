"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useStore } from "@/lib/global-store";
import { useAuth } from "@/components/auth/auth-provider";
import { formatRelative } from "@/lib/utils";
import {
  AlertCircle, Info, CheckCircle, AlertTriangle,
  Search, CheckCheck, Trash2, Archive, Eye, EyeOff,
} from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  alert: AlertCircle, info: Info, success: CheckCircle, warning: AlertTriangle,
};

const typeColors: Record<string, string> = {
  alert: "text-red-500 bg-red-50", info: "text-blue-500 bg-blue-50",
  success: "text-emerald-500 bg-emerald-50", warning: "text-orange-500 bg-orange-50",
};

const categoryFilters = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "read", label: "Read" },
  { key: "rfq", label: "RFQs" },
  { key: "approval", label: "Approvals" },
  { key: "invoice", label: "Invoices" },
  { key: "vendor", label: "Vendors" },
  { key: "system", label: "System" },
];

function matchesCategory(n: { title: string; type: string; read: boolean }, cat: string) {
  const t = n.title.toLowerCase();
  switch (cat) {
    case "all": return true;
    case "unread": return !n.read;
    case "read": return n.read;
    case "rfq": return t.includes("rfq");
    case "approval": return t.includes("approved") || t.includes("rejected") || t.includes("approval") || t.includes("submitted");
    case "invoice": return t.includes("invoice") || t.includes("payment") || t.includes("overdue");
    case "vendor": return t.includes("vendor") || t.includes("created");
    case "system": return t.includes("profile") || t.includes("settings") || t.includes("invited") || t.includes("user");
    default: return true;
  }
}

const PAGE_SIZE = 10;

export default function NotificationsPage() {
  const { user } = useAuth();
  const notifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);
  const addNotification = useStore((s) => s.addNotification);

  const userRole = user?.role || "admin";
  const userNotifications = useMemo(
    () => notifications.filter((n) => n.targetRole === userRole || n.targetRole === "all"),
    [notifications, userRole]
  );

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let list = userNotifications.filter((n) => matchesCategory(n, filter));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
    }
    return list;
  }, [userNotifications, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const unread = userNotifications.filter((n) => !n.read);
  const alerts = userNotifications.filter((n) => n.type === "alert" && !n.read);
  const completed = userNotifications.filter((n) => n.read);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === paged.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((n) => n.id)));
    }
  }

  function markSelectedRead() {
    selected.forEach((id) => markNotificationRead(id));
    setSelected(new Set());
  }

  function archiveSelected() {
    selected.forEach((id) => {
      addNotification({
        title: "Notification Archived",
        message: `Notification archived`,
        type: "info",
        targetRole: userRole,
        read: true,
        href: "/notifications",
      });
    });
    setSelected(new Set());
  }

  function deleteSelected() {
    setSelected(new Set());
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unread.length} unread out of ${userNotifications.length} total`}
        actions={
          unread.length > 0 && filter !== "read" ? (
            <div className="flex gap-2">
              {selected.size > 0 && (
                <>
                  <Button variant="secondary" size="sm" onClick={markSelectedRead}>
                    <CheckCheck className="h-4 w-4 mr-1" /> Mark read
                  </Button>
                  <Button variant="secondary" size="sm" onClick={archiveSelected}>
                    <Archive className="h-4 w-4 mr-1" /> Archive
                  </Button>
                  <Button variant="secondary" size="sm" onClick={deleteSelected}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </>
              )}
              <Button variant="secondary" size="sm" onClick={markAllNotificationsRead}>
                <CheckCheck className="h-4 w-4 mr-1" /> Mark all read
              </Button>
            </div>
          ) : undefined
        }
      />

      <div className="mb-6 grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-slate-900">{userNotifications.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-indigo-600">{unread.length}</p>
          <p className="text-xs text-slate-500 mt-1">Unread</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-red-500">{alerts.length}</p>
          <p className="text-xs text-slate-500 mt-1">Alerts</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-2xl font-bold text-emerald-600">{completed.length}</p>
          <p className="text-xs text-slate-500 mt-1">Completed</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {categoryFilters.map((cat) => (
          <button
            key={cat.key}
            onClick={() => { setFilter(cat.key); setPage(1); setSelected(new Set()); }}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === cat.key
                ? "bg-indigo-600 text-white"
                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {cat.label}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text" placeholder="Search notifications..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-56 rounded-lg border border-slate-200 bg-white py-1.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <Card>
        <CardBody className="p-0">
          {paged.length === 0 ? (
            <p className="text-center text-slate-500 py-12">No notifications match your filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={paged.length > 0 && selected.size === paged.length}
                        onChange={toggleSelectAll}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 hidden lg:table-cell">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paged.map((n) => {
                    const Icon = typeIcons[n.type] || Info;
                    return (
                      <tr key={n.id}
                        onClick={() => { if (!n.read) { markNotificationRead(n.id); } }}
                        className={`transition-colors cursor-pointer ${
                          !n.read ? "bg-indigo-50/20" : ""
                        } hover:bg-slate-50`}
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(n.id)}
                            onChange={() => toggleSelect(n.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className={`rounded-lg p-1.5 w-fit ${typeColors[n.type] || "bg-slate-50 text-slate-500"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${!n.read ? "text-slate-900" : "text-slate-600"}`}>{n.title}</span>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 hidden md:table-cell max-w-[240px] truncate">{n.message}</td>
                        <td className="px-4 py-3 text-slate-400 hidden lg:table-cell whitespace-nowrap">{formatRelative(n.createdAt)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            n.read ? "bg-slate-100 text-slate-600" : "bg-indigo-100 text-indigo-700"
                          }`}>
                            {n.read ? "Read" : "New"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            {!n.read ? (
                              <button onClick={() => markNotificationRead(n.id)}
                                className="rounded p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="Mark read">
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                            ) : null}
                            {n.href && (
                              <Link href={n.href}
                                className="rounded p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                title="View details">
                                <EyeOff className="h-3.5 w-3.5" />
                              </Link>
                            )}
                            <button
                              className="rounded p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
