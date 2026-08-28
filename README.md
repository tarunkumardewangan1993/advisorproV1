# Advisor Pro

Mobile-first CRM for insurance and mutual fund advisors.

**Stack:** Next.js 15 (App Router, webpack) · Tailwind CSS · Serwist PWA · Supabase (Postgres only) · Prisma 6 · NextAuth v5 (Credentials) · Zod · bcryptjs.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in real values (see below).
3. Run migrations and seed the database:
   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```
   This creates the initial admin user: `userUid=ADM001`, `password=ChangeMe123!` — **change it immediately** via Profile after first login.
4. Start the dev server (PWA/service worker is disabled in dev by design):
   ```bash
   npm run dev
   ```

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase pooled connection (PgBouncer, port **6543**, `?pgbouncer=true`). Used by the app at runtime. |
| `DIRECT_URL` | Supabase direct connection (port **5432**). Used only by Prisma Migrate. |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32`. |
| `AUTH_TRUST_HOST` | Set to `true` (required on Vercel). |

## Partial unique indexes (important — one manual step)

Business UIDs, mobile numbers, and emails on `User`/`Client`/`Lead` must be unique **only among non-deleted rows**, so a soft-deleted record's UID/mobile/email is immediately reusable. Prisma's schema DSL cannot express a `WHERE` clause on `@@unique`, so `prisma/schema.prisma` only declares plain (non-unique) `@@index`es for these columns, and the real partial unique indexes are added by hand to the migration SQL:

1. Generate the migration without applying it:
   ```bash
   npx prisma migrate dev --name init --create-only
   ```
2. Open the generated `prisma/migrations/<timestamp>_init/migration.sql` and append:
   ```sql
   CREATE UNIQUE INDEX "users_uid_active_unique" ON "users" ("userUid") WHERE "deletedAt" IS NULL;
   CREATE UNIQUE INDEX "users_mobile_active_unique" ON "users" ("mobile") WHERE "deletedAt" IS NULL;
   CREATE UNIQUE INDEX "users_email_active_unique" ON "users" ("email") WHERE "deletedAt" IS NULL;

   CREATE UNIQUE INDEX "clients_uid_active_unique" ON "clients" ("clientUid") WHERE "deletedAt" IS NULL;
   CREATE UNIQUE INDEX "clients_mobile_active_unique" ON "clients" ("mobile") WHERE "deletedAt" IS NULL;
   CREATE UNIQUE INDEX "clients_email_active_unique" ON "clients" ("email") WHERE "deletedAt" IS NULL;

   CREATE UNIQUE INDEX "leads_uid_active_unique" ON "leads" ("leadUid") WHERE "deletedAt" IS NULL;

   CREATE UNIQUE INDEX "policies_uid_active_unique" ON "insurance_policies" ("policyUid") WHERE "deletedAt" IS NULL;
   CREATE UNIQUE INDEX "funds_uid_active_unique" ON "mutual_funds" ("fundUid") WHERE "deletedAt" IS NULL;
   ```
3. Apply it:
   ```bash
   npx prisma migrate deploy
   ```

Do this once, right after the first `migrate dev --create-only`, before the app goes live with real data.

## Deployment checklist (Vercel + Supabase)

See [DEPLOYMENT.md](./DEPLOYMENT.md).
