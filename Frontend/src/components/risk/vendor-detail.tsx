"use client";

import { X, Shield, Truck, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RiskVendor } from "@/lib/risk-store";
import { formatCurrency } from "@/lib/utils";

export function VendorRiskDetail({
  vendor,
  onClose,
}: {
  vendor: RiskVendor;
  onClose: () => void;
}) {
  const history = [
    { month: "Jan", compliance: vendor.complianceScore - 12, risk: vendor.riskScore + 8 },
    { month: "Feb", compliance: vendor.complianceScore - 8, risk: vendor.riskScore + 5 },
    { month: "Mar", compliance: vendor.complianceScore - 5, risk: vendor.riskScore + 3 },
    { month: "Apr", compliance: vendor.complianceScore - 3, risk: vendor.riskScore + 1 },
    { month: "May", compliance: vendor.complianceScore - 1, risk: vendor.riskScore },
    { month: "Jun", compliance: vendor.complianceScore, risk: vendor.riskScore },
  ];

  const activities = [
    { date: "2 hours ago", event: "Risk score updated", detail: `${vendor.riskScore}% - ${vendor.riskLevel} risk` },
    { date: "1 day ago", event: "Invoice overdue", detail: "INV-88205 marked as overdue" },
    { date: "5 days ago", event: "Compliance check", detail: `Score: ${vendor.complianceScore}%` },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 py-8">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl mx-4">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Vendor Risk Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-indigo-100 text-xl font-bold text-indigo-700">
              {vendor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{vendor.name}</h3>
              <p className="text-sm text-slate-500">{vendor.category} · {vendor.location}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`rounded-xl px-4 py-2 text-center ${vendor.riskLevel === "high" ? "bg-red-50" : vendor.riskLevel === "medium" ? "bg-orange-50" : "bg-emerald-50"}`}>
                <p className={`text-2xl font-bold ${vendor.riskLevel === "high" ? "text-red-600" : vendor.riskLevel === "medium" ? "text-orange-600" : "text-emerald-600"}`}>
                  {vendor.riskScore}%
                </p>
                <p className="text-xs text-slate-500">Risk Score</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Compliance Score", value: `${vendor.complianceScore}%`, color: vendor.complianceScore >= 80 ? "text-emerald-600" : vendor.complianceScore >= 70 ? "text-amber-600" : "text-red-600", icon: Shield },
              { label: "Financial Health", value: `${vendor.financialHealth}%`, color: vendor.financialHealth >= 80 ? "text-emerald-600" : vendor.financialHealth >= 60 ? "text-amber-600" : "text-red-600", icon: DollarSign },
              { label: "Delivery Rating", value: `${vendor.deliveryRating}%`, color: vendor.deliveryRating >= 80 ? "text-emerald-600" : vendor.deliveryRating >= 60 ? "text-amber-600" : "text-red-600", icon: Truck },
              { label: "Quality Score", value: `${vendor.qualityScore}%`, color: vendor.qualityScore >= 80 ? "text-emerald-600" : vendor.qualityScore >= 60 ? "text-amber-600" : "text-red-600", icon: Star },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-500">{m.label}</span>
                  </div>
                  <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                </div>
              );
            })}
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Compliance History</h4>
            <div className="relative h-40">
              <svg width="100%" height="100%" viewBox="0 0 300 120" className="overflow-visible">
                {[0, 25, 50, 75, 100].map((v) => (
                  <g key={v}>
                    <line x1={30} y1={120 - (v / 100) * 100} x2={290} y2={120 - (v / 100) * 100} stroke="#f1f5f9" strokeWidth={1} />
                    <text x={28} y={122 - (v / 100) * 100} textAnchor="end" className="fill-slate-400 text-[9px]">{v}%</text>
                  </g>
                ))}
                <polyline
                  points={history.map((h, i) => `${30 + i * 52},${120 - (h.compliance / 100) * 100}`).join(" ")}
                  fill="none" stroke="#4f46e5" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
                />
                <polyline
                  points={history.map((h, i) => `${30 + i * 52},${120 - (h.risk / 100) * 100}`).join(" ")}
                  fill="none" stroke="#ef4444" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round"
                />
                {history.map((h, i) => (
                  <text key={i} x={30 + i * 52} y={118} textAnchor="middle" className="fill-slate-400 text-[8px]">{h.month}</text>
                ))}
              </svg>
              <div className="flex gap-4 mt-1">
                <div className="flex items-center gap-1 text-xs"><span className="h-2 w-4 rounded bg-indigo-600" /> Compliance</div>
                <div className="flex items-center gap-1 text-xs"><span className="h-2 w-4 rounded bg-red-500" /> Risk</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">AI Recommendations</h4>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <ul className="space-y-2 text-sm">
                {vendor.riskLevel === "high" && (
                  <>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" /> Pause new RFQ invitations until compliance improves</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" /> Schedule compliance document review</li>
                  </>
                )}
                {vendor.riskLevel === "medium" && (
                  <>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" /> Monitor financial health indicators</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" /> Review delivery performance metrics</li>
                  </>
                )}
                {vendor.riskLevel === "low" && (
                  <>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" /> Consider for strategic sourcing partnership</li>
                    <li className="flex items-start gap-2"><span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" /> Maintain current engagement level</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Activity Timeline</h4>
            <div className="space-y-0">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-4 pb-4 border-l-2 border-slate-200 pl-4 ml-2 relative">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white border-2 border-indigo-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{a.event}</p>
                    <p className="text-xs text-slate-500">{a.detail}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{a.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="secondary" onClick={onClose}>Close</Button>
            <Button>Download Report</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
