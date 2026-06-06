"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  FileQuestion,
  Receipt,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Users,
  CheckSquare,
  ScrollText,
  PlusCircle,
  FileText,
  History,
  ShieldAlert,
  Send,
  Bell,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ROLE_NAV } from "@/lib/auth/permissions";
import { ROLE_LABELS, type UserRole } from "@/lib/auth/types";
import { useAuth } from "@/components/auth/auth-provider";
import { useStore } from "@/lib/global-store";

const notifIconMap: Record<string, React.ElementType> = {
  success: CheckCircle2, info: FileQuestion, alert: AlertTriangle, warning: Activity,
};

const notifColorMap: Record<string, string> = {
  success: "text-emerald-600 bg-emerald-50", info: "text-indigo-600 bg-indigo-50",
  alert: "text-red-600 bg-red-50", warning: "text-amber-600 bg-amber-50",
};

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  FileQuestion,
  Receipt,
  BarChart3,
  Settings,
  Users,
  CheckSquare,
  ScrollText,
  PlusCircle,
  FileText,
  History,
  ShieldAlert,
  Send,
  User,
};

interface RoleShellProps {
  role: UserRole;
  children: React.ReactNode;
}

export function RoleShell({ role, children }: RoleShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const allNotifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);
  const profile = useStore((s) => s.profile);
  const displayName = profile?.firstName ? `${profile.firstName} ${profile.lastName}` : (user?.name || "");
  const displayEmail = profile?.email || user?.email || "";
  const initials = profile?.firstName
    ? (profile.firstName[0] + (profile.lastName?.[0] || "")).toUpperCase()
    : (user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U");

  const notifCount = allNotifications.filter((n) => !n.read && (n.targetRole === role || n.targetRole === "all")).length;
  const notifications = allNotifications.filter((n) => n.targetRole === role || n.targetRole === "all").slice(0, 10);

  const navItems = ROLE_NAV[role];
  const dashboardHref = navItems[0].href;

  return (
    <div className="flex min-h-screen bg-slate-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <Link href={dashboardHref}>
            <Logo size="sm" />
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {ROLE_LABELS[role]}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const active =
                pathname === item.href ||
                (item.href !== dashboardHref && pathname.startsWith(item.href));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1" />

          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {notifCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white ring-2 ring-white">
                  {notifCount > 9 ? "9+" : notifCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white shadow-lg">
                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                    <div className="flex gap-2">
                      {notifCount > 0 && (
                        <button onClick={markAllNotificationsRead} className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                          Mark all read
                        </button>
                      )}
                      <Link href="/activity" onClick={() => setNotifOpen(false)} className="text-xs font-medium text-slate-500 hover:text-slate-700">
                        View all
                      </Link>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</p>
                    ) : (
                      notifications.map((n) => {
                        const Icon = notifIconMap[n.type] || Bell;
                        const colors = notifColorMap[n.type] || "text-slate-600 bg-slate-50";
                        return (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                            className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${!n.read ? "bg-indigo-50/30" : ""}`}
                          >
                            <div className={`rounded-lg p-1.5 ${colors} shrink-0 mt-0.5`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!n.read ? "font-semibold text-slate-900" : "text-slate-700"}`}>{n.message}</p>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                              </p>
                            </div>
                            {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0 mt-2" />}
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {initials}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-slate-900">{displayName}</p>
                <p className="text-xs text-slate-500">{ROLE_LABELS[role]}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block" />
            </button>
            {userOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setUserOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{displayName}</p>
                    <p className="text-xs text-slate-500">{displayEmail}</p>
                  </div>
                  {role === "vendor" && (
                    <Link
                      href="/vendor/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserOpen(false)}
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  )}
                  <Link
                    href={`/${role}/settings`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setUserOpen(false)}
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <div className="border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        logout();
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
