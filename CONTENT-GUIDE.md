# Amr Portfolio — adding your work

The site is data-driven. Most text, links, tools, and project cards live in `app/portfolio-data.ts`.

## Where each type of work goes

- Noga Home: `public/work/noga/`
- RS: `public/work/rs/`
- Aleem: `public/work/aleem/`
- Videos and reels: `public/work/video/`
- Development screenshots: `public/work/development/`

Recommended images: WebP or JPG, 1600 × 1200 px, under 500 KB. Recommended video: MP4, 1080p, under 20 MB, or an external hosted link.

After adding an image, open `app/portfolio-data.ts` and paste its public path into the matching empty `image: ""` field. Example: `image: "/work/noga/identity-cover.webp"`. The design switches from the placeholder to the real image automatically.

For each brand, prepare a logo or cover, three strong designs, one campaign dashboard screenshot with private data hidden, one short video, and a short challenge / contribution / outcome summary. Add only the strongest 4–8 pieces per brand.
