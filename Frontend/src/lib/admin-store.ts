import type { Status, Vendor } from "@/lib/data";
import { vendors as seedVendors, teamMembers as seedTeamMembers } from "@/lib/data";

export interface VendorRegistration extends Vendor {
  vendorCode: string;
  vendorType: string;
  alternatePhone?: string;
  gstNumber?: string;
  panNumber?: string;
  companyRegNumber?: string;
  website?: string;
  country?: string;
  state?: string;
  city?: string;
  addressLine?: string;
  postalCode?: string;
  priorityLevel: "Tier 1" | "Tier 2" | "Tier 3";
  isDraft?: boolean;
  documents?: string[];
}

export interface InvitedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  permissions: string[];
  inviteMessage?: string;
  status: "invited" | "draft";
  invitedAt: string;
}

const VENDORS_KEY = "vb_admin_vendors";
const VENDOR_DRAFTS_KEY = "vb_admin_vendor_drafts";
const USERS_KEY = "vb_admin_users";
const USER_DRAFTS_KEY = "vb_admin_user_drafts";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function generateVendorCode(): string {
  const num = Date.now().toString(36).toUpperCase().slice(-6);
  return `VND-${num}`;
}

export function getAllVendors(): VendorRegistration[] {
  const extra = read<VendorRegistration>(VENDORS_KEY);
  const drafts = read<VendorRegistration>(VENDOR_DRAFTS_KEY);
  return [
    ...seedVendors.map((v) => ({
      ...v,
      vendorCode: `VND-${v.id.toUpperCase()}`,
      vendorType: "Supplier",
      priorityLevel: "Tier 1" as const,
    })),
    ...extra,
    ...drafts.filter((d) => d.isDraft),
  ];
}

export function getRegisteredVendors(): VendorRegistration[] {
  return getAllVendors().filter((v) => !v.isDraft);
}

export function saveVendor(
  vendor: Omit<VendorRegistration, "id">,
  asDraft: boolean
): VendorRegistration {
  const entry: VendorRegistration = {
    ...vendor,
    id: `v-${Date.now()}`,
    status: asDraft ? "draft" : "active",
    isDraft: asDraft,
    spendYtd: 0,
    contracts: 0,
    complianceScore: 85,
    joinedDate: new Date().toISOString().split("T")[0],
    tags: [vendor.priorityLevel],
  };

  if (asDraft) {
    const drafts = read<VendorRegistration>(VENDOR_DRAFTS_KEY);
    drafts.push(entry);
    write(VENDOR_DRAFTS_KEY, drafts);
  } else {
    const list = read<VendorRegistration>(VENDORS_KEY);
    list.push({ ...entry, isDraft: false });
    write(VENDORS_KEY, list);
    const drafts = read<VendorRegistration>(VENDOR_DRAFTS_KEY);
    write(
      VENDOR_DRAFTS_KEY,
      drafts.filter((d) => d.vendorCode !== vendor.vendorCode)
    );
  }
  return entry;
}

export function getAllTeamMembers(): InvitedUser[] {
  const invited = read<InvitedUser>(USERS_KEY);
  const drafts = read<InvitedUser>(USER_DRAFTS_KEY);
  const seed = seedTeamMembers.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: "",
    department: m.department,
    role: m.role,
    permissions: [] as string[],
    status: "invited" as const,
    invitedAt: m.lastActive,
  }));
  return [...seed, ...invited, ...drafts.filter((d) => d.status === "draft")];
}

export function saveInvitation(
  user: Omit<InvitedUser, "id" | "invitedAt" | "status">,
  asDraft: boolean
): InvitedUser {
  const entry: InvitedUser = {
    ...user,
    id: `u-${Date.now()}`,
    status: asDraft ? "draft" : "invited",
    invitedAt: new Date().toISOString(),
  };

  if (asDraft) {
    const drafts = read<InvitedUser>(USER_DRAFTS_KEY);
    drafts.push(entry);
    write(USER_DRAFTS_KEY, drafts);
  } else {
    const list = read<InvitedUser>(USERS_KEY);
    list.push(entry);
    write(USERS_KEY, list);
    write(
      USER_DRAFTS_KEY,
      read<InvitedUser>(USER_DRAFTS_KEY).filter((d) => d.email !== user.email)
    );
  }
  return entry;
}

export const TOAST_KEY = "vb_toast";

export function setPendingToast(message: string) {
  sessionStorage.setItem(TOAST_KEY, JSON.stringify({ message, type: "success" }));
}

export function consumePendingToast(): { message: string; type: string } | null {
  const raw = sessionStorage.getItem(TOAST_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(TOAST_KEY);
  return JSON.parse(raw);
}
