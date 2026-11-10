# Amr Portfolio — handoff / حالة المشروع

Updated **2026-11-10 (Africa/Cairo)**. Read alongside `AGENTS.md`, `CONTENT-GUIDE.md` and `ADMIN-SETUP.md`.

## Locations and current source

- Repository: https://github.com/AmrAbdelhay/portfolio (public).
- Current/default branch: `main`.
- Last application commit before this documentation handoff: `0a95dd57e20454c2cbd46bba208ed011c6733adf` — `Label four new Noga designs as AI`.
- Existing Vercel project: https://portfolio-amr-215c.vercel.app
- Portfolio gallery: `/work/noga`, plus RS/Aleem work routes and admin at `/admin`.
- Local and remote source heads matched before this documentation update. This handoff does not change the rendered portfolio, CMS content, credentials or media.

## What the owner last requested

The Noga page shows results from 26 Meta campaigns with messaging conversations started as their reported result. The export's reporting dates are 17 Aug 2025 to 10 Nov 2026. These campaigns recorded 4,623 conversations started and EGP 17,871.48 in spend, for EGP 3.87 per conversation. The portfolio displays these figures separately from the existing commercial estimates.

The Noga page plays an additional short-form video from `public/work/noga/noga-short-video.mp4`. This video is displayed as creative work without campaign attribution.

The existing Noga Eid Adha greeting opens its supplied Facebook post in bundled and older published CMS content. The Customer feedback gallery on the Noga page scrolls through the ten supplied review cards, with a pause control and a link to the Facebook post. The cards are in `public/work/noga/feedback/`.

The Noga gallery now marks “Choose your bedroom mood” as AD and keeps its existing Facebook post. The green bedding design uses the newly supplied Facebook post. The Noga page also plays the supplied video ad from `public/work/noga/noga-video-ad.mp4` and links to the Facebook reel. The gallery update applies to existing published CMS documents through the versioned content merge.

Four new Noga designs were added with original Facebook post links, then labeled **AI** at the owner's request. Keep those labels. The owner subsequently asked what material to add next: selected strong designs across Noga/RS/Aleem; reels/video with actual performance evidence; campaign screenshots with private data hidden; writing samples; and development work with the owner's role. Prefer 4–8 strong pieces per brand. Record brand, contribution, tools and paid-vs-organic status for each piece.

Earlier verification reported Vercel deployment success for the gallery additions, but the public address required Vercel authentication. This documentation task does not remove deployment protection or verify a currently authenticated live session. Verify access/deployment independently before claiming universal public access or a new release is visible.

## Architecture

- `app/portfolio-data.ts`: bundled portfolio data/fallback; `CONTENT-GUIDE.md` explains content/media placement.
- `public/work/`: public assets organized by brand/video/development.
- `app/cms/`: schemas, public-content retrieval and editing helpers.
- `app/api/admin/`: authenticated CMS content and signed upload endpoints.
- `supabase/`: database schema/seed/repair history. Existing Supabase project is already initialized; not a setup script to rerun on each device.
- `next.config.ts` + `tsconfig.next.json`: active Next/Vercel path.
- `vite.config.ts`, `worker/`, `.openai/`, `build/` and Sites shell helpers: retained legacy hosting infrastructure. Do not confuse these with active Vercel settings.

## Local setup and checks

Clone `main`, use Node.js 24 and `npm ci`; `npm run dev:local` starts the Next.js preview at localhost. Bundled portfolio content can render without production secrets. For CMS/admin behavior, set authorized local Supabase URL/publishable key and Cloudinary variables as described in `ADMIN-SETUP.md`. Do not copy private `.env.local` into Git.

All 19 CMS tests passed during this documentation handoff. No new app build, signed-in CMS edit or upload was needed for documentation-only changes. The intended active-app validation commands after substantive application changes are:

```sh
node --test tests/cms.test.mjs
node node_modules/typescript/bin/tsc --noEmit -p tsconfig.next.json
node node_modules/next/dist/bin/next build
```

`npm test` invokes the old Vinext build/rendered-worker test. It is not the complete Vercel verification path. Do not change hosting frameworks merely to make that command the active default during an unrelated task.

## CMS / upload state and limits

The existing Supabase CMS schema was repaired previously; `ADMIN-SETUP.md` records that work. Preserve the existing owner and membership. Do not rerun `supabase/001_portfolio.sql` or seed/repair scripts as a clone step. Public pages read published content only; draft/publish behavior and stale-revision rejection must remain intact.

Cloudinary signed upload support exists. Historical local upload/server checks are documented in ADMIN-SETUP; deployment environment and real browser upload status must be checked for the current task rather than inferred from old notes. Never rotate owner credentials or grant admin access as routine continuation.

## Source portability and publish workflow

Clone/pull moves source/public assets, not Supabase content, Cloudinary credentials, Vercel project access or sessions. Keep existing Vercel Git integration; confirm build command remains `npx next build`. GitHub saves and Vercel publishes are separate outcomes, even if integration starts deployment on push. Update this file and report the pushed commit plus deployment result after application changes.

## Starter prompt for another model

> ده البورتفوليو الشخصي لعمرو. اقرأ AGENTS.md وREADME.md وdocs/HANDOFF.md وCONTENT-GUIDE.md. شغّل نسخة Next محليًا؛ الموقع الحالي على Vercel، مش مسار Sites/Vinext القديم. حافظ على AI labels للتصميمات الأربعة وروابط البوستات والأرقام الحقيقية. لا تعيد تهيئة Supabase أو تغيير الحسابات والأسرار. المطلوب الجديد: [اكتبه هنا].
