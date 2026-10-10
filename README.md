# Smart Seasonal Fruit Marketplace

Harvest & Hue is a Next.js App Router storefront for discovering fruit by season. It currently includes the public storefront, product catalogue, local product image route, seasonal calendar, Auth.js credentials authentication, Prisma/PostgreSQL schema, and protected customer/admin route foundations.

## Current status

This is a runnable storefront foundation, not a complete payment-enabled e-commerce system. The public catalogue, seasonal guide, credentials authentication, Prisma-backed cart, and protected route foundations are implemented. Wishlist persistence, checkout, orders, reviews, Razorpay, Cloudinary uploads, and full admin CRUD still require implementation.

## Stack and structure

- Next.js 14 App Router, React 18, TypeScript
- Auth.js credentials provider with JWT sessions
- Prisma 6 and PostgreSQL/Neon
- Zod validation and bcrypt password hashing
- `app/` routes and API handlers
- `components/` reusable UI
- `actions/` server actions
- `lib/auth`, `lib/db`, `lib/data`, and `lib/seasonal`
- `prisma/schema.prisma` and `prisma/seed.ts`

## Local setup

Requirements: Node.js 20+, npm, and a reachable PostgreSQL database.

```bash
npm install
copy .env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

For migration-based environments, use `npm run db:migrate` locally and `npx prisma migrate deploy` in a controlled production release. Do not run development migrations against production.

## Environment variables

Copy `.env.example` to `.env` and set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL`. Cloudinary and Razorpay variables are documented for future integrations but are not currently used. Never commit `.env` or expose server secrets through `NEXT_PUBLIC_*` variables.

## Authentication

Registration creates a customer with a bcrypt password hash and initializes cart/wishlist records. Login uses Auth.js credentials and JWT sessions. `/account`, `/cart`, `/wishlist`, `/checkout`, and `/orders` require authentication; `/admin` requires the `ADMIN` role on the server and in middleware.

The seed never contains default passwords. Set `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_CUSTOMER_EMAIL`, and `SEED_CUSTOMER_PASSWORD` locally if you want demo accounts; otherwise the catalogue is seeded without users.

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

Run the production build after stopping any active development server and clearing stale `.next` output if necessary. Do not run development and production builds concurrently.

## Deployment notes

### Vercel

Deploy this Next.js project as one application. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` in Vercel Project Settings. Run `npx prisma migrate deploy` from a controlled release environment before using a new schema. No separate backend is required for the current architecture.

### Render

Render is not required for the current application server. It can host PostgreSQL or a later worker, but do not deploy a duplicate backend unless a separate service is actually added.

### Payments and media

Razorpay and Cloudinary are not yet wired into the current UI or API. Do not advertise checkout or image uploads as production features until server-side signatures, validation, webhooks, and failure handling are implemented. The image endpoint currently serves generated SVG artwork, not original fruit photography.
