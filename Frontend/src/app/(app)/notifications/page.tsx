"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useStore } from "@/lib/global-store";
import { useAuth } from "@/components/auth/auth-provider";
import { formatRelative } from "@/lib/utils";
import { AlertCircle, Info, CheckCircle, AlertTriangle } from "lucide-react";

const typeIcons = {
  alert: AlertCircle,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
};

const typeColors = {
  alert: "text-red-500 bg-red-50",
  info: "text-blue-500 bg-blue-50",
  success: "text-emerald-500 bg-emerald-50",
  warning: "text-orange-500 bg-orange-50",
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const notifications = useStore((s) => s.notifications);
  const markNotificationRead = useStore((s) => s.markNotificationRead);
  const markAllNotificationsRead = useStore((s) => s.markAllNotificationsRead);

  const userRole = user?.role || "admin";
  const userNotifications = notifications.filter((n) => n.targetRole === userRole || n.targetRole === "all");
  const unread = userNotifications.filter((n) => !n.read);

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={`${unread.length} unread notifications`}
        actions={
          unread.length > 0 ? (
            <Button variant="secondary" onClick={markAllNotificationsRead}>Mark all read</Button>
          ) : undefined
        }
      />

      <div className="mb-6 flex gap-2">
        <span className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">
          All ({userNotifications.length})
        </span>
        <span className="rounded-full border border-slate-200 px-4 py-1.5 text-sm font-medium text-slate-600">
          Unread ({unread.length})
        </span>
      </div>

      <div className="space-y-2">
        {userNotifications.length === 0 ? (
          <Card><CardBody><p className="text-center text-slate-500 py-8">No notifications yet. They will appear as you use the platform.</p></CardBody></Card>
        ) : (
          userNotifications.map((n) => {
            const Icon = typeIcons[n.type] || Info;
            return (
              <Card key={n.id}>
                <div onClick={() => markNotificationRead(n.id)} className="cursor-pointer">
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-2 ${typeColors[n.type] || "bg-slate-50 text-slate-500"}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-900">{n.title}</p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-indigo-500 shrink-0" />
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-slate-500">{n.message}</p>
                        <p className="mt-2 text-xs text-slate-400">{formatRelative(n.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {n.href && (
                          <Link href={n.href} className="text-xs font-medium text-indigo-600 hover:text-indigo-500" onClick={(e) => e.stopPropagation()}>
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
