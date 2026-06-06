# VendorBridge: Full-Stack Vendor Management SaaS

VendorBridge is an enterprise-grade vendor management SaaS featuring a modern Frontend interface and a robust Express & Prisma backend.

## Project Structure

This repository is organized as a monorepo containing:
- **`Frontend/`**: A Next.js application built with TypeScript, Tailwind CSS, Edge middleware, and Web Crypto sessions.
- **`backend/`**: A REST API backend built with Express.js, TypeScript, Prisma ORM, and PostgreSQL.

---

## 1. Frontend (Next.js Application)

Enterprise vendor management interface with **role-based authentication and authorization**.

### Getting Started

Navigate to the `Frontend` directory, install dependencies, and start the development server:

```bash
cd Frontend
npm install
npm run dev
```

- **Marketing Page:** `http://localhost:3000`
- **Login Page:** `http://localhost:3000/login`

### Demo Accounts

All accounts use password: `password`

| Role | Email | Dashboard |
|------|-------|-----------|
| Admin | admin@vendorbridge.io | `/admin/dashboard` |
| Procurement Officer | procurement@vendorbridge.io | `/procurement/dashboard` |
| Manager | manager@vendorbridge.io | `/manager/dashboard` |
| Vendor | vendor@acme.com | `/vendor/dashboard` |

### Key Features & Architecture
- **Authentication:** HMAC-signed HTTP-only cookie (`vb_session`).
- **Remember me:** 30-day session vs 24-hour default.
- **Middleware:** Edge middleware protecting all role-prefixed routes.
- **Role Isolation:** Cross-role access redirects to `/403`.
- **Legacy Routes:** Old `/dashboard`, `/vendors`, etc., redirect to the correct role dashboard.

---

## 2. Backend (Express & Prisma REST API)

A robust TypeScript backend utilizing Express and Prisma ORM to manage database interactions.

### Getting Started

Navigate to the `backend` directory, configure the environment, and start the server:

```bash
cd backend
npm install
```

#### Database Setup & Configuration

1. Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="your-postgresql-database-url"
   ```
2. Run database migrations to set up the tables (`User`, `Post`, etc.):
   ```bash
   npx prisma migrate dev --name init
   ```
3. Run the database seed script to populate sample data:
   ```bash
   npx prisma db seed
   ```

#### Start the Server

Start the backend development server:
```bash
npm run dev
```

The REST API will be running at `http://localhost:3000`.

---

## Tech Stack Summary

- **Frontend:** Next.js, React, Tailwind CSS, TypeScript
- **Backend:** Express.js, TypeScript, Node.js
- **Database & ORM:** PostgreSQL, Prisma ORM
