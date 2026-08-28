# Deployment checklist

Follow this order exactly — skipping a step (especially region matching) causes silent, hard-to-diagnose slowness or 404s.

## 1. Supabase project

- Create the project in the **Singapore (ap-southeast-1)** region (chosen to match Vercel's closest function region for this deployment).
- Grab two connection strings from Project Settings → Database:
  - **Pooled** (port `6543`, via PgBouncer) → `DATABASE_URL`, append `?pgbouncer=true`.
  - **Direct** (port `5432`) → `DIRECT_URL`.

## 2. Vercel project settings — before the first deploy

1. **Framework Preset**: Project Settings → General → confirm it says **"Next.js"**, not "Other". If it defaulted to "Other", Vercel will only serve `/public` as static files and 404 every route.
2. **Function Region**: Project Settings → Functions → Function Region → set to the Singapore region (`sin1`), matching the Supabase project. Hobby plan allows only one region — get this right the first time.
3. **Environment variables** (Project Settings → Environment Variables) — add all of these **before** the first deploy; variables added after a deploy don't take effect until you redeploy:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `AUTH_SECRET`
   - `AUTH_TRUST_HOST=true`

## 3. Apply the database schema

Before or right after the first deploy, from your local machine (with `DATABASE_URL`/`DIRECT_URL` pointing at the real Supabase project):

```bash
npx prisma migrate dev --name init --create-only
# hand-edit the migration to add the partial unique indexes — see README.md
npx prisma migrate deploy
npm run db:seed
```

## 4. Deploy

Push to the connected GitHub branch (or `vercel --prod`) and let Vercel build.

## 5. Post-deploy verification (do not skip)

A successful build is not a successful deploy. Against the **live URL**:

1. Load `/login` and sign in with the seeded admin (`ADM001` / `ChangeMe123!`).
2. Confirm the dashboard loads with real data (not an error page).
3. Change the admin password immediately via Profile.
4. Create one advisor user, log in as them, create a test client, and confirm advisor-scoping works (the admin sees it, a different advisor would not).
5. Open the deployed URL on a phone and confirm the "Install app" / "Add to Home Screen" prompt works (PWA is only active in production builds, never in `next dev`).
