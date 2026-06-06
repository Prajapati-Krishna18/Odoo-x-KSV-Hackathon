# VendorBridge

Enterprise vendor management SaaS with **role-based authentication and authorization**.

## Getting Started

```bash
npm install
npm run dev
```

- **Marketing:** http://localhost:3000
- **Login:** http://localhost:3000/login

## Demo Accounts

All accounts use password: `password`

| Role | Email | Dashboard |
|------|-------|-----------|
| Admin | admin@vendorbridge.io | `/admin/dashboard` |
| Procurement Officer | procurement@vendorbridge.io | `/procurement/dashboard` |
| Manager | manager@vendorbridge.io | `/manager/dashboard` |
| Vendor | vendor@acme.com | `/vendor/dashboard` |

## Authentication & Authorization

- **Session:** HMAC-signed HTTP-only cookie (`vb_session`)
- **Remember me:** 30-day session vs 24-hour default
- **Middleware:** Protects all role-prefixed routes
- **Role isolation:** Cross-role access redirects to `/403`
- **Legacy routes:** Old `/dashboard`, `/vendors`, etc. redirect to role dashboard

## Role Modules

### Admin
Dashboard, Users, Vendors, RFQs, Approvals, POs, Invoices, Analytics, System Logs, Settings

### Procurement Officer
Dashboard, Create RFQ, RFQs, Quotations, Vendor Intelligence, POs, Invoices, Analytics, Settings

### Manager
Dashboard, Approvals, Approval History, Risk Center, Analytics, Settings

### Vendor
Dashboard, RFQs, Submit Quotation, Purchase Orders, Profile, Settings

## Tech Stack

Next.js 16 · TypeScript · Tailwind CSS · Edge middleware · Web Crypto sessions
