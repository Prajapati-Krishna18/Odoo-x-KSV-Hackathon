"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, Star, Download, ChevronDown, Sparkles, ArrowUpDown } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { getRFQ } from "@/lib/data";
import { getQuotationsByRFQ, getBestQuotation } from "@/lib/quotations-store";

type SortKey = "price" | "rating" | "delivery" | "risk" | "compliance";

export default function Page() {
  const params = useParams();
  const rfqId = params.rfqId as string;
  const rfq = getRFQ(rfqId);
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [selectedVendors, setSelectedVendors] = useState<Set<string>>(new Set());

  const quotations = useMemo(() => getQuotationsByRFQ(rfqId), [rfqId]);
  const bestQuotation = useMemo(() => getBestQuotation(rfqId), [rfqId]);

  const sorted = useMemo(() => {
    const list = [...quotations];
    list.sort((a, b) => {
      switch (sortKey) {
        case "price": return a.quotedPrice - b.quotedPrice;
        case "rating": return b.vendorRating - a.vendorRating;
        case "delivery": return a.deliveryTimeDays - b.deliveryTimeDays;
        case "risk": return a.riskScore - b.riskScore;
        case "compliance": return b.complianceScore - a.complianceScore;
        default: return 0;
      }
    });
    return list;
  }, [quotations, sortKey]);

  const bestPrice = Math.min(...quotations.map((q) => q.quotedPrice));
  const bestDelivery = Math.min(...quotations.map((q) => q.deliveryTimeDays));
  const bestRating = Math.max(...quotations.map((q) => q.vendorRating));
  const bestCompliance = Math.max(...quotations.map((q) => q.complianceScore));
  const bestRisk = Math.min(...quotations.map((q) => q.riskScore));

  const toggleVendor = (id: string) => {
    const next = new Set(selectedVendors);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedVendors(next);
  };

  if (!rfq) {
    return <div className="p-8 text-center text-slate-500">RFQ not found.</div>;
  }

  if (quotations.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Compare Quotations" description={rfq.title} breadcrumbs={[{ label: "Quotations", href: "/procurement/quotations" }, { label: "Compare" }]} />
        <Card><CardBody><p className="text-center text-slate-500 py-8">No quotations received for this RFQ yet.</p></CardBody></Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Compare Quotations"
        description={rfq.title}
        breadcrumbs={[{ label: "Quotations", href: "/procurement/quotations" }, { label: "Compare" }]}
        actions={
          <div className="flex gap-2">
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white">
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="delivery">Sort by Delivery</option>
              <option value="risk">Sort by Risk</option>
              <option value="compliance">Sort by Compliance</option>
            </select>
            <Button variant="secondary" size="sm" onClick={() => {
              const csv = "Vendor,Price,Delivery,Lead Time,Warranty,Rating,Risk,Performance,Response Time,Compliance\n" +
                quotations.map((q) => `${q.vendorName},${q.quotedPrice},${q.deliveryTimeDays},${q.leadTimeDays},${q.warrantyMonths},${q.vendorRating},${q.riskScore},${q.pastPerformance},${q.responseTimeHours},${q.complianceScore}`).join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `quotes-${rfqId}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}>
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader title="Side-by-Side Comparison" description={`${quotations.length} quotations received`} />
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 w-36">Criteria</th>
                {sorted.map((q) => (
                  <th key={q.id} className={`px-4 py-3 text-center ${q.id === bestQuotation?.id ? "bg-indigo-50" : ""}`}>
                    <p className="text-sm font-semibold text-slate-900">{q.vendorName}</p>
                    {q.id === bestQuotation?.id && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 mt-1">
                        <Sparkles className="h-3 w-3" /> Recommended
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { key: "price", label: "Quoted Price", format: (v: number) => formatCurrency(v), best: bestPrice, cmp: "low" as const },
                { key: "delivery", label: "Delivery Time", format: (v: number) => `${v} days`, best: bestDelivery, cmp: "low" as const },
                { key: "lead", label: "Lead Time", format: (v: number) => `${v} days`, best: null, cmp: null },
                { key: "warranty", label: "Warranty", format: (v: number) => `${v} months`, best: null, cmp: null },
                { key: "rating", label: "Vendor Rating", format: (v: number) => `${v}/5`, best: bestRating, cmp: "high" as const },
                { key: "risk", label: "Risk Score", format: (v: number) => `${v}/100`, best: bestRisk, cmp: "low" as const },
                { key: "performance", label: "Past Performance", format: (v: number) => `${v}%`, best: null, cmp: null },
                { key: "response", label: "Response Time", format: (v: number) => `${v}h`, best: null, cmp: null },
                { key: "compliance", label: "Compliance Score", format: (v: number) => `${v}%`, best: bestCompliance, cmp: "high" as const },
              ].map((row) => (
                <tr key={row.key} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-700">{row.label}</td>
                  {sorted.map((q) => {
                    const val = (q as any)[row.key === "lead" ? "leadTimeDays" : row.key === "response" ? "responseTimeHours" : row.key === "performance" ? "pastPerformance" : row.key === "delivery" ? "deliveryTimeDays" : row.key === "rating" ? "vendorRating" : row.key === "risk" ? "riskScore" : row.key === "compliance" ? "complianceScore" : row.key];
                    const isBest = row.best !== null && ((row.cmp === "low" && val === row.best) || (row.cmp === "high" && val === row.best));
                    return (
                      <td key={q.id} className={`px-4 py-3 text-center ${q.id === bestQuotation?.id ? "bg-indigo-50/30" : ""} ${isBest ? "bg-emerald-50" : ""}`}>
                        <div className="flex items-center justify-center gap-1.5">
                          <span className={`font-medium ${isBest ? "text-emerald-700" : "text-slate-800"}`}>{row.format(val)}</span>
                          {isBest && <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="AI Recommendation" action={<span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">AI Powered</span>} />
        <CardBody>
          {bestQuotation ? (
            <div className="flex items-start gap-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
              <div className="rounded-full bg-indigo-100 p-2.5">
                <Sparkles className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recommended Vendor</h3>
                <p className="text-xl font-bold text-indigo-600 mt-1">{bestQuotation.vendorName}</p>
                <ul className="mt-3 space-y-1.5">
                  <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-emerald-500" /> Lowest risk score ({bestQuotation.riskScore}/100)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-emerald-500" /> Highest rating ({bestQuotation.vendorRating}/5)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-emerald-500" /> Fast delivery ({bestQuotation.deliveryTimeDays} days)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle className="h-4 w-4 text-emerald-500" /> {bestQuotation.complianceScore}% compliance history</li>
                </ul>
                <div className="flex gap-3 mt-4">
                  <Button size="sm">Select Vendor</Button>
                  <Button variant="secondary" size="sm">Negotiate</Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-4">No quotations to evaluate.</p>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Quick Actions" />
        <CardBody>
          <div className="flex flex-wrap gap-3">
            <Button>Select Vendor</Button>
            <Button variant="secondary">Shortlist Vendor</Button>
            <Button variant="secondary">Negotiate</Button>
            <Button variant="secondary">
              <Download className="h-4 w-4" /> Download Comparison PDF
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
