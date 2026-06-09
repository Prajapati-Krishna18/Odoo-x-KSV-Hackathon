import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.split(" ")[1];

    const body = await request.json();
    const { onboardingCompleted } = body;

    if (onboardingCompleted !== true) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await axios.put(
      `${BACKEND_URL}/auth/onboarding`,
      { onboardingCompleted },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || "Failed to complete onboarding";
    return NextResponse.json({ error: errorMsg }, { status: err.response?.status || 500 });
  }
}