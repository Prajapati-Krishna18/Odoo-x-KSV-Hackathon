"use client";

import Link from "next/link";
import { useState } from "react";
import { Shield, Lock, Mail, Eye, EyeOff, ChevronRight, Building2, CheckSquare, User, Sparkles, ShoppingCart, FileQuestion, Receipt, FileText, BarChart3, CheckCircle, Users, TrendingUp, Clock, Award } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/ui/logo";

const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@vendorbridge.io", icon: Users, gradient: "from-blue-500 to-indigo-500" },
  { role: "Procurement", email: "procurement@vendorbridge.io", icon: Building2, gradient: "from-emerald-500 to-teal-500" },
  { role: "Manager", email: "manager@vendorbridge.io", icon: CheckSquare, gradient: "from-violet-500 to-purple-500" },
  { role: "Vendor", email: "vendor@acme.com", icon: User, gradient: "from-amber-500 to-orange-500" },
];

const KPIS = [
  { value: "500+", label: "Vendors", icon: Building2 },
  { value: "99.9%", label: "Uptime", icon: Clock },
  { value: "$25M", label: "Volume", icon: TrendingUp },
  { value: "50+", label: "Orgs", icon: Award },
];

const FEATURES = [
  { icon: Building2, label: "Vendor Management" },
  { icon: FileQuestion, label: "RFQ Automation" },
  { icon: FileText, label: "Quotation Comparison" },
  { icon: ShoppingCart, label: "Purchase Orders" },
  { icon: CheckSquare, label: "Approval Workflows" },
  { icon: Receipt, label: "Invoice Tracking" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Shield, label: "Compliance & Security" },
];

export function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password, rememberMe);
    if (result.error) setError(result.error);
    setLoading(false);
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword("password");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="hidden lg:flex lg:w-[58%] flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-100/30 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-100/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 h-64 w-64 rounded-full bg-cyan-100/15 blur-[100px]" />
        </div>

        <div className="relative z-10 flex-1 flex items-center justify-center p-10 xl:p-14 2xl:p-16">
          <div className="w-full max-w-[700px]">
            <Logo size="xs" />

            <h1 className="mt-10 text-5xl xl:text-6xl 2xl:text-[72px] font-extrabold leading-[1.05] tracking-[-0.03em] text-slate-900">
              Enterprise vendor
              <br />
              management,
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 bg-clip-text text-transparent">secured.</span>
            </h1>

            <p className="mt-6 text-lg xl:text-[22px] leading-[1.8] text-slate-500 max-w-[600px]">
              Role-based access for admins, procurement teams, managers, and vendors — all in one platform.
            </p>

            <div className="mt-10 grid grid-cols-4 gap-4">
              {KPIS.map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white/90 p-4 text-center backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow min-h-[90px]">
                    <Icon className="h-5 w-5 text-indigo-500 mb-2" />
                    <p className="text-xl font-bold text-slate-900 leading-none">{kpi.value}</p>
                    <p className="text-xs text-slate-500 leading-tight mt-1">{kpi.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Platform capabilities
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-2.5 border border-slate-100 min-h-[36px] hover:border-slate-200 hover:shadow-sm transition-all">
                      <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                      <span className="text-xs text-slate-700 font-medium leading-tight">{f.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6 text-slate-400 text-xs">
              <div className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                SOC 2 Compliant
              </div>
              <div className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5" />
                256-bit Encryption
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                RBAC Enabled
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 lg:px-8 bg-gradient-to-br from-white via-indigo-50/10 to-blue-50/10">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo size="xs" />
          </div>

          <div className="relative rounded-2xl border border-slate-200/80 bg-white p-7 xl:p-8 shadow-[0_0_40px_-12px_rgba(0,0,0,0.06)] shadow-indigo-500/5">
            <div className="relative">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Your role is determined automatically from your account.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm flex items-center gap-2.5 text-red-700">
                    <Shield className="h-4 w-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="email" type="email" required autoComplete="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="block w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 hover:border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                    <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 transition-colors">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 placeholder-slate-400 transition-all duration-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 hover:border-slate-300"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20" />
                  <span className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">Remember me for 30 days</span>
                </label>

                <button type="submit" disabled={loading}
                  className="relative w-full rounded-lg bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed">
                  <span className="flex items-center justify-center gap-2">
                    {loading ? "Signing in..." : "Sign in"}
                    {!loading && <ChevronRight className="h-4 w-4" />}
                  </span>
                </button>
              </form>

              <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Demo accounts (password: password)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon;
                    return (
                      <button key={acc.email} type="button" onClick={() => fillDemo(acc.email)}
                        className="group relative rounded-lg border border-slate-200 bg-white p-2.5 text-left transition-all duration-200 hover:border-blue-200 hover:shadow-sm hover:bg-blue-50/20">
                        <div className={`h-6 w-6 rounded-md bg-gradient-to-br ${acc.gradient} flex items-center justify-center mb-1.5 shadow-sm`}>
                          <Icon className="h-3 w-3 text-white" />
                        </div>
                        <p className="text-[11px] font-semibold text-slate-800">{acc.role}</p>
                        <p className="text-[9px] mt-0.5 truncate text-slate-400">{acc.email}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="mt-5 text-center text-sm text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">Request access</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
