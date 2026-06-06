import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Plug,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Building2,
    title: "Vendor Management",
    description: "Onboard, score, and manage your entire vendor network with compliance tracking.",
    href: "/vendors",
  },
  {
    icon: ShoppingCart,
    title: "Purchase Orders",
    description: "Create, approve, and track POs with multi-level workflows and Odoo sync.",
    href: "/purchase-orders",
  },
  {
    icon: Receipt,
    title: "Invoice Matching",
    description: "Three-way match invoices to POs and receipts. Catch discrepancies instantly.",
    href: "/invoices",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Hub",
    description: "Monitor vendor certifications, insurance, and risk scores in real time.",
    href: "/compliance",
  },
  {
    icon: BarChart3,
    title: "Spend Analytics",
    description: "Visualize spend by vendor, category, and department. Export board-ready reports.",
    href: "/analytics",
  },
  {
    icon: Plug,
    title: "Odoo Integration",
    description: "Bi-directional sync with Odoo ERP — vendors, POs, invoices, and inventory.",
    href: "/settings/integrations",
  },
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "For small procurement teams getting started.",
    features: ["Up to 25 vendors", "500 POs/month", "Email support", "Basic analytics"],
    href: "/signup?plan=starter",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$149",
    description: "For growing teams with Odoo integration needs.",
    features: [
      "Unlimited vendors",
      "Unlimited POs",
      "Odoo sync",
      "Advanced analytics",
      "Priority support",
    ],
    href: "/signup?plan=professional",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with custom workflows.",
    features: [
      "SSO & SAML",
      "Custom approvals",
      "Dedicated CSM",
      "SLA guarantees",
      "API access",
    ],
    href: "/help",
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
              <Zap className="h-4 w-4" />
              Now with native Odoo ERP integration
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Bridge the gap between procurement and vendors
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              VendorBridge is the all-in-one platform for vendor management, purchase orders,
              RFQs, invoicing, and compliance — synced with your Odoo ERP.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/signup" size="lg">
                Start 14-day free trial
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="secondary" href="/login" size="lg">
                View live demo
              </Button>
            </div>
            <p className="mt-4 text-sm text-slate-500">
              No credit card required ·{" "}
              <Link href="/login" className="text-indigo-600 hover:underline">
                Already have an account?
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Everything procurement teams need
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              One platform. Every workflow. Fully connected.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link
                key={f.title}
                href={f.href}
                className="group rounded-2xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{f.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">
                Built for Odoo. Ready for your stack.
              </h2>
              <p className="mt-4 text-lg text-slate-500">
                VendorBridge syncs bi-directionally with Odoo — vendors, purchase orders,
                invoices, and product catalog stay in perfect alignment.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "Real-time vendor & PO sync",
                  "Automated invoice reconciliation",
                  "Product catalog mirroring",
                  "Webhook & API extensibility",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-700">
                    <Check className="h-5 w-5 text-emerald-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button href="/settings/integrations" className="mt-8">
                Configure Odoo integration
              </Button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-bold text-sm">
                  Odoo
                </div>
                <div className="flex-1 border-t-2 border-dashed border-indigo-300" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-xs">
                  VB
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { label: "Vendors synced", value: "6 active" },
                  { label: "POs this month", value: "142" },
                  { label: "Last sync", value: "2 min ago" },
                  { label: "Sync status", value: "Healthy" },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-slate-500">{row.label}</span>
                    <Link
                      href="/settings/integrations"
                      className="font-medium text-indigo-600 hover:underline"
                    >
                      {row.value}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-slate-500">
              Start free. Scale as your vendor network grows.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-indigo-600 shadow-lg ring-1 ring-indigo-600"
                    : "border-slate-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="inline-block rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white mb-4">
                    Most popular
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                <p className="mt-6 text-4xl font-bold text-slate-900">
                  {plan.price}
                  {plan.price !== "Custom" && (
                    <span className="text-base font-normal text-slate-500">/mo</span>
                  )}
                </p>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href={plan.href}
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {plan.name === "Enterprise" ? "Contact sales" : "Get started"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white">
            Ready to streamline your vendor operations?
          </h2>
          <p className="mt-4 text-indigo-100">
            Join procurement teams who manage $50M+ in annual spend on VendorBridge.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="/signup"
              variant="secondary"
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Start free trial
            </Button>
            <Button
              href="/help"
              variant="ghost"
              size="lg"
              className="text-white hover:bg-indigo-500"
            >
              Talk to sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-bold text-slate-900">VendorBridge</p>
              <p className="mt-2 text-sm text-slate-500">
                Vendor management for modern procurement teams.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Product</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link href="/vendors" className="hover:text-indigo-600">Vendors</Link></li>
                <li><Link href="/purchase-orders" className="hover:text-indigo-600">Purchase Orders</Link></li>
                <li><Link href="/analytics" className="hover:text-indigo-600">Analytics</Link></li>
                <li><Link href="/settings/integrations" className="hover:text-indigo-600">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Company</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link href="/help" className="hover:text-indigo-600">Help Center</Link></li>
                <li><Link href="/settings/billing" className="hover:text-indigo-600">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-indigo-600">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Legal</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link href="/help" className="hover:text-indigo-600">Privacy Policy</Link></li>
                <li><Link href="/help" className="hover:text-indigo-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-12 text-center text-sm text-slate-400">
            © 2026 VendorBridge. Built for KSV Hackathon × Odoo.
          </p>
        </div>
      </footer>
    </div>
  );
}
