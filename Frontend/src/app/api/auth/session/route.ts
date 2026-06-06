import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE, sessionToUser } from "@/lib/auth/session";
import { ROLE_DASHBOARDS } from "@/lib/auth/types";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    const response = NextResponse.json({ user: null }, { status: 401 });
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  }

  const user = sessionToUser(session);
  return NextResponse.json({
    user,
    dashboard: ROLE_DASHBOARDS[user.role],
  });
}
