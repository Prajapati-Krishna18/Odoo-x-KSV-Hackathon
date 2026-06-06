"use client";

import { useState, useRef } from "react";
import {
  User, Shield, Bell, Building2, Lock, Sliders, Globe, Eye, EyeOff, Upload, Trash2, X,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import type { UserRole } from "@/lib/auth/types";
import { ROLE_LABELS } from "@/lib/auth/types";
import { useToast } from "@/components/ui/toast";

type Tab =
  | "profile"
  | "account"
  | "security"
  | "notifications"
  | "preferences"
  | "organization"
  | "role-settings";

interface NotificationSetting {
  key: string;
  label: string;
  enabled: boolean;
}

export function SettingsCenter({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    { key: "email", label: "Email Notifications", enabled: true },
    { key: "approval", label: "Approval Alerts", enabled: true },
    { key: "rfq", label: "RFQ Alerts", enabled: true },
    { key: "invoice", label: "Invoice Alerts", enabled: false },
    { key: "po", label: "PO Alerts", enabled: true },
    { key: "system", label: "System Notifications", enabled: true },
  ]);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "Profile", icon: User },
    { key: "account", label: "Account", icon: Globe },
    { key: "security", label: "Security", icon: Shield },
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "preferences", label: "Preferences", icon: Sliders },
    { key: "organization", label: "Organization", icon: Building2 },
    { key: "role-settings", label: "Role Settings", icon: Lock },
  ];

  const recentLogins = [
    { device: "Chrome / Windows", browser: "Chrome 125", location: "Chicago, IL", date: "2 hours ago" },
    { device: "Safari / macOS", browser: "Safari 18", location: "Chicago, IL", date: "3 days ago" },
    { device: "Chrome / Android", browser: "Chrome 124", location: "New York, NY", date: "1 week ago" },
  ];

  const handleSave = () => {
    showToast("Settings saved successfully", "success");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("Please select a JPG, PNG, or WebP image", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = () => {
    if (photoPreview) {
      setProfilePhoto(photoPreview);
      setPhotoPreview(null);
      showToast("Profile photo updated successfully", "success");
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    setPhotoPreview(null);
    setShowRemoveModal(false);
    showToast("Profile photo removed successfully", "success");
  };

  const handleCancelPhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const TabIcon = activeTab === "profile" ? User :
    activeTab === "account" ? Globe :
    activeTab === "security" ? Shield :
    activeTab === "notifications" ? Bell :
    activeTab === "preferences" ? Sliders :
    activeTab === "organization" ? Building2 : Lock;

  const tabLabels: Record<Tab, string> = {
    profile: "Profile",
    account: "Account",
    security: "Security",
    notifications: "Notifications",
    preferences: "Preferences",
    organization: "Organization",
    "role-settings": "Role Settings",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your account and organization preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <nav className="lg:w-56 shrink-0">
          <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
            {tabs.map(({ key, label, icon: Icon }) => (
              <li key={key}>
                <button
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium w-full whitespace-nowrap transition-colors ${
                    activeTab === key
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-6">
            <TabIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">{tabLabels[activeTab]}</h2>
          </div>

          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardBody>
                  <div className="flex items-center gap-6">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="h-20 w-20 rounded-full object-cover border-2 border-indigo-300" />
                    ) : profilePhoto ? (
                      <img src={profilePhoto} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700 shrink-0">
                        {user?.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-slate-500 mb-2">Profile Photo</p>
                      <div className="flex flex-wrap gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4" /> Upload New Photo
                        </Button>
                        {(profilePhoto || photoPreview) && (
                          <Button variant="ghost" size="sm" onClick={() => setShowRemoveModal(true)}>
                            <Trash2 className="h-4 w-4 text-red-500" /> Remove Photo
                          </Button>
                        )}
                      </div>
                      {photoPreview && (
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" onClick={handleUploadPhoto}>Save Changes</Button>
                          <Button variant="secondary" size="sm" onClick={handleCancelPhoto}>Cancel</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Full Name</label>
                      <input type="text" defaultValue={user?.name || ""} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Email</label>
                      <input type="email" defaultValue={user?.email || ""} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Phone</label>
                      <input type="tel" defaultValue="+1 (555) 000-0000" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Department</label>
                      <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                        <option>Procurement</option>
                        <option>Finance</option>
                        <option>Operations</option>
                        <option>Manufacturing</option>
                        <option>IT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Role</label>
                      <input type="text" defaultValue={ROLE_LABELS[role]} disabled className="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Employee ID</label>
                      <input type="text" defaultValue={`EMP-${user?.id?.toUpperCase() || "0000"}`} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700">Designation</label>
                      <input type="text" defaultValue={ROLE_LABELS[role]} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === "account" && (
            <Card>
              <CardBody>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Username</label>
                    <input type="text" defaultValue={user?.name?.toLowerCase().replace(/\s/g, ".") || ""} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Primary Email</label>
                    <input type="email" defaultValue={user?.email || ""} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Secondary Email</label>
                    <input type="email" placeholder="backup@email.com" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Language</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Timezone</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>America/Chicago (CST)</option>
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                      <option>Europe/London (GMT)</option>
                      <option>Asia/Kolkata (IST)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave}>Update Account</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader title="Change Password" />
                <CardBody>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Current Password</label>
                      <div className="relative mt-1">
                        <input type={showCurrentPw ? "text" : "password"} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm pr-10" />
                        <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div />
                    <div>
                      <label className="block text-sm font-medium text-slate-700">New Password</label>
                      <div className="relative mt-1">
                        <input type={showNewPw ? "text" : "password"} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm pr-10" />
                        <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                      <div className="relative mt-1">
                        <input type={showConfirmPw ? "text" : "password"} className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm pr-10" />
                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSave}>Update Password</Button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Two-Factor Authentication" />
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Authenticator App</p>
                      <p className="text-sm text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                    <button
                      onClick={() => setTwoFA(!twoFA)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${twoFA ? "bg-indigo-600" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFA ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Recent Login Activity" />
                <CardBody className="p-0">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-left text-xs uppercase text-slate-500">
                        <th className="px-6 py-3">Device</th>
                        <th className="px-6 py-3">Browser</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentLogins.map((login, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-700">{login.device}</td>
                          <td className="px-6 py-4 text-slate-600">{login.browser}</td>
                          <td className="px-6 py-4 text-slate-600">{login.location}</td>
                          <td className="px-6 py-4 text-slate-500">{login.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardBody>
              </Card>
            </div>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardBody className="p-0">
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {notifications.map((n) => (
                      <tr key={n.key} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">{n.label}</p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              setNotifications((prev) =>
                                prev.map((x) =>
                                  x.key === n.key ? { ...x, enabled: !x.enabled } : x
                                )
                              )
                            }
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${n.enabled ? "bg-indigo-600" : "bg-slate-300"}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${n.enabled ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "preferences" && (
            <Card>
              <CardBody>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Default Dashboard</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>Dashboard</option>
                      <option>Analytics</option>
                      <option>Purchase Orders</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Date Format</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Currency</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Language</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave}>Save Preferences</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "organization" && (
            <Card>
              <CardBody>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Organization Name</label>
                    <input type="text" defaultValue="KSV Manufacturing Co." className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Department</label>
                    <input type="text" defaultValue="Procurement" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Manager</label>
                    <input type="text" defaultValue={user?.name || ""} className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Location</label>
                    <input type="text" defaultValue="Chicago, IL" className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Timezone</label>
                    <select className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option>America/Chicago (CST)</option>
                      <option>America/New_York (EST)</option>
                      <option>America/Los_Angeles (PST)</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSave}>Save Organization</Button>
                </div>
              </CardBody>
            </Card>
          )}

          {activeTab === "role-settings" && (
            <RoleSettings role={role} onSave={handleSave} />
          )}

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSave}>Save All Changes</Button>
          </div>
        </div>
      </div>

      {showRemoveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Remove Profile Photo?</h3>
            <p className="mt-2 text-sm text-slate-600">This action will remove your current profile image.</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleRemovePhoto}>Remove</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoleSettings({ role, onSave }: { role: UserRole; onSave: () => void }) {
  const settings = ROLE_SETTINGS[role] || ROLE_SETTINGS.admin;

  return (
    <Card>
      <CardHeader title={settings.title} description={settings.description} />
      <CardBody>
        <div className="space-y-4">
          {settings.items.map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{item.label}</p>
                <p className="text-xs text-slate-500">{item.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.type === "toggle" && (
                  <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-indigo-600">
                    <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-1" />
                  </div>
                )}
                {item.type === "limit" && (
                  <input type="number" defaultValue={item.default} className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-xs text-right" />
                )}
                {item.type === "select" && (
                  <select className="rounded-lg border border-slate-300 px-2 py-1 text-xs">
                    {(item.options || []).map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={onSave}>Save Role Settings</Button>
        </div>
      </CardBody>
    </Card>
  );
}

interface RoleSettingItem {
  key: string;
  label: string;
  description: string;
  type: "toggle" | "limit" | "select";
  default?: string;
  options?: string[];
}

interface RoleSettingGroup {
  title: string;
  description: string;
  items: RoleSettingItem[];
}

const ROLE_SETTINGS: Record<UserRole, RoleSettingGroup> = {
  admin: {
    title: "Admin Settings",
    description: "System-wide permissions and controls",
    items: [
      { key: "user-management", label: "User Management Access", description: "Create, edit, and deactivate users", type: "toggle" },
      { key: "role-management", label: "Role Management", description: "Assign and modify user roles", type: "toggle" },
      { key: "system-permissions", label: "System Permissions", description: "Configure global system permissions", type: "toggle" },
      { key: "vendor-controls", label: "Vendor Controls", description: "Manage vendor registration and access", type: "toggle" },
      { key: "audit-log", label: "Audit Log Access", description: "View system audit logs", type: "toggle" },
    ],
  },
  manager: {
    title: "Manager Settings",
    description: "Approval and department management controls",
    items: [
      { key: "approval-limit", label: "Approval Limits", description: "Maximum PO amount for auto-approval", type: "limit", default: "50000" },
      { key: "approval-permissions", label: "Approval Permissions", description: "Configure approval workflow", type: "toggle" },
      { key: "dept-access", label: "Department Access", description: "Manage department-level access", type: "select", options: ["All", "Finance", "Operations", "Manufacturing"] },
      { key: "risk-threshold", label: "Risk Threshold", description: "Minimum compliance score for auto-approval", type: "limit", default: "75" },
    ],
  },
  procurement: {
    title: "Procurement Officer Settings",
    description: "Procurement and vendor management controls",
    items: [
      { key: "rfq-permissions", label: "RFQ Permissions", description: "Create and manage RFQs", type: "toggle" },
      { key: "vendor-access", label: "Vendor Access", description: "View and manage vendor profiles", type: "toggle" },
      { key: "po-creation", label: "PO Creation Rights", description: "Create purchase orders", type: "toggle" },
      { key: "invoice-mgmt", label: "Invoice Management Rights", description: "Manage and approve invoices", type: "toggle" },
      { key: "budget-limit", label: "Budget Limit", description: "Maximum spend without manager approval", type: "limit", default: "25000" },
    ],
  },
  vendor: {
    title: "Vendor Settings",
    description: "Company profile and business details",
    items: [
      { key: "company-profile", label: "Company Profile", description: "Edit your company information", type: "toggle" },
      { key: "business-details", label: "Business Details", description: "Update business registration info", type: "toggle" },
      { key: "vendor-documents", label: "Vendor Documents", description: "Upload and manage compliance documents", type: "toggle" },
      { key: "gst-info", label: "GST Information", description: "Update tax registration details", type: "toggle" },
      { key: "bank-details", label: "Bank Details", description: "Manage payment and banking information", type: "toggle" },
    ],
  },
};
