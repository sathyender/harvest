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

Deploy this Next.js project as one application. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` for the Vercel Production environment (and Preview if you test preview deployments). `AUTH_SECRET` must be a stable random value; generate it with `npx auth secret`. Vercel builds do not run this project's `prestart` script, so apply schema migrations with `npx prisma migrate deploy` from a controlled release environment before serving the deployment. For a new empty database, run `npx tsx prisma/seed.ts` once to create the catalogue and inventory. Register a production account at `/register`; local users are not copied to the hosted database. After changing Vercel variables, redeploy.

### Render

Create a Node web service with Node.js 20 or newer, build command `npm install && npm run build`, and start command `npm start`. Set `DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET`, and `NEXT_PUBLIC_APP_URL` in the service environment. Running `npm start` invokes the `prestart` script, which applies migrations and runs the seed. On an empty database the seed creates the catalogue and inventory; it creates demo users only when all four `SEED_*` variables are set. Create a normal production account through `/register` when those demo variables are not configured. The seed intentionally skips production databases that already contain products.

### Payments and media

Razorpay and Cloudinary are not yet wired into the current UI or API. Do not advertise checkout or image uploads as production features until server-side signatures, validation, webhooks, and failure handling are implemented. The image endpoint currently serves generated SVG artwork, not original fruit photography.
