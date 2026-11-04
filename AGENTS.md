# Amr Portfolio — instructions for coding agents

Read `README.md`, `docs/HANDOFF.md`, `docs/CONTINUE-AR.md` and `CONTENT-GUIDE.md` before changing the project. Use the repository and handoff as durable context; do not assume another chat's memory is available.

## Product and source of truth

- Personal portfolio for Amr, with brand work for Noga Home, RS and Aleem plus development/video work. Keep the owner's actual contribution and provided performance evidence accurate.
- Canonical repo: `AmrAbdelhay/portfolio`, current branch `main`. Keep the entire editable source and public media in GitHub. Preserve user assets and existing links.
- Keep the **AI labels under the four latest Noga designs**, their original Facebook links, and existing distinctions between organic and paid results. Never invent metrics, clients, testimonials, roles or ownership.
- `app/portfolio-data.ts` is the bundled content/fallback; `public/work/` holds public work. `app/cms/` supports database-backed content and editing. Public pages prefer the published Supabase document and fall back to bundled content if unavailable. Changes to fallback data do not necessarily replace an already published CMS document.
- Maintain the mobile layout and inspect desktop/mobile when changing UI. No content or layout change is requested merely by a handoff update.

## Runtime and hosting

- The active public app is **Next.js on Vercel**. Use `npm run dev:local` for Windows preview and `npx next build` for its production build.
- Vinext/Vite/Cloudflare/Sites source and scripts are legacy/alternative infrastructure retained in the repo. `npm run build` and `npm test` target that legacy build path; do not select them as Vercel build commands or create a second hosting project to continue this one.
- Existing Vercel project URL: `https://portfolio-amr-215c.vercel.app`. Keep the existing Git integration/environment. A push may trigger deployment; verify the resulting deployment before claiming it is live.
- Supabase holds CMS/admin membership; Cloudinary handles signed uploads. See `ADMIN-SETUP.md` for the existing setup and historical verification.

## Validation

Use Node.js 24 for current tests. After substantive changes, run the relevant checks:

```sh
node --test tests/cms.test.mjs
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.next.json
node node_modules/next/dist/bin/next build
```

The CMS tests mock remote transports. Do not publish drafts, upload files to live Cloudinary or change public portfolio data merely to test documentation/source transfer. Documentation-only changes need a link/path/command review, not a forced live CMS edit.

## Credentials, data and continuation

- Never commit `.env.local`, `.vercel/`, API secrets, access tokens, private screenshots or account credentials. Keep Cloudinary API secret server-side. A new device needs authorized environment setup; Git does not transfer sessions/secrets.
- Preserve existing Supabase tables, user/admin membership and RLS. Do not rerun `supabase/001_portfolio.sql`, recreate the owner, reset passwords or reapply old repair/seed SQL as routine clone setup.
- Existing hosting protection may require a Vercel sign-in; do not disable deployment protection without user authorization. An HTTP login page is not evidence the portfolio content is broken.
- Before work, inspect `git status` and current remote head. Preserve uncommitted changes. Do not force-push or overwrite remote changes. Save verified changes with commit/push when requested and keep `docs/HANDOFF.md` current.
- For a new task branch use `codex/` unless the owner requests another branch. If working directly on the existing branch, report the actual pushed branch/commit separately from deployment status.
