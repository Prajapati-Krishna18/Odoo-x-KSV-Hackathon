import Link from "next/link";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) {
  const classes = cn(
    "rounded-xl border border-slate-200 bg-white shadow-sm",
    href && "hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer",
    className
  );

  if (href) {
    return <Link href={href} className={cn(classes, "block")}>{children}</Link>;
  }
  return <div className={classes}>{children}</div>;
}

export function CardHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="mt-0.5 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  change,
  href,
  icon,
}: {
  label: string;
  value: string;
  change?: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Card href={href} className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {change && (
            <p className="mt-1 text-sm text-emerald-600">{change}</p>
          )}
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">{icon}</div>
      </div>
    </Card>
  );
}
