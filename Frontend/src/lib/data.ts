export type Status =
  | "active"
  | "pending"
  | "approved"
  | "rejected"
  | "draft"
  | "overdue"
  | "paid"
  | "open"
  | "closed"
  | "expired"
  | "review"
  | "compliant"
  | "at-risk";

export interface Vendor {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  status: Status;
  spendYtd: number;
  contracts: number;
  contactPerson: string;
  joinedDate: string;
  complianceScore: number;
  tags: string[];
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  amount: number;
  status: Status;
  createdAt: string;
  dueDate: string;
  items: number;
  department: string;
}

export interface RFQ {
  id: string;
  title: string;
  vendorIds: string[];
  status: Status;
  deadline: string;
  budget: number;
  responses: number;
  createdAt: string;
  category: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  poId: string;
  amount: number;
  status: Status;
  dueDate: string;
  issuedDate: string;
}

export interface Contract {
  id: string;
  title: string;
  vendorId: string;
  vendorName: string;
  value: number;
  status: Status;
  startDate: string;
  endDate: string;
  type: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  inStock: boolean;
  leadTimeDays: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "success" | "warning";
  read: boolean;
  createdAt: string;
  href: string;
}

export interface Message {
  id: string;
  subject: string;
  vendorId: string;
  vendorName: string;
  preview: string;
  unread: boolean;
  updatedAt: string;
  thread: { id: string; sender: string; body: string; sentAt: string }[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  lastActive: string;
}

export const vendors: Vendor[] = [
  {
    id: "v1",
    name: "Acme Industrial Supply",
    category: "Raw Materials",
    email: "orders@acmeindustrial.com",
    phone: "+1 (555) 201-4400",
    location: "Chicago, IL",
    rating: 4.8,
    status: "active",
    spendYtd: 284500,
    contracts: 3,
    contactPerson: "Sarah Mitchell",
    joinedDate: "2023-03-15",
    complianceScore: 96,
    tags: ["Preferred", "ISO Certified"],
  },
  {
    id: "v2",
    name: "Pacific Logistics Co.",
    category: "Logistics",
    email: "ops@pacificlogistics.com",
    phone: "+1 (555) 882-1102",
    location: "Los Angeles, CA",
    rating: 4.5,
    status: "active",
    spendYtd: 156200,
    contracts: 2,
    contactPerson: "James Park",
    joinedDate: "2022-11-08",
    complianceScore: 88,
    tags: ["Fast Delivery"],
  },
  {
    id: "v3",
    name: "GreenTech Components",
    category: "Electronics",
    email: "sales@greentech.io",
    phone: "+1 (555) 334-9901",
    location: "Austin, TX",
    rating: 4.2,
    status: "review",
    spendYtd: 92300,
    contracts: 1,
    contactPerson: "Elena Rodriguez",
    joinedDate: "2024-01-22",
    complianceScore: 72,
    tags: ["Sustainability"],
  },
  {
    id: "v4",
    name: "Summit Office Solutions",
    category: "Office Supplies",
    email: "procurement@summitoffice.com",
    phone: "+1 (555) 778-3300",
    location: "Denver, CO",
    rating: 4.6,
    status: "active",
    spendYtd: 44800,
    contracts: 1,
    contactPerson: "Michael Chen",
    joinedDate: "2023-08-01",
    complianceScore: 94,
    tags: ["Bulk Discount"],
  },
  {
    id: "v5",
    name: "Nova Packaging Ltd.",
    category: "Packaging",
    email: "hello@novapack.com",
    phone: "+1 (555) 112-8844",
    location: "Portland, OR",
    rating: 3.9,
    status: "at-risk",
    spendYtd: 67800,
    contracts: 2,
    contactPerson: "David Okonkwo",
    joinedDate: "2021-06-14",
    complianceScore: 61,
    tags: ["Renewal Due"],
  },
  {
    id: "v6",
    name: "Atlas Safety Gear",
    category: "Safety Equipment",
    email: "orders@atlassafety.com",
    phone: "+1 (555) 445-2200",
    location: "Houston, TX",
    rating: 4.9,
    status: "active",
    spendYtd: 112400,
    contracts: 2,
    contactPerson: "Lisa Thompson",
    joinedDate: "2022-04-19",
    complianceScore: 98,
    tags: ["Preferred", "OSHA Compliant"],
  },
];

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po1",
    poNumber: "PO-2026-0142",
    vendorId: "v1",
    vendorName: "Acme Industrial Supply",
    amount: 48200,
    status: "approved",
    createdAt: "2026-05-28",
    dueDate: "2026-06-15",
    items: 12,
    department: "Manufacturing",
  },
  {
    id: "po2",
    poNumber: "PO-2026-0138",
    vendorId: "v2",
    vendorName: "Pacific Logistics Co.",
    amount: 22400,
    status: "pending",
    createdAt: "2026-05-25",
    dueDate: "2026-06-10",
    items: 4,
    department: "Operations",
  },
  {
    id: "po3",
    poNumber: "PO-2026-0131",
    vendorId: "v6",
    vendorName: "Atlas Safety Gear",
    amount: 8900,
    status: "approved",
    createdAt: "2026-05-20",
    dueDate: "2026-06-05",
    items: 8,
    department: "Facilities",
  },
  {
    id: "po4",
    poNumber: "PO-2026-0125",
    vendorId: "v3",
    vendorName: "GreenTech Components",
    amount: 35600,
    status: "draft",
    createdAt: "2026-05-18",
    dueDate: "2026-06-20",
    items: 24,
    department: "R&D",
  },
  {
    id: "po5",
    poNumber: "PO-2026-0119",
    vendorId: "v4",
    vendorName: "Summit Office Solutions",
    amount: 3200,
    status: "approved",
    createdAt: "2026-05-12",
    dueDate: "2026-05-30",
    items: 15,
    department: "Admin",
  },
  {
    id: "po6",
    poNumber: "PO-2026-0108",
    vendorId: "v5",
    vendorName: "Nova Packaging Ltd.",
    amount: 18700,
    status: "rejected",
    createdAt: "2026-05-05",
    dueDate: "2026-05-25",
    items: 6,
    department: "Manufacturing",
  },
];

export const rfqs: RFQ[] = [
  {
    id: "rfq1",
    title: "Q3 Steel Sheet Procurement",
    vendorIds: ["v1", "v5"],
    status: "open",
    deadline: "2026-06-20",
    budget: 120000,
    responses: 2,
    createdAt: "2026-05-15",
    category: "Raw Materials",
  },
  {
    id: "rfq2",
    title: "Warehouse Automation Sensors",
    vendorIds: ["v3"],
    status: "open",
    deadline: "2026-06-12",
    budget: 85000,
    responses: 1,
    createdAt: "2026-05-22",
    category: "Electronics",
  },
  {
    id: "rfq3",
    title: "Annual Safety Equipment Refresh",
    vendorIds: ["v6"],
    status: "closed",
    deadline: "2026-05-30",
    budget: 45000,
    responses: 3,
    createdAt: "2026-04-10",
    category: "Safety Equipment",
  },
  {
    id: "rfq4",
    title: "Regional Freight Contract",
    vendorIds: ["v2"],
    status: "pending",
    deadline: "2026-07-01",
    budget: 200000,
    responses: 0,
    createdAt: "2026-05-29",
    category: "Logistics",
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv1",
    invoiceNumber: "INV-88421",
    vendorId: "v1",
    vendorName: "Acme Industrial Supply",
    poId: "po1",
    amount: 48200,
    status: "pending",
    dueDate: "2026-06-30",
    issuedDate: "2026-05-29",
  },
  {
    id: "inv2",
    invoiceNumber: "INV-88390",
    vendorId: "v6",
    vendorName: "Atlas Safety Gear",
    poId: "po3",
    amount: 8900,
    status: "approved",
    dueDate: "2026-06-15",
    issuedDate: "2026-05-21",
  },
  {
    id: "inv3",
    invoiceNumber: "INV-88312",
    vendorId: "v4",
    vendorName: "Summit Office Solutions",
    poId: "po5",
    amount: 3200,
    status: "paid",
    dueDate: "2026-05-28",
    issuedDate: "2026-05-13",
  },
  {
    id: "inv4",
    invoiceNumber: "INV-88205",
    vendorId: "v2",
    vendorName: "Pacific Logistics Co.",
    poId: "po2",
    amount: 22400,
    status: "overdue",
    dueDate: "2026-05-20",
    issuedDate: "2026-05-01",
  },
  {
    id: "inv5",
    invoiceNumber: "INV-88144",
    vendorId: "v5",
    vendorName: "Nova Packaging Ltd.",
    poId: "po6",
    amount: 18700,
    status: "rejected",
    dueDate: "2026-05-15",
    issuedDate: "2026-04-28",
  },
];

export const contracts: Contract[] = [
  {
    id: "c1",
    title: "Master Supply Agreement 2026",
    vendorId: "v1",
    vendorName: "Acme Industrial Supply",
    value: 500000,
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    type: "MSA",
  },
  {
    id: "c2",
    title: "Freight Services SLA",
    vendorId: "v2",
    vendorName: "Pacific Logistics Co.",
    value: 180000,
    status: "active",
    startDate: "2025-07-01",
    endDate: "2026-06-30",
    type: "SLA",
  },
  {
    id: "c3",
    title: "Component Supply NDA + SOW",
    vendorId: "v3",
    vendorName: "GreenTech Components",
    value: 95000,
    status: "review",
    startDate: "2026-03-01",
    endDate: "2027-02-28",
    type: "SOW",
  },
  {
    id: "c4",
    title: "Packaging Materials Agreement",
    vendorId: "v5",
    vendorName: "Nova Packaging Ltd.",
    value: 75000,
    status: "expired",
    startDate: "2024-06-01",
    endDate: "2025-05-31",
    type: "MSA",
  },
];

export const products: Product[] = [
  {
    id: "p1",
    sku: "STL-304-2MM",
    name: "Stainless Steel Sheet 304 2mm",
    category: "Raw Materials",
    vendorId: "v1",
    vendorName: "Acme Industrial Supply",
    unitPrice: 42.5,
    inStock: true,
    leadTimeDays: 7,
  },
  {
    id: "p2",
    sku: "LOG-FRT-REG",
    name: "Regional Freight — Pallet",
    category: "Logistics",
    vendorId: "v2",
    vendorName: "Pacific Logistics Co.",
    unitPrice: 185,
    inStock: true,
    leadTimeDays: 2,
  },
  {
    id: "p3",
    sku: "ELC-SNS-IR40",
    name: "IR Proximity Sensor 40cm",
    category: "Electronics",
    vendorId: "v3",
    vendorName: "GreenTech Components",
    unitPrice: 28.9,
    inStock: false,
    leadTimeDays: 21,
  },
  {
    id: "p4",
    sku: "OFF-PPR-A4",
    name: "Recycled Copy Paper A4 (case)",
    category: "Office Supplies",
    vendorId: "v4",
    vendorName: "Summit Office Solutions",
    unitPrice: 34.99,
    inStock: true,
    leadTimeDays: 3,
  },
  {
    id: "p5",
    sku: "PKG-CRD-BC",
    name: "Corrugated Box — Bulk Crate",
    category: "Packaging",
    vendorId: "v5",
    vendorName: "Nova Packaging Ltd.",
    unitPrice: 12.4,
    inStock: true,
    leadTimeDays: 5,
  },
  {
    id: "p6",
    sku: "SAF-HLM-PRO",
    name: "Industrial Safety Helmet Pro",
    category: "Safety Equipment",
    vendorId: "v6",
    vendorName: "Atlas Safety Gear",
    unitPrice: 67.0,
    inStock: true,
    leadTimeDays: 4,
  },
];

export const notifications: Notification[] = [
  {
    id: "n1",
    title: "Invoice overdue",
    message: "INV-88205 from Pacific Logistics is 16 days overdue.",
    type: "alert",
    read: false,
    createdAt: "2026-06-05T09:00:00Z",
    href: "/invoices/inv4",
  },
  {
    id: "n2",
    title: "RFQ response received",
    message: "Acme Industrial submitted a quote for Q3 Steel Sheet Procurement.",
    type: "info",
    read: false,
    createdAt: "2026-06-04T14:30:00Z",
    href: "/rfqs/rfq1",
  },
  {
    id: "n3",
    title: "PO approved",
    message: "PO-2026-0142 was approved by Finance.",
    type: "success",
    read: false,
    createdAt: "2026-06-03T11:15:00Z",
    href: "/purchase-orders/po1",
  },
  {
    id: "n4",
    title: "Compliance review needed",
    message: "Nova Packaging compliance score dropped below threshold.",
    type: "warning",
    read: true,
    createdAt: "2026-06-02T08:00:00Z",
    href: "/compliance",
  },
  {
    id: "n5",
    title: "Contract expiring soon",
    message: "Freight Services SLA expires in 24 days.",
    type: "warning",
    read: true,
    createdAt: "2026-06-01T10:00:00Z",
    href: "/contracts/c2",
  },
  {
    id: "n6",
    title: "New vendor message",
    message: "Sarah Mitchell sent a message about delivery schedules.",
    type: "info",
    read: true,
    createdAt: "2026-05-31T16:45:00Z",
    href: "/messages/m1",
  },
];

export const messages: Message[] = [
  {
    id: "m1",
    subject: "Delivery schedule for PO-2026-0142",
    vendorId: "v1",
    vendorName: "Acme Industrial Supply",
    preview: "Hi team, confirming shipment for June 12...",
    unread: true,
    updatedAt: "2026-05-31T16:45:00Z",
    thread: [
      {
        id: "t1",
        sender: "Sarah Mitchell",
        body: "Hi team, confirming shipment for PO-2026-0142 will depart our Chicago facility on June 12. Expected delivery June 15. Please confirm receiving dock availability.",
        sentAt: "2026-05-31T16:45:00Z",
      },
      {
        id: "t2",
        sender: "You",
        body: "Thanks Sarah. Dock B is available 8am–4pm on the 15th. Please share tracking once shipped.",
        sentAt: "2026-05-31T17:10:00Z",
      },
    ],
  },
  {
    id: "m2",
    subject: "Rate adjustment proposal",
    vendorId: "v2",
    vendorName: "Pacific Logistics Co.",
    preview: "Following our Q2 review, we'd like to discuss...",
    unread: false,
    updatedAt: "2026-05-28T10:00:00Z",
    thread: [
      {
        id: "t3",
        sender: "James Park",
        body: "Following our Q2 review, we'd like to discuss a 3% rate adjustment effective July 1, tied to fuel index changes. Happy to schedule a call.",
        sentAt: "2026-05-28T10:00:00Z",
      },
    ],
  },
  {
    id: "m3",
    subject: "Component lead time update",
    vendorId: "v3",
    vendorName: "GreenTech Components",
    preview: "IR Proximity Sensor lead times extended to 21 days...",
    unread: false,
    updatedAt: "2026-05-25T09:30:00Z",
    thread: [
      {
        id: "t4",
        sender: "Elena Rodriguez",
        body: "IR Proximity Sensor (ELC-SNS-IR40) lead times extended to 21 days due to chip allocation. Alternative SKU ELC-SNS-IR25 available in 10 days.",
        sentAt: "2026-05-25T09:30:00Z",
      },
    ],
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "u1",
    name: "Alex Rivera",
    email: "alex.rivera@company.com",
    role: "Admin",
    department: "Procurement",
    lastActive: "2026-06-05T08:30:00Z",
  },
  {
    id: "u2",
    name: "Jordan Kim",
    email: "jordan.kim@company.com",
    role: "Approver",
    department: "Finance",
    lastActive: "2026-06-04T17:00:00Z",
  },
  {
    id: "u3",
    name: "Sam Patel",
    email: "sam.patel@company.com",
    role: "Buyer",
    department: "Manufacturing",
    lastActive: "2026-06-05T09:15:00Z",
  },
  {
    id: "u4",
    name: "Taylor Brooks",
    email: "taylor.brooks@company.com",
    role: "Viewer",
    department: "Operations",
    lastActive: "2026-06-01T12:00:00Z",
  },
];

export const dashboardStats = {
  activeVendors: vendors.filter((v) => v.status === "active").length,
  openPOs: purchaseOrders.filter((p) => p.status === "pending" || p.status === "approved").length,
  pendingInvoices: invoices.filter((i) => i.status === "pending" || i.status === "overdue").length,
  spendYtd: vendors.reduce((sum, v) => sum + v.spendYtd, 0),
  openRfqs: rfqs.filter((r) => r.status === "open").length,
  complianceIssues: vendors.filter((v) => v.complianceScore < 75).length,
};

export function getVendor(id: string) {
  return vendors.find((v) => v.id === id);
}

export function getPO(id: string) {
  return purchaseOrders.find((p) => p.id === id);
}

export function getRFQ(id: string) {
  return rfqs.find((r) => r.id === id);
}

export function getInvoice(id: string) {
  return invoices.find((i) => i.id === id);
}

export function getContract(id: string) {
  return contracts.find((c) => c.id === id);
}

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}

export function getMessage(id: string) {
  return messages.find((m) => m.id === id);
}

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Vendors", href: "/vendors", icon: "Building2" },
  { label: "Purchase Orders", href: "/purchase-orders", icon: "ShoppingCart" },
  { label: "RFQs", href: "/rfqs", icon: "FileQuestion" },
  { label: "Invoices", href: "/invoices", icon: "Receipt" },
  { label: "Contracts", href: "/contracts", icon: "FileSignature" },
  { label: "Catalog", href: "/catalog", icon: "Package" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Compliance", href: "/compliance", icon: "ShieldCheck" },
];

export const settingsNav = [
  { label: "General", href: "/settings" },
  { label: "Profile", href: "/settings/profile" },
  { label: "Team", href: "/settings/team" },
  { label: "Billing", href: "/settings/billing" },
  { label: "Integrations", href: "/settings/integrations" },
];
