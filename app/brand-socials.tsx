const brandPlatforms: Record<string, { platform: "Facebook" | "Instagram"; url: string }[]> = {
  aleem: [
    { platform: "Facebook", url: "https://www.facebook.com/aleemacademy.sa" },
    { platform: "Instagram", url: "https://www.instagram.com/aleem_saa/" },
  ],
  rs: [{ platform: "Instagram", url: "https://www.instagram.com/rspaac/" }],
  noga: [
    { platform: "Facebook", url: "https://www.facebook.com/profile.php?id=61579710984123" },
    { platform: "Instagram", url: "https://www.instagram.com/noga_home.store/" },
  ],
};

export default function BrandSocials({ slug, name }: { slug: string; name: string }) {
  const links = brandPlatforms[slug];
  if (!links?.length) return null;
  return (
    <nav className="brand-socials" aria-label={`${name} social platforms`}>
      {links.map(({ platform, url }) => (
        <a key={platform} href={url} target="_blank" rel="noopener noreferrer" aria-label={`${name} on ${platform} (opens in a new tab)`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
            {platform === "Instagram" ? <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></> : <path d="M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A23 23 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v8" />}
          </svg>
          {platform}<span aria-hidden="true">↗</span>
        </a>
      ))}
    </nav>
  );
}
