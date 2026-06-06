import type { AuthUser, UserRole } from "./types";

export interface StoredUser extends AuthUser {
  password: string;
}

export const DEMO_USERS: StoredUser[] = [
  {
    id: "u-admin",
    email: "admin@vendorbridge.io",
    password: "password",
    name: "Alex Rivera",
    role: "admin",
  },
  {
    id: "u-procurement",
    email: "procurement@vendorbridge.io",
    password: "password",
    name: "Sam Patel",
    role: "procurement",
  },
  {
    id: "u-manager",
    email: "manager@vendorbridge.io",
    password: "password",
    name: "Jordan Kim",
    role: "manager",
  },
  {
    id: "u-vendor",
    email: "vendor@acme.com",
    password: "password",
    name: "Sarah Mitchell",
    role: "vendor",
    vendorId: "v1",
  },
];

export function authenticate(
  email: string,
  password: string
): AuthUser | null {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return null;
  const { password: _, ...authUser } = user;
  return authUser;
}

export function getUserById(id: string): AuthUser | null {
  const user = DEMO_USERS.find((u) => u.id === id);
  if (!user) return null;
  const { password: _, ...authUser } = user;
  return authUser;
}

export function getRoleForPrefix(pathname: string): UserRole | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/procurement")) return "procurement";
  if (pathname.startsWith("/manager")) return "manager";
  if (pathname.startsWith("/vendor")) return "vendor";
  return null;
}
