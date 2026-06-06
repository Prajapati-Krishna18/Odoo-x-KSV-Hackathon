import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-gradient-to-b from-slate-50 to-white">
      <Logo size="lg" />
      <p className="mt-10 text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved to a new location.
      </p>
      <div className="mt-8 flex gap-3">
        <Button href="/dashboard">Back to dashboard</Button>
        <Button variant="secondary" href="/help">Contact support</Button>
      </div>
    </div>
  );
}
