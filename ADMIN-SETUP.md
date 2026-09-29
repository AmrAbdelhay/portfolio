# Portfolio admin setup

## Current state

- Supabase project: `xlvnjqhjlcietdysewxx` (`amr-portfolio`).
- Live audit on 2026-09-28 found that `portfolio_content` was recreated with legacy columns (`id`, `data`, `updated_at`) and one empty `main` row. The `save_portfolio` function still expects `document` and `revision`, and anonymous SELECT is denied. This mismatch was repaired after the user explicitly approved applying the migration.
- `supabase/003_repair_legacy_content.sql` and `supabase/002_seed.sql` were applied successfully on 2026-09-28 after explicit user approval. Existing `main` row was preserved; `draft` and `published` rows are at revision 1. Anonymous REST verification returned the published row (HTTP 200) and no draft rows (HTTP 200, empty list).
- Do not rerun `supabase/001_portfolio.sql`: its policy creation statements are not idempotent.
- Local `.env.local` contains only the Supabase URL and publishable key. It is ignored by Git.
- `/admin` has password sign-in, content fields, ordering, image/video upload controls and previews, draft saves, explicit publishing, draft restoration and retry after loading failures. Uploads still require Cloudinary configuration.
- Missing optional project links and brand metrics become editable fields on load. Renaming a brand moves its story/social links and updates matching project links; its page template keeps galleries attached independently of its slug.
- Public routes read only the published row and fall back to bundled portfolio content when the database is unavailable or unseeded.
- Owner amr743366@gmail.com (user ID 24527bb2-041c-4582-8a2b-45f0a7e424a3) was created and its portfolio_admins membership was verified in Supabase.
- Local Cloudinary configuration is complete for cloud `lnxluhi3`; credentials are in ignored `.env.local` and the running server reloaded them. Signed image (291,378 bytes) and video (8,028,520 bytes) uploads succeeded with HTTP 200. Test asset URLs are saved in ignored `outputs/cloudinary-setup-check.json`. Deployment environment configuration and an upload through the authenticated browser UI remain pending.

## Finish setup

1. Database repair and seeding are complete. Do not rerun them as a routine setup step. To regenerate the seed for another environment, run `node scripts/seed-content.mjs` with Node 24.
2. The owner's user and admin membership already exist (see Current state). Sign in to `/admin` with the existing credentials; do not recreate the user or change their password.
3. Only if another explicitly authorized owner needs access, create their user and grant that exact user access from the SQL editor using its verified UUID:

   ```sql
   insert into public.portfolio_admins(user_id) values ('VERIFIED-USER-UUID') on conflict do nothing;
   ```

   No public sign-up screen or self-service admin grants are provided. Only IDs explicitly in this table may save or publish.

4. Set these variables locally and in Vercel (never commit secrets):

   ```text
   NEXT_PUBLIC_SUPABASE_URL=https://xlvnjqhjlcietdysewxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<project publishable key>
   CLOUDINARY_CLOUD_NAME=<existing cloud name>
   CLOUDINARY_API_KEY=<API key>
   CLOUDINARY_API_SECRET=<API secret; server only>
   ```

5. Vercel must use the Next.js build (`npx next build`), not the legacy Cloudflare/Sites build script. Keep the existing Vercel settings unless they differ.
6. Test `/admin`: sign in, save a harmless draft edit, verify the public page is unchanged, publish and verify the update, then restore the original content. Check images/video uploads and mobile layout. Check two simultaneous editor sessions: the stale revision must return a conflict.

## Validation

```text
node --test tests/cms.test.mjs
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.next.json
node node_modules/next/dist/bin/next build
```

The original Cloudflare worker sources are retained. `tsconfig.next.json` checks the Vercel app separately from those legacy worker bindings.

The CMS tests cover existing content, unsafe links, missing fields, brand creation/renaming/reordering/removal, anonymous access rejection, and authenticated request validation, publish intent, conflicts and service failures with a mocked Supabase transport. They do not replace end-to-end tests against the real database or Cloudinary.

2026-09-28 local validation: 9 CMS tests passed; TypeScript and Next.js production build passed. ESLint reported no errors and five existing-style image optimization warnings. The local preview is at `http://127.0.0.1:3000/admin`; the sign-in screen was visually checked. Actual signed-in save/publish/upload tests and deployment remain pending.

Uploads go directly to Cloudinary with an admin-only server-generated signature. Existing assets are never overwritten or deleted. Removing an item removes it from the draft only until publishing. Unused uploaded files may need later cleanup in Cloudinary.

References: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Cloudinary signatures](https://cloudinary.com/documentation/signatures).


Local runtime fix (2026-09-28): the sandboxed Next.js process could not reach Supabase and returned HTTP 500 for authenticated content reads. Restarting the localhost-only server with network access resolved it; GET /api/admin/content returned HTTP 200. Keep the network-enabled preview process running (port 3000).

2026-09-28: server logs confirmed authenticated content GET and save/publish POST requests return HTTP 200. The in-app browser still shows the login form (the user uses another browser session), so the upload button itself has not been exercised in that session. Two setup-check assets remain in Cloudinary; no existing media was overwritten or deleted.
