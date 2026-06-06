"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ROLE_DASHBOARDS, type UserRole } from "@/lib/auth/types";

type Step = "welcome" | "profile" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("welcome");
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.push("/login");
        } else {
          setSession(data.user);
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await fetch("/api/auth/onboarding", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ onboardingCompleted: true }),
      });
      router.push(ROLE_DASHBOARDS[session.role as UserRole] || "/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-lg">
        {step === "welcome" && (
          <div className="text-center">
            <div className="flex justify-center">
              <Logo size="xs" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-slate-900">
              Welcome to VendorBridge
            </h1>
            <p className="mt-3 text-lg text-slate-500">
              Your centralized platform for vendor management, procurement, and
              purchasing operations.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-left">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">Manage Vendors</h3>
                <p className="mt-1 text-sm text-slate-500">Onboard, rate, and manage vendor relationships</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">Create RFQs</h3>
                <p className="mt-1 text-sm text-slate-500">Send requests and compare quotations</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">Purchase Orders</h3>
                <p className="mt-1 text-sm text-slate-500">Generate and track purchase orders</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <h3 className="font-semibold text-slate-900">Analytics</h3>
                <p className="mt-1 text-sm text-slate-500">Gain insights with performance dashboards</p>
              </div>
            </div>
            <Button className="mt-8" size="lg" onClick={() => setStep("profile")}>
              Get started
            </Button>
          </div>
        )}

        {step === "profile" && (
          <div className="text-center">
            <div className="flex justify-center">
              <Logo size="xs" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              Complete your profile
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              You can update these details later in settings.
            </p>
            <div className="mt-8 space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  defaultValue={session.name || ""}
                  readOnly
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  defaultValue={session.email || ""}
                  readOnly
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
                />
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Explore the dashboard to see your role-specific
                  features and tools.
                </p>
              </div>
            </div>
            <Button className="mt-8" size="lg" onClick={() => setStep("done")}>
              Continue
            </Button>
          </div>
        )}

        {step === "done" && (
          <div className="text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              You&apos;re all set!
            </h1>
            <p className="mt-2 text-slate-600">
              Your account is ready. Start exploring VendorBridge.
            </p>
            <Button className="mt-8" size="lg" onClick={completeOnboarding} disabled={loading}>
              {loading ? "Finishing..." : "Go to dashboard"}
            </Button>
          </div>
        )}

        <div className="mt-8 flex justify-center gap-2">
          <span className={`h-2 w-2 rounded-full ${step === "welcome" ? "bg-blue-600" : "bg-slate-300"}`} />
          <span className={`h-2 w-2 rounded-full ${step === "profile" ? "bg-blue-600" : "bg-slate-300"}`} />
          <span className={`h-2 w-2 rounded-full ${step === "done" ? "bg-blue-600" : "bg-slate-300"}`} />
        </div>
      </div>
    </div>
  );
}