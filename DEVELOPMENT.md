# Salon Hasi — Step-by-Step Development Guide

This document is your roadmap from **Phase 1 (done)** to a full production salon website with admin panel, billing, and online booking.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16** (App Router) | SEO, fast pages, API routes |
| Styling | **Tailwind CSS 4** | Professional UI quickly |
| Database | **Prisma + SQLite** (dev) → Postgres (prod) | Typesafe data |
| Auth (Phase 3) | **NextAuth.js** | Admin & staff login |
| Images (Phase 4) | **Cloudinary** or Uploadthing | Service photos upload |
| Payments (optional) | **Stripe** or local gateway | Online deposits |

---

## Project structure

```
salon-hasi/
├── prisma/schema.prisma    # Database models (ready)
├── src/
│   ├── app/
│   │   ├── (public)/       # Customer website
│   │   │   ├── page.tsx          # Home
│   │   │   ├── services/         # All services + by category
│   │   │   ├── book/             # Booking form
│   │   │   └── contact/
│   │   └── admin/          # Admin panel
│   │       ├── page.tsx          # Dashboard
│   │       ├── services/         # Manage prices & images
│   │       ├── appointments/
│   │       └── billing/
│   ├── components/
│   ├── data/services.ts    # Sample services (replace with DB)
│   └── lib/
└── DEVELOPMENT.md          # This file
```

---

## Phase 1 — Foundation ✅ (Current)

**Goal:** Beautiful public site + admin shell + data model.

- [x] Next.js + Tailwind + luxury theme (gold / dark / cream)
- [x] Home, Services, Book, Contact pages
- [x] Service categories: Hair, Beard, Nails, Foot, Facial, Packages
- [x] Sample services with **prices, duration, images**
- [x] Admin layout: Dashboard, Services table, Billing & Appointments placeholders
- [x] Prisma schema: User, Service, Appointment, Invoice, Staff, Gallery

**Run locally:**

```bash
cd salon-hasi
npm run dev
```

Open: http://localhost:3000 (site) · http://localhost:3000/admin (panel)

---

## Phase 2 — Database & dynamic content

**Goal:** Admin edits services; customers book for real.

### Step 2.1 — Run migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### Step 2.2 — Seed database

Create `prisma/seed.ts` with categories + services from `src/data/services.ts`.

Add to `package.json`:

```json
"prisma": { "seed": "npx tsx prisma/seed.ts" }
```

Run: `npx prisma db seed`

### Step 2.3 — API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/services` | GET | List services (filter by category) |
| `/api/services` | POST | Admin: create service |
| `/api/services/[id]` | PATCH/DELETE | Admin: update/delete |
| `/api/appointments` | POST | Customer booking |
| `/api/appointments` | GET | Admin: list by date |

### Step 2.4 — Connect pages

- Replace `src/data/services.ts` reads with Prisma in Server Components
- Booking form → `POST /api/appointments`
- Admin services → forms with image URL or upload

### Step 2.5 — Service features to implement

| Feature | Admin | Public |
|---------|-------|--------|
| Hair styles + prices + images | CRUD | Grid + book |
| Beard cut types | CRUD | Category page |
| Nail cleanup / manicure | CRUD | Category page |
| Foot cleanup / spa | CRUD | Category page |
| Combo packages | CRUD | Featured section |

---

## Phase 3 — Admin auth & billing

**Goal:** Only staff can access `/admin`; generate invoices.

### Step 3.1 — Authentication

1. Install: `npm install next-auth @auth/prisma-adapter bcryptjs`
2. Add `User` roles: `ADMIN`, `STAFF`, `CUSTOMER`
3. Protect `/admin/*` with middleware
4. Login page: `/admin/login`

### Step 3.2 — Billing module

**Models:** `Invoice`, `InvoiceItem` (already in schema)

**Admin flows:**

1. New invoice → pick customer (or walk-in)
2. Add line items from services (auto price)
3. Apply tax % and discount
4. Mark as Paid → store `paidAt`
5. Export PDF (use `@react-pdf/renderer` or print CSS)

**Invoice number format:** `SH-2026-0001` (auto-increment)

### Step 3.3 — Link appointment → invoice

When appointment status = `COMPLETED`, offer "Create invoice" with pre-filled services.

---

## Phase 4 — Polish & production

### Design

- Replace Unsplash URLs with your salon photos (Cloudinary)
- Add gallery page from `GalleryImage` model
- Testimonials, team/staff page
- WhatsApp "Book now" button

### UX

- Email/SMS confirmation on booking (Resend, Twilio)
- Loading states, toast notifications (sonner)
- Mobile-first admin sidebar

### Deploy

1. Push to GitHub
2. Deploy on [Vercel](https://vercel.com)
3. Use **Neon** or **Supabase** Postgres — update `DATABASE_URL`
4. Set env vars: `DATABASE_URL`, `NEXTAUTH_SECRET`, image API keys

---

## Feature checklist (full salon)

### Customer site

- [x] Homepage hero & categories
- [x] Services with prices & images
- [x] Category pages (hair, beard, nails, foot…)
- [x] Booking form UI
- [ ] Online payment / deposit
- [ ] Customer accounts & booking history
- [ ] Reviews & gallery

### Admin panel

- [x] Dashboard shell
- [x] Services list (read-only sample)
- [ ] Create/edit/delete services + upload images
- [ ] Appointments calendar
- [ ] Billing & invoices + PDF
- [ ] Staff management & schedules
- [ ] Reports (daily revenue, popular services)
- [ ] Site settings (phone, hours, address)

---

## Recommended timeline

| Week | Focus |
|------|--------|
| 1 | Phase 1 ✅ + customize branding & real prices |
| 2 | Phase 2 — database, booking API, admin CRUD |
| 3 | Phase 3 — auth, billing, invoices |
| 4 | Phase 4 — images, notifications, deploy |

---

## Customize your salon

Edit `src/lib/constants.ts` for name, phone, address, hours.

Edit `src/data/services.ts` (or database after Phase 2) for your real:

- Haircut types & LKR prices  
- Beard styles  
- Nail cleanup / gel / pedicure  
- Foot cleanup & spa  
- Packages  

---

## Commands reference

```bash
npm run dev          # Start development
npm run build        # Production build
npx prisma studio    # Visual database browser
npx prisma migrate dev
```

---

## Need help on the next phase?

Ask to implement **Phase 2** (database + booking API + admin CRUD) and we can build it step by step in your project.
