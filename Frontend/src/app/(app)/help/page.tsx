import Link from "next/link";
import { Book, MessageCircle, Mail, FileText, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";

const articles = [
  { title: "Getting started with VendorBridge", href: "/dashboard", category: "Onboarding" },
  { title: "Connecting Odoo ERP", href: "/settings/integrations", category: "Integrations" },
  { title: "Creating and approving purchase orders", href: "/purchase-orders/new", category: "Purchase Orders" },
  { title: "Managing vendor compliance", href: "/compliance", category: "Compliance" },
  { title: "Three-way invoice matching", href: "/invoices", category: "Invoices" },
  { title: "Running RFQs and evaluating quotes", href: "/rfqs/new", category: "RFQs" },
];

const contactOptions = [
  { icon: MessageCircle, label: "Live chat", description: "Chat with support", href: "/messages" },
  { icon: Mail, label: "Email support", description: "support@vendorbridge.io", href: "mailto:support@vendorbridge.io" },
  { icon: Book, label: "Documentation", description: "Full API & user docs", href: "/settings/integrations" },
];

export default function HelpPage() {
  return (
    <div>
      <PageHeader
        title="Help & Support"
        description="Find answers, guides, and contact options"
        actions={<Button href="/messages">Contact support</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {contactOptions.map((opt) => (
          <Card key={opt.label} href={opt.href}>
            <CardBody className="flex items-start gap-4">
              <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                <opt.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{opt.label}</p>
                <p className="text-sm text-slate-500">{opt.description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-slate-900 mb-4">Popular articles</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.title}
            href={article.href}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <FileText className="h-5 w-5 text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-medium text-slate-900">{article.title}</p>
              <p className="text-xs text-slate-500">{article.category}</p>
            </div>
            <ExternalLink className="h-4 w-4 text-slate-300 ml-auto shrink-0" />
          </Link>
        ))}
      </div>

      <Card className="mt-8" href="/settings/billing">
        <CardBody>
          <p className="font-semibold text-slate-900">Enterprise support</p>
          <p className="mt-1 text-sm text-slate-500">
            Professional and Enterprise plans include priority support and a dedicated CSM.
          </p>
          <span className="mt-3 inline-flex text-sm font-medium text-indigo-600">
            View plans →
          </span>
        </CardBody>
      </Card>
    </div>
  );
}
