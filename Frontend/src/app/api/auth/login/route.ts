import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { ROLE_DASHBOARDS } from "@/lib/auth/types";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

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

    // Call Express Backend Login
    const backendRes = await axios.post(`${BACKEND_URL}/auth/login`, {
      email,
      password,
    });

    const { accessToken, refreshToken, user } = backendRes.data.data;

    // Determine role (Express returns roles array, e.g. ['admin'])
    const expressRole = user.roles && user.roles.length > 0 ? user.roles[0] : "viewer";
    
    // Map backend role names to frontend role prefixes
    let nextRole = "viewer";
    if (expressRole === "admin") nextRole = "admin";
    else if (expressRole === "procurement_officer" || expressRole === "procurement_manager") nextRole = "procurement";
    else if (expressRole === "approver") nextRole = "manager";
    else if (expressRole === "vendor") nextRole = "vendor";

    const nextUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: nextRole as "admin" | "procurement" | "manager" | "vendor",
    };

    const token = await createSessionToken(nextUser, Boolean(rememberMe));
    const response = NextResponse.json({
      success: true,
      accessToken,
      refreshToken,
      user: nextUser,
      redirectTo: ROLE_DASHBOARDS[nextRole as "admin" | "procurement" | "manager" | "vendor"] || "/dashboard",
    });

    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60,
    });

    return response;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Login failed";
    return NextResponse.json({ error: errorMsg }, { status: err.response?.status || 401 });
  }
}
