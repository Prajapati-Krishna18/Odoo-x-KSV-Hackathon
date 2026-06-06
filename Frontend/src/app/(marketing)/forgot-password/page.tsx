import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size="xs" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        <form className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email" name="email" type="email" required
              className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
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
    </div>
  );
}
