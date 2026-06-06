"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function MarketingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/">
          <Logo size="2xs" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm text-slate-600 hover:text-indigo-600">
            Features
          </Link>
          <Link href="/#integrations" className="text-sm text-slate-600 hover:text-indigo-600">
            Integrations
          </Link>
          <Link href="/#pricing" className="text-sm text-slate-600 hover:text-indigo-600">
            Pricing
          </Link>
          <Link href="/help" className="text-sm text-slate-600 hover:text-indigo-600">
            Help
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" href="/login">
            Sign in
          </Button>
          <Button href="/signup">Start free trial</Button>
        </div>

        <button className="md:hidden text-slate-500" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link href="/#features" onClick={() => setOpen(false)} className="text-sm text-slate-600">
              Features
            </Link>
            <Link href="/#integrations" onClick={() => setOpen(false)} className="text-sm text-slate-600">
              Integrations
            </Link>
            <Link href="/#pricing" onClick={() => setOpen(false)} className="text-sm text-slate-600">
              Pricing
            </Link>
            <Link href="/help" onClick={() => setOpen(false)} className="text-sm text-slate-600">
              Help
            </Link>
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" href="/login" className="flex-1">
                Sign in
              </Button>
              <Button href="/signup" className="flex-1">
                Start trial
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
