"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardBody } from "@/components/ui/card";
import { SettingsSidebar } from "@/components/layout/app-shell";
import { useStore } from "@/lib/global-store";
import { useAuth } from "@/components/auth/auth-provider";

export default function ProfilePage() {
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [department, setDepartment] = useState(profile.department);
  const [designation, setDesignation] = useState(profile.designation);
  const [avatar, setAvatar] = useState<string | null>(profile.avatar);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function handleSave() {
    setSaving(true);
    updateProfile(
      { firstName, lastName, email, phone, department, designation, avatar },
      user?.name || `${firstName} ${lastName}`,
      user?.role || "admin"
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const initials = firstName
    ? (firstName[0] + (lastName?.[0] || "")).toUpperCase()
    : "AR";

  return (
    <div>
      <PageHeader title="Profile" description="Your personal account settings" />

      <div className="flex gap-8">
        <SettingsSidebar />
        <div className="flex-1 max-w-2xl space-y-6">
          <Card>
            <CardHeader title="Personal information" />
            <CardBody>
              <div className="mb-6 flex items-center gap-4">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Avatar"
                    className="h-16 w-16 rounded-full object-cover border-2 border-slate-200"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-xl font-bold text-indigo-700">
                    {initials}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                    {avatar ? "Change photo" : "Upload photo"}
                  </Button>
                  {avatar && (
                    <Button variant="secondary" size="sm" onClick={() => setAvatar(null)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">First name</label>
                    <input
                      type="text" value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Last name</label>
                    <input
                      type="text" value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Phone</label>
                  <input
                    type="tel" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Department</label>
                    <input
                      type="text" value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Designation</label>
                    <input
                      type="text" value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Role</label>
                  <input
                    type="text" defaultValue={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"}
                    disabled
                    className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  {saved && (
                    <span className="text-sm text-emerald-600 font-medium">Profile updated successfully</span>
                  )}
                </div>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
