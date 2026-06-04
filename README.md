# Salon Hasi

Premium salon website built with **Next.js**, **Tailwind CSS**, and **Prisma**.

## Quick start

```bash
cd salon-hasi
npm install
npm run db:generate   # only if postinstall was skipped
npm run dev
```

- **Website:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin  

## What's included (Phase 1)

- Luxury-themed public site (home, services, book, contact)
- Service categories: hair, beard, nails, foot spa, facial, packages
- Sample services with prices, duration, and images
- Admin panel layout (dashboard, services table, billing & appointments placeholders)
- Full database schema in `prisma/schema.prisma`

See **[DEVELOPMENT.md](./DEVELOPMENT.md)** for the complete step-by-step roadmap (Phases 2–4: database, auth, billing, deploy).

## Project location

The app lives in `salon-hasi/` (npm requires lowercase package names). Your `Salon-Hasi/` folder can stay as the git remote root or you can move `.git` into `salon-hasi/` when ready.
