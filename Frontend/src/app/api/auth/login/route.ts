import { NextRequest, NextResponse } from "next/server";
import { authenticate } from "@/lib/auth/users";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { ROLE_DASHBOARDS, type UserRole, type AuthUser } from "@/lib/auth/types";
import { api } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, rememberMe } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Try backend first
    try {
      const result = await api.login(email, password);
      const backendRoles = result.user.roles;
      let mappedRole: UserRole = "admin";
      if (backendRoles.includes("admin")) mappedRole = "admin";
      else if (backendRoles.includes("procurement")) mappedRole = "procurement";
      else if (backendRoles.includes("manager")) mappedRole = "manager";
      else if (backendRoles.includes("vendor")) mappedRole = "vendor";
      const user = {
        id: result.user.id,
        email: result.user.email,
        name: `${result.user.firstName} ${result.user.lastName}`,
        role: mappedRole,
      } satisfies AuthUser;

      const token = await createSessionToken(user, Boolean(rememberMe));
      const response = NextResponse.json({
        user,
        redirectTo: ROLE_DASHBOARDS[user.role],
        backendToken: result.accessToken,
      });

      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      });

      return response;
    } catch {
      // Fall back to local demo auth
      const user = authenticate(email, password);
      if (!user) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const token = await createSessionToken(user, Boolean(rememberMe));
      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          vendorId: user.vendorId,
        },
        redirectTo: ROLE_DASHBOARDS[user.role],
      });

      response.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
      });

      return response;
    }
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
