"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormField, FormSection, inputClass, selectClass } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import {
  generateVendorCode,
  saveVendor,
  setPendingToast,
} from "@/lib/admin-store";

const CATEGORIES = [
  "Raw Materials",
  "Logistics",
  "Packaging",
  "Electronics",
  "Office Supplies",
  "Safety Equipment",
];

const VENDOR_TYPES = ["Supplier", "Manufacturer", "Distributor", "Service Provider"];

const DOC_TYPES = [
  "GST Certificate",
  "PAN Card",
  "Company Registration",
  "Vendor Agreement",
];

export function VendorRegistrationForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [vendorCode, setVendorCode] = useState("");
  const [documents, setDocuments] = useState<Record<string, string>>({});

  useEffect(() => {
    setVendorCode(generateVendorCode());
  }, []);

  function collectFormData(form: HTMLFormElement) {
    const fd = new FormData(form);
    return {
      vendorCode,
      name: String(fd.get("companyName") || ""),
      category: String(fd.get("category") || ""),
      vendorType: String(fd.get("vendorType") || ""),
      contactPerson: String(fd.get("contactPerson") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      alternatePhone: String(fd.get("alternatePhone") || ""),
      gstNumber: String(fd.get("gstNumber") || ""),
      panNumber: String(fd.get("panNumber") || ""),
      companyRegNumber: String(fd.get("companyRegNumber") || ""),
      website: String(fd.get("website") || ""),
      country: String(fd.get("country") || ""),
      state: String(fd.get("state") || ""),
      city: String(fd.get("city") || ""),
      addressLine: String(fd.get("addressLine") || ""),
      postalCode: String(fd.get("postalCode") || ""),
      location: `${fd.get("city")}, ${fd.get("state")}`,
      rating: Number(fd.get("rating") || 4),
      priorityLevel: String(fd.get("priorityLevel") || "Tier 2") as "Tier 1" | "Tier 2" | "Tier 3",
      documents: Object.keys(documents),
      status: "active" as const,
      spendYtd: 0,
      contracts: 0,
      complianceScore: 85,
      joinedDate: new Date().toISOString().split("T")[0],
      tags: [String(fd.get("priorityLevel") || "Tier 2")],
    };
  }

  function submit(asDraft: boolean) {
    const form = formRef.current;
    if (!form) return;
    const data = collectFormData(form);

    if (!asDraft && !data.name) {
      showToast("Company name is required", "error");
      return;
    }

    saveVendor(data, asDraft);

    if (asDraft) {
      showToast("Vendor draft saved");
      return;
    }

    setPendingToast("Vendor Added Successfully");
    router.push("/admin/vendors");
  }

  function handleFile(docType: string, file: File | null) {
    if (file) {
      setDocuments((prev) => ({ ...prev, [docType]: file.name }));
    }
  }

  return (
    <div>
      <PageHeader
        title="Register Vendor"
        description="Add a new vendor to the VendorBridge network"
        breadcrumbs={[
          { label: "Vendors", href: "/admin/vendors" },
          { label: "Register" },
        ]}
      />

      <form ref={formRef} className="space-y-6 max-w-4xl" onSubmit={(e) => e.preventDefault()}>
        <FormSection title="Basic Information">
          <FormField label="Vendor Company Name" required className="sm:col-span-2">
            <input name="companyName" required className={inputClass} placeholder="Acme Industrial Supply" />
          </FormField>
          <FormField label="Vendor Code">
            <input value={vendorCode} readOnly className={`${inputClass} bg-slate-50 text-slate-500`} />
          </FormField>
          <FormField label="Business Category" required>
            <select name="category" required className={selectClass}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Vendor Type" required>
            <select name="vendorType" required className={selectClass}>
              {VENDOR_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Contact Information">
          <FormField label="Contact Person" required>
            <input name="contactPerson" required className={inputClass} />
          </FormField>
          <FormField label="Email" required>
            <input name="email" type="email" required className={inputClass} />
          </FormField>
          <FormField label="Phone Number" required>
            <input name="phone" type="tel" required className={inputClass} />
          </FormField>
          <FormField label="Alternate Phone">
            <input name="alternatePhone" type="tel" className={inputClass} />
          </FormField>
        </FormSection>

        <FormSection title="Business Information">
          <FormField label="GST Number">
            <input name="gstNumber" className={inputClass} placeholder="22AAAAA0000A1Z5" />
          </FormField>
          <FormField label="PAN Number">
            <input name="panNumber" className={inputClass} placeholder="AAAAA0000A" />
          </FormField>
          <FormField label="Company Registration Number">
            <input name="companyRegNumber" className={inputClass} />
          </FormField>
          <FormField label="Website">
            <input name="website" type="url" className={inputClass} placeholder="https://" />
          </FormField>
        </FormSection>

        <FormSection title="Address Information">
          <FormField label="Country">
            <input name="country" defaultValue="United States" className={inputClass} />
          </FormField>
          <FormField label="State">
            <input name="state" className={inputClass} />
          </FormField>
          <FormField label="City">
            <input name="city" className={inputClass} />
          </FormField>
          <FormField label="Postal Code">
            <input name="postalCode" className={inputClass} />
          </FormField>
          <FormField label="Address Line" className="sm:col-span-2">
            <input name="addressLine" className={inputClass} />
          </FormField>
        </FormSection>

        <FormSection title="Performance Settings">
          <FormField label="Initial Vendor Rating">
            <select name="rating" className={selectClass} defaultValue="4">
              {[5, 4.5, 4, 3.5, 3].map((r) => (
                <option key={r} value={r}>{r} stars</option>
              ))}
            </select>
          </FormField>
          <FormField label="Priority Level">
            <select name="priorityLevel" className={selectClass}>
              {["Tier 1", "Tier 2", "Tier 3"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
            Documents
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {DOC_TYPES.map((doc) => (
              <label
                key={doc}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
              >
                <Upload className="h-5 w-5 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{doc}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {documents[doc] || "Click to upload"}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFile(doc, e.target.files?.[0] || null)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button type="button" onClick={() => submit(false)}>Register Vendor</Button>
          <Button type="button" variant="secondary" onClick={() => submit(true)}>Save Draft</Button>
          <Button variant="ghost" href="/admin/vendors">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
