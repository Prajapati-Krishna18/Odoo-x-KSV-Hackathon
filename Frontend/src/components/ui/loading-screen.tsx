"use client";

import { Logo } from "@/components/ui/logo";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
      <div className="mt-6 flex items-center gap-2 text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <p className="mt-4 text-sm text-slate-500 font-medium">
        Loading Vendor Intelligence Platform...
      </p>
    </div>
  );
}
