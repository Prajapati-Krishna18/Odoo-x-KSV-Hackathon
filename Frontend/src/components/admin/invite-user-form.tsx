"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { FormField, FormSection, inputClass, selectClass } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/toast";
import { saveInvitation, setPendingToast } from "@/lib/admin-store";

const DEPARTMENTS = ["Finance", "Operations", "Manufacturing", "Procurement", "IT"];
const ROLES = ["Admin", "Manager", "Procurement Officer", "Vendor"];
const PERMISSIONS = ["Read", "Write", "Approve", "Manage Users", "Manage Vendors"];

export function InviteUserForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>(["Read", "Write"]);

  function togglePerm(perm: string) {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  }

  function submitInvite(asDraft: boolean) {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
      const name = String(fd.get("name") || "");
      const email = String(fd.get("email") || "");

      if (!asDraft && (!name || !email)) {
        showToast("Name and email are required", "error");
        return;
      }

      saveInvitation(
        {
          name,
          email,
          phone: String(fd.get("phone") || ""),
          department: String(fd.get("department") || ""),
          role: String(fd.get("role") || ""),
          permissions: selectedPerms,
          inviteMessage: String(fd.get("inviteMessage") || ""),
        },
        asDraft
      );

      if (asDraft) {
        showToast("Invitation draft saved");
        return;
      }

      setPendingToast("Invitation Sent Successfully");
      router.push("/admin/users");
  }

  return (
    <div>
      <PageHeader
        title="Invite User"
        description="Send an invitation to join VendorBridge"
        breadcrumbs={[
          { label: "Users", href: "/admin/users" },
          { label: "Invite" },
        ]}
      />

      <form ref={formRef} className="space-y-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        <FormSection title="User Details">
          <FormField label="Full Name" required>
            <input name="name" required className={inputClass} placeholder="Jordan Kim" />
          </FormField>
          <FormField label="Email" required>
            <input name="email" type="email" required className={inputClass} />
          </FormField>
          <FormField label="Phone Number">
            <input name="phone" type="tel" className={inputClass} />
          </FormField>
          <FormField label="Department" required>
            <select name="department" required className={selectClass}>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </FormField>
        </FormSection>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
            Role Assignment
          </h3>
          <FormField label="Role">
            <select name="role" className={selectClass} defaultValue="Procurement Officer">
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </FormField>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 mb-5">
            Permissions
          </h3>
          <div className="flex flex-wrap gap-3">
            {PERMISSIONS.map((perm) => (
              <label
                key={perm}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm cursor-pointer hover:border-indigo-300 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
              >
                <input
                  type="checkbox"
                  checked={selectedPerms.includes(perm)}
                  onChange={() => togglePerm(perm)}
                  className="rounded border-slate-300 text-indigo-600"
                />
                {perm}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <FormField label="Invite Message">
            <textarea
              name="inviteMessage"
              rows={3}
              className={inputClass}
              placeholder="Welcome to VendorBridge! You've been invited to join our procurement platform..."
            />
          </FormField>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" onClick={() => submitInvite(false)}>Send Invitation</Button>
          <Button type="button" variant="secondary" onClick={() => submitInvite(true)}>
            Save Draft
          </Button>
          <Button variant="ghost" href="/admin/users">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
