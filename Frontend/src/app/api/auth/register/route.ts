import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { ROLE_DASHBOARDS } from "@/lib/auth/types";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, organization, role, reason } = body;

    if (!email || !firstName || !lastName || !organization || !role || !reason) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Forward the registration call to Express Backend
    const backendRes = await axios.post(`${BACKEND_URL}/auth/register`, {
      firstName,
      lastName,
      email,
      organization,
      role,
      reason,
    });

    const result = backendRes.data.data;
    const { token, refreshToken, isNewUser, user } = result;

    // Create session token for Next.js Edge Middleware authentication
    const nextUser = {
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: role as "admin" | "procurement" | "manager" | "vendor",
    };

    const nextToken = await createSessionToken(nextUser, false);

    const redirectTo = isNewUser
      ? "/onboarding"
      : ROLE_DASHBOARDS[role as "admin" | "procurement" | "manager" | "vendor"] || "/dashboard";

    const response = NextResponse.json({
      success: true,
      token,
      refreshToken,
      isNewUser,
      user,
      redirectTo,
    });

    response.cookies.set(SESSION_COOKIE, nextToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Registration failed";
    return NextResponse.json({ error: errorMsg }, { status: err.response?.status || 500 });
  }
}
