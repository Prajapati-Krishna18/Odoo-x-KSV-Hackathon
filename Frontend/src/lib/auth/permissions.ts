import type { UserRole } from "./types";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export const ROLE_NAV: Record<UserRole, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
    { label: "Users", href: "/admin/users", icon: "Users" },
    { label: "Access Requests", href: "/admin/users/access-requests", icon: "User" },
    { label: "Vendors", href: "/admin/vendors", icon: "Building2" },
    { label: "RFQs", href: "/admin/rfqs", icon: "FileQuestion" },
    { label: "Approvals", href: "/admin/approvals", icon: "CheckSquare" },
    { label: "Purchase Orders", href: "/admin/purchase-orders", icon: "ShoppingCart" },
    { label: "Invoices", href: "/admin/invoices", icon: "Receipt" },
    { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
    { label: "System Logs", href: "/admin/system-logs", icon: "ScrollText" },
    { label: "Settings", href: "/admin/settings", icon: "Settings" },
  ],
  procurement: [
    { label: "Dashboard", href: "/procurement/dashboard", icon: "LayoutDashboard" },
    { label: "Create RFQ", href: "/procurement/create-rfq", icon: "PlusCircle" },
    { label: "RFQs", href: "/procurement/rfqs", icon: "FileQuestion" },
    { label: "Quotations", href: "/procurement/quotations", icon: "FileText" },
    { label: "Vendor Intelligence", href: "/procurement/vendor-intelligence", icon: "Building2" },
    { label: "Purchase Orders", href: "/procurement/purchase-orders", icon: "ShoppingCart" },
    { label: "Invoices", href: "/procurement/invoices", icon: "Receipt" },
    { label: "Analytics", href: "/procurement/analytics", icon: "BarChart3" },
    { label: "Settings", href: "/procurement/settings", icon: "Settings" },
  ],
  manager: [
    { label: "Dashboard", href: "/manager/dashboard", icon: "LayoutDashboard" },
    { label: "Approvals", href: "/manager/approvals", icon: "CheckSquare" },
    { label: "Approval History", href: "/manager/approval-history", icon: "History" },
    { label: "Risk Center", href: "/manager/risk-center", icon: "ShieldAlert" },
    { label: "Analytics", href: "/manager/analytics", icon: "BarChart3" },
    { label: "Settings", href: "/manager/settings", icon: "Settings" },
  ],
  vendor: [
    { label: "Dashboard", href: "/vendor/dashboard", icon: "LayoutDashboard" },
    { label: "RFQs", href: "/vendor/rfqs", icon: "FileQuestion" },
    { label: "Submit Quotation", href: "/vendor/submit-quotation", icon: "Send" },
    { label: "Purchase Orders", href: "/vendor/purchase-orders", icon: "ShoppingCart" },
    { label: "Analytics", href: "/vendor/analytics", icon: "BarChart3" },
    { label: "Profile", href: "/vendor/profile", icon: "User" },
    { label: "Settings", href: "/vendor/settings", icon: "Settings" },
  ],
};

/** Paths that require authentication (legacy + role-prefixed) */
export const PROTECTED_PATH_PREFIXES = [
  "/admin",
  "/procurement",
  "/manager",
  "/vendor",
  "/dashboard",
  "/vendors",
  "/purchase-orders",
  "/rfqs",
  "/invoices",
  "/contracts",
  "/catalog",
  "/analytics",
  "/compliance",
  "/notifications",
  "/messages",
  "/help",
  "/search",
  "/settings",
];

export const PUBLIC_PATHS = ["/", "/login", "/signup", "/forgot-password", "/403"];

export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some(
    (p) => pathname === p || (p !== "/" && pathname.startsWith(p + "/"))
  );
}

export function isProtectedPath(pathname: string): boolean {
  if (isPublicPath(pathname)) return false;
  if (pathname.startsWith("/api/auth")) return false;
  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const requiredRole = getRequiredRole(pathname);
  if (!requiredRole) return true;
  return role === requiredRole;
}

export function getRequiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/procurement")) return "procurement";
  if (pathname.startsWith("/manager")) return "manager";
  if (pathname.startsWith("/vendor")) return "vendor";
  return null;
}
