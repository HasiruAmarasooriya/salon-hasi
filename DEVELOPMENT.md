# Salon Hasi — Development Guide

Roadmap for the salon website with admin panel, billing, and online booking.

---

## Tech stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16** (App Router) | SEO, fast pages, API routes |
| Styling | **Tailwind CSS 4** | Professional UI quickly |
| Database | **Firebase Firestore** | Cloud NoSQL, scales with traffic |
| Auth | **Firebase Authentication** | Email/password for admin & customers |
| Images | Local `public/uploads` or Google Drive | Service & gallery photos |
| Payments (optional) | **Stripe** or local gateway | Online deposits |

---

## Project structure

```
salon-hasi/
├── config/firebaseConfig.js     # Browser Firebase (env-based)
├── scripts/seed-firestore.ts    # Seed Firestore + admin user
├── src/
│   ├── lib/
│   │   ├── firebase/            # Admin SDK, auth helpers, client
│   │   ├── firestore/           # All database reads/writes
│   │   └── types/database.ts    # TypeScript models
│   ├── app/
│   │   ├── (public)/            # Customer website
│   │   └── admin/               # Admin panel
│   └── components/
└── .env                         # Firebase keys (not committed)
```

### Firestore collections

| Collection | Purpose |
|------------|---------|
| `users` | Profiles (role: ADMIN, STAFF, CUSTOMER) — doc id = Firebase Auth uid |
| `serviceCategories` | Hair, beard, nails, etc. |
| `services` | Prices, duration, images |
| `staff` | Stylists |
| `appointments` | Bookings (embedded service lines) |
| `invoices` | Billing (embedded line items) |
| `galleryImages` | Portfolio photos |
| `siteSettings` | Phone, hours, promos (doc id = setting key) |
| `contactMessages` | Contact form inbox |

---

## Local setup

1. Firebase Console: enable **Authentication** (Email/Password) and **Firestore**.
2. Copy `.env.example` → `.env` and fill `NEXT_PUBLIC_FIREBASE_*` + `FIREBASE_SERVICE_ACCOUNT_JSON`.
3. Install and seed:

```bash
npm install
npm run db:seed
npm run dev
```

- **Site:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin/login — `admin@salonhasi.com` / `Admin@123`

---

## Phase status

### Phase 1 — Foundation ✅

- Public site, categories, sample services, admin shell

### Phase 2 — Database & dynamic content ✅

- Firestore CRUD via API routes
- Booking, services, gallery, settings from database
- Seed script for initial data

### Phase 3 — Admin auth & billing ✅ (core)

- Firebase Auth + role-based admin access
- Invoices, appointments, messages

### Phase 4 — Polish & production

- Replace stock images with salon photos
- Email/SMS booking confirmations
- Deploy on Vercel with production Firebase project

---

## Deploy (Vercel)

Set environment variables in Vercel project settings:

- All `NEXT_PUBLIC_FIREBASE_*` values
- `FIREBASE_SERVICE_ACCOUNT_JSON` (full JSON string)
- Optional: `GOOGLE_DRIVE_*` for Drive uploads

```bash
npm run build
```

Use Firebase Console to manage data, rules, and indexes.

---

## Commands

```bash
npm run dev          # Development server
npm run build        # Production build
npm run db:seed      # Seed Firestore + create admin (Firebase Auth)
npm run lint         # ESLint
```

---

## Customize

- Branding: `src/lib/constants.ts`
- Fallback sample data: `src/data/services.ts`, `src/data/gallery.ts`
- After seed, edit content in admin panel or Firebase Console
