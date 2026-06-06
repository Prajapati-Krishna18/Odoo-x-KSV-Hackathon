"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  FileQuestion,
  Receipt,
  FileSignature,
  Package,
  BarChart3,
  ShieldCheck,
  Bell,
  MessageSquare,
  HelpCircle,
  Settings,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  CreditCard,
  Plug,
  Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { navItems, notifications, settingsNav } from "@/lib/data";
import { CountBadge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Building2,
  ShoppingCart,
  FileQuestion,
  Receipt,
  FileSignature,
  Package,
  BarChart3,
  ShieldCheck,
};

const unreadNotifications = notifications.filter((n) => !n.read).length;
const unreadMessages = 1;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const isSettings = pathname.startsWith("/settings");

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4">
          <Link href="/dashboard">
            <Logo size="sm" />
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-slate-600"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main
          </p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon];
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
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

          <p className="mb-2 mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Communication
          </p>
          <ul className="space-y-0.5">
            <li>
              <Link
                href="/messages"
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith("/messages")
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <span className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </span>
                {unreadMessages > 0 && <CountBadge count={unreadMessages} />}
              </Link>
            </li>
            <li>
              <Link
                href="/notifications"
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/notifications"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <span className="flex items-center gap-3">
                  <Bell className="h-4 w-4" />
                  Notifications
                </span>
                {unreadNotifications > 0 && (
                  <CountBadge count={unreadNotifications} />
                )}
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === "/help"
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <HelpCircle className="h-4 w-4" />
                Help & Support
              </Link>
            </li>
          </ul>
        </nav>

        <div className="border-t border-slate-100 p-3">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isSettings
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-4 lg:px-6">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/search"
            className="flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 hover:border-indigo-300 hover:text-slate-600 max-w-md transition-colors"
          >
            <Search className="h-4 w-4" />
            Search vendors, POs, invoices...
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/notifications"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </Link>

            <Link
              href="/messages"
              className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            >
              <MessageSquare className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500" />
              )}
            </Link>

            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  AR
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
                      <p className="text-sm font-semibold text-slate-900">Alex Rivera</p>
                      <p className="text-xs text-slate-500">alex.rivera@company.com</p>
                    </div>
                    <Link
                      href="/settings/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserOpen(false)}
                    >
                      <User className="h-4 w-4" /> Profile
                    </Link>
                    <Link
                      href="/settings/team"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserOpen(false)}
                    >
                      <Users className="h-4 w-4" /> Team
                    </Link>
                    <Link
                      href="/settings/billing"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserOpen(false)}
                    >
                      <CreditCard className="h-4 w-4" /> Billing
                    </Link>
                    <Link
                      href="/settings/integrations"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserOpen(false)}
                    >
                      <Plug className="h-4 w-4" /> Integrations
                    </Link>
                    <div className="border-t border-slate-100 mt-1">
                      <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => setUserOpen(false)}
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function SettingsSidebar() {
  const pathname = usePathname();
  return (
    <nav className="w-48 shrink-0">
      <ul className="space-y-0.5">
        {settingsNav.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
