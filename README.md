# Salon Hasi

Premium salon website built with **Next.js**, **Tailwind CSS**, and **Firebase** (Firestore + Authentication).

## Quick start

1. Create a Firebase project and enable **Authentication** (Email/Password) and **Firestore**.
2. Copy env template and fill in your Firebase values:

```bash
copy .env.example .env
```

Use the values from Firebase Console → Project settings → Your apps (web).  
For the server, add credentials (**required** for admin login and database):

- **Option A:** `FIREBASE_SERVICE_ACCOUNT_JSON` — paste the full service account JSON in `.env` on one line, or  
- **Option B:** Save the downloaded key as `firebase-service-account.json` in the project root and set `GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json`

3. Install and seed:

```bash
npm install
npm run db:seed
npm run dev
```

- **Website:** http://localhost:3000  
- **Admin login:** http://localhost:3000/admin/login  
- **Default admin:** `admin@salonhasi.com` / `Admin@123` (created by seed)

## Firebase config

Client config lives in environment variables (`NEXT_PUBLIC_FIREBASE_*`), not hardcoded.  
`config/firebaseConfig.js` re-exports the client app for legacy imports.

## Data

All app data is stored in **Firestore** collections: users, services, appointments, invoices, gallery, etc.  
`npm run db:seed` populates sample data and the admin account.

## Removed (legacy)

Prisma, SQLite (`prisma/dev.db`), and `better-sqlite3` are no longer used. All data is in **Firestore**.

See **[DEVELOPMENT.md](./DEVELOPMENT.md)** for the full roadmap.
