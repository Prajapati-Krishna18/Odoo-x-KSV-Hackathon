export type UserRole = "admin" | "procurement" | "manager" | "vendor";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  vendorId?: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  vendorId?: string;
  exp: number;
}

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  procurement: "/procurement/dashboard",
  manager: "/manager/dashboard",
  vendor: "/vendor/dashboard",
};

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrator",
  procurement: "Procurement Officer",
  manager: "Manager",
  vendor: "Vendor",
};

export const ROLE_PREFIXES: Record<UserRole, string> = {
  admin: "/admin",
  procurement: "/procurement",
  manager: "/manager",
  vendor: "/vendor",
};
