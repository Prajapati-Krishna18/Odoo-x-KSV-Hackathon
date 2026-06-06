"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { FormField, FormSection, inputClass, selectClass } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { getAllVendors } from "@/lib/admin-store";
import { rfqs, products } from "@/lib/data";
import {
  generatePONumber,
  savePurchaseOrder,
  type POLineItem,
} from "@/lib/procurement-store";
import { setPendingToast } from "@/lib/admin-store";
import { formatCurrency } from "@/lib/utils";

const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 60"];
const PAYMENT_METHODS = ["ACH", "Wire Transfer", "Check", "Credit Card"];
const CURRENCIES = ["USD", "EUR", "GBP"];
const ATTACHMENT_TYPES = ["Quotation PDF", "Contract Document", "Purchase Agreement"];

function newLine(): POLineItem {
  return {
    id: crypto.randomUUID(),
    productName: "",
    quantity: 1,
    unitPrice: 0,
    taxPercent: 0,
  };
}

function lineTotal(item: POLineItem) {
  return item.quantity * item.unitPrice * (1 + item.taxPercent / 100);
}

export function CreatePOForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [poNumber, setPoNumber] = useState("");
  const [vendorList, setVendorList] = useState(getAllVendors());
  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedRfqId, setSelectedRfqId] = useState("");
  const [lineItems, setLineItems] = useState<POLineItem[]>([newLine()]);
  const [discount, setDiscount] = useState(0);
  const [attachments, setAttachments] = useState<Record<string, string>>({});

  useEffect(() => {
    setPoNumber(generatePONumber());
    setVendorList(getAllVendors());
  }, []);

  const selectedVendor = vendorList.find((v) => v.id === selectedVendorId);

  const { subtotal, tax, grandTotal } = useMemo(() => {
    const sub = lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const tx = lineItems.reduce(
      (s, i) => s + i.quantity * i.unitPrice * (i.taxPercent / 100),
      0
    );
    return { subtotal: sub, tax: tx, grandTotal: sub + tx - discount };
  }, [lineItems, discount]);

  function handleVendorChange(vendorId: string) {
    setSelectedVendorId(vendorId);
  }

  function handleRfqChange(rfqId: string) {
    setSelectedRfqId(rfqId);
    if (!rfqId) return;
    const rfq = rfqs.find((r) => r.id === rfqId);
    if (!rfq) return;
    const vendorId = rfq.vendorIds[0];
    setSelectedVendorId(vendorId);
    const vendorProducts = products.filter(
      (p) => p.vendorId === vendorId || p.category === rfq.category
    );
    if (vendorProducts.length > 0) {
      setLineItems(
        vendorProducts.slice(0, 3).map((p) => ({
          id: crypto.randomUUID(),
          productName: p.name,
          quantity: 1,
          unitPrice: p.unitPrice,
          taxPercent: 8,
        }))
      );
    }
  }

  function updateLine(id: string, field: keyof POLineItem, value: string | number) {
    setLineItems((items) =>
      items.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  function collectData(asDraft: boolean) {
    const form = formRef.current;
    if (!form || !selectedVendor) return null;
    const fd = new FormData(form);
    return {
      poNumber,
      title: String(fd.get("title") || ""),
      poDate: String(fd.get("poDate") || new Date().toISOString().split("T")[0]),
      deliveryDate: String(fd.get("deliveryDate") || ""),
      vendorId: selectedVendor.id,
      vendorName: selectedVendor.name,
      vendorCategory: selectedVendor.category,
      vendorContact: selectedVendor.contactPerson,
      vendorEmail: selectedVendor.email,
      vendorPhone: selectedVendor.phone,
      rfqId: selectedRfqId || undefined,
      lineItems,
      paymentTerms: String(fd.get("paymentTerms") || "Net 30"),
      paymentMethod: String(fd.get("paymentMethod") || "ACH"),
      currency: String(fd.get("currency") || "USD"),
      shippingAddress: String(fd.get("shippingAddress") || ""),
      deliveryLocation: String(fd.get("deliveryLocation") || ""),
      deliveryInstructions: String(fd.get("deliveryInstructions") || ""),
      internalNotes: String(fd.get("internalNotes") || ""),
      vendorNotes: String(fd.get("vendorNotes") || ""),
      attachments: Object.keys(attachments),
      subtotal,
      tax,
      discount,
      grandTotal,
      isDraft: asDraft,
    };
  }

  function submit(asDraft: boolean) {
    if (!selectedVendorId) {
      showToast("Please select a vendor", "error");
      return;
    }
    const data = collectData(asDraft);
    if (!data) return;
    if (!asDraft && lineItems.every((l) => !l.productName)) {
      showToast("Add at least one product", "error");
      return;
    }
    savePurchaseOrder(data, asDraft);
    if (asDraft) {
      showToast("Purchase order draft saved");
      return;
    }
    setPendingToast("Purchase Order Created Successfully");
    router.push("/procurement/purchase-orders");
  }

  return (
    <div>
      <PageHeader
        title="Create Purchase Order"
        description="Issue a new purchase order to a vendor"
        breadcrumbs={[
          { label: "Purchase Orders", href: "/procurement/purchase-orders" },
          { label: "Create" },
        ]}
      />

      <form ref={formRef} className="space-y-6 max-w-5xl" onSubmit={(e) => e.preventDefault()}>
        <FormSection title="Basic Information">
          <FormField label="PO Number">
            <input value={poNumber} readOnly className={`${inputClass} bg-slate-50 text-slate-500 font-mono`} />
          </FormField>
          <FormField label="PO Title" required>
            <input name="title" required className={inputClass} placeholder="Q3 Steel Procurement" />
          </FormField>
          <FormField label="PO Date">
            <input name="poDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} className={inputClass} />
          </FormField>
          <FormField label="Expected Delivery Date" required>
            <input name="deliveryDate" type="date" required className={inputClass} />
          </FormField>
        </FormSection>

        <FormSection title="Vendor Information">
          <FormField label="Vendor Name" required className="sm:col-span-2">
            <select
              value={selectedVendorId}
              onChange={(e) => handleVendorChange(e.target.value)}
              required
              className={selectClass}
            >
              <option value="">Select vendor...</option>
              {vendorList.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Vendor Category">
            <input value={selectedVendor?.category || ""} readOnly className={`${inputClass} bg-slate-50`} />
          </FormField>
          <FormField label="Vendor Contact">
            <input value={selectedVendor?.contactPerson || ""} readOnly className={`${inputClass} bg-slate-50`} />
          </FormField>
          <FormField label="Vendor Email">
            <input value={selectedVendor?.email || ""} readOnly className={`${inputClass} bg-slate-50`} />
          </FormField>
          <FormField label="Vendor Phone">
            <input value={selectedVendor?.phone || ""} readOnly className={`${inputClass} bg-slate-50`} />
          </FormField>
        </FormSection>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
            RFQ Reference <span className="text-slate-400 font-normal text-sm">(Optional)</span>
          </h3>
          <select
            value={selectedRfqId}
            onChange={(e) => handleRfqChange(e.target.value)}
            className={selectClass}
          >
            <option value="">No RFQ — manual entry</option>
            {rfqs.map((r) => (
              <option key={r.id} value={r.id}>{r.title}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <h3 className="text-base font-semibold text-slate-900">Product Details</h3>
            <Button type="button" variant="secondary" size="sm" onClick={() => setLineItems((i) => [...i, newLine()])}>
              <Plus className="h-4 w-4" /> Add Product
            </Button>
          </div>
          <div className="space-y-4">
            {lineItems.map((item, idx) => (
              <div key={item.id} className="grid gap-3 sm:grid-cols-6 items-end rounded-lg border border-slate-100 p-4">
                <FormField label={idx === 0 ? "Product Name" : undefined} className="sm:col-span-2">
                  <input
                    value={item.productName}
                    onChange={(e) => updateLine(item.id, "productName", e.target.value)}
                    className={inputClass}
                    placeholder="Product name"
                  />
                </FormField>
                <FormField label={idx === 0 ? "Qty" : undefined}>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateLine(item.id, "quantity", Number(e.target.value))}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={idx === 0 ? "Unit Price" : undefined}>
                  <input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.unitPrice}
                    onChange={(e) => updateLine(item.id, "unitPrice", Number(e.target.value))}
                    className={inputClass}
                  />
                </FormField>
                <FormField label={idx === 0 ? "Tax %" : undefined}>
                  <input
                    type="number"
                    min={0}
                    value={item.taxPercent}
                    onChange={(e) => updateLine(item.id, "taxPercent", Number(e.target.value))}
                    className={inputClass}
                  />
                </FormField>
                <div>
                  {idx === 0 && <p className="text-sm font-medium text-slate-700 mb-1.5">Total</p>}
                  <p className="py-2 text-sm font-semibold text-slate-900">{formatCurrency(lineTotal(item))}</p>
                </div>
                {lineItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLineItems((items) => items.filter((i) => i.id !== item.id))}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <FormSection title="Payment Information">
          <FormField label="Payment Terms">
            <select name="paymentTerms" className={selectClass} defaultValue="Net 30">
              {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Payment Method">
            <select name="paymentMethod" className={selectClass}>
              {PAYMENT_METHODS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </FormField>
          <FormField label="Currency">
            <select name="currency" className={selectClass}>
              {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </FormField>
        </FormSection>

        <FormSection title="Shipping Information">
          <FormField label="Shipping Address" className="sm:col-span-2">
            <input name="shippingAddress" className={inputClass} placeholder="123 Industrial Blvd" />
          </FormField>
          <FormField label="Delivery Location">
            <input name="deliveryLocation" className={inputClass} placeholder="Dock B, Warehouse 2" />
          </FormField>
          <FormField label="Delivery Instructions" className="sm:col-span-2">
            <textarea name="deliveryInstructions" rows={2} className={inputClass} />
          </FormField>
        </FormSection>

        <FormSection title="Notes">
          <FormField label="Internal Notes">
            <textarea name="internalNotes" rows={2} className={inputClass} />
          </FormField>
          <FormField label="Vendor Notes">
            <textarea name="vendorNotes" rows={2} className={inputClass} />
          </FormField>
        </FormSection>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">Attachments</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {ATTACHMENT_TYPES.map((doc) => (
              <label
                key={doc}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-slate-300 p-4 hover:border-indigo-300 transition-colors"
              >
                <Upload className="h-5 w-5 text-slate-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700">{doc}</p>
                  <p className="text-xs text-slate-400 truncate">{attachments[doc] || "Upload"}</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setAttachments((prev) => ({ ...prev, [doc]: f.name }));
                  }}
                />
              </label>
            ))}
          </div>
        </div>

        <Card>
          <CardBody>
            <h3 className="text-base font-semibold text-slate-900 mb-4">Order Summary</h3>
            <div className="space-y-2 max-w-xs ml-auto text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Tax</span><span>{formatCurrency(tax)}</span></div>
              <div className="flex justify-between items-center gap-4">
                <span className="text-slate-500">Discount</span>
                <input
                  type="number"
                  min={0}
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 rounded border border-slate-300 px-2 py-1 text-right text-sm"
                />
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold">
                <span>Grand Total</span><span className="text-indigo-600">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => submit(false)}>Create Purchase Order</Button>
          <Button type="button" variant="secondary" onClick={() => submit(true)}>Save Draft</Button>
          <Button variant="ghost" href="/procurement/purchase-orders">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
