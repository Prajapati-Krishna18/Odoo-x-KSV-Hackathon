import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Status } from "@/lib/data";

const statusStyles: Record<Status, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  approved: "bg-blue-50 text-blue-700 ring-blue-600/20",
  rejected: "bg-red-50 text-red-700 ring-red-600/20",
  draft: "bg-slate-100 text-slate-600 ring-slate-500/20",
  overdue: "bg-red-50 text-red-700 ring-red-600/20",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  open: "bg-sky-50 text-sky-700 ring-sky-600/20",
  closed: "bg-slate-100 text-slate-600 ring-slate-500/20",
  expired: "bg-orange-50 text-orange-700 ring-orange-600/20",
  review: "bg-violet-50 text-violet-700 ring-violet-600/20",
  compliant: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  "at-risk": "bg-orange-50 text-orange-700 ring-orange-600/20",
};

export function StatusBadge({
  status,
  href,
  className,
}: {
  status: Status;
  href?: string;
  className?: string;
}) {
  const badge = (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
        statusStyles[status],
        href && "hover:opacity-80 transition-opacity cursor-pointer",
        className
      )}
    >
      {status}
    </span>
  );

  if (href) {
    return <Link href={href}>{badge}</Link>;
  }
  return badge;
}

export function CountBadge({
  count,
  href,
}: {
  count: number;
  href?: string;
}) {
  const badge = (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-semibold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
  if (href) return <Link href={href}>{badge}</Link>;
  return badge;
}
