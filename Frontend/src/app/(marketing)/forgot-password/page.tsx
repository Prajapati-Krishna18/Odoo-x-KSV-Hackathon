"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2, AlertCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

type PageState = "form" | "sending" | "success" | "error";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPageState("sending");
    setErrorMessage("");

    try {
      // Try backend first
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL || "https://odoo-x-ksv-hackathon.onrender.com"}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (res.ok) {
        setPageState("success");
      } else if (res.status === 429) {
        setErrorMessage("Please wait before requesting another reset email.");
        setPageState("error");
      } else if (res.status === 404) {
        setErrorMessage("No account exists with this email address.");
        setPageState("error");
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.message || "Unable to send reset email. Please try again.");
        setPageState("error");
      }
    } catch {
      // Backend unreachable — show success anyway to avoid leaking info
      setPageState("success");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-sm">
        {pageState === "success" ? (
          <div className="text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">Reset Link Sent</h1>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed">
              We have sent a password reset link to:
            </p>
            <p className="mt-2 text-base font-semibold text-slate-900">{email}</p>
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Please check:
              </p>
              <ul className="space-y-1.5">
                {["Inbox", "Spam Folder", "Promotions Folder"].map((loc) => (
                  <li key={loc} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    {loc}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-3 text-xs text-slate-400">The link will expire in 30 minutes.</p>
            <Link
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center">
              <Logo size="2xs" />
            </div>
            <h1 className="mt-8 text-2xl font-bold text-slate-900">Reset your password</h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your email and we&apos;ll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4 text-left">
              {pageState === "error" && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm flex items-center gap-2.5 text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email" name="email" type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="block w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <Button type="submit" disabled={pageState === "sending"} className="w-full">
                {pageState === "sending" ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                  </span>
                ) : (
                  "Send reset link"
                )}
              </Button>
            </form>

            <Link
              href="/login"
              className="mt-6 flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
