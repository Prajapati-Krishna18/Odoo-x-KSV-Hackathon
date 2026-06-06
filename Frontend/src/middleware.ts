import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import {
  getRequiredRole,
  isProtectedPath,
} from "@/lib/auth/permissions";
import { ROLE_DASHBOARDS } from "@/lib/auth/types";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isAuthenticated = Boolean(session);

  if (pathname === "/login" && isAuthenticated && session) {
    return NextResponse.redirect(
      new URL(ROLE_DASHBOARDS[session.role], request.url)
    );
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const requiredRole = getRequiredRole(pathname);

  if (requiredRole && session && session.role !== requiredRole) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  if (!requiredRole && session) {
    const legacyPrefixes = [
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

    if (legacyPrefixes.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(
        new URL(ROLE_DASHBOARDS[session.role], request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
