import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aleemDesigns, caseStudies } from "../../portfolio-data";

import RSGallery from "../../rs-gallery";

const details = {
  noga: {
    headline: "From first idea to every customer order.",
    intro: "Noga Home is the full story of a brand I built and operated myself. My work spans what customers see, how they discover the products, the conversations that turn interest into orders, and the website that brings it together.",
    chapters: [
      { number: "01", title: "Brand & product creative", text: "Developed the brand's visual direction, created product designs and campaign assets, and produced content for the social pages.", evidence: "Brand identity · Product imagery · Social posts" },
      { number: "02", title: "Content & paid growth", text: "Planned offers and creative, ran Meta campaigns, tested content, and followed the results from advertising to customer contact.", evidence: "Campaign screenshots · Creative tests · Post performance" },
      { number: "03", title: "Sales & customer operations", text: "Spoke directly with customers, answered questions, sold through chat, followed orders, and managed the customer experience beyond the ad click.", evidence: "Sales process · Conversations · Delivered orders" },
      { number: "04", title: "E-commerce website", text: "Built the online storefront and the digital shopping experience for Noga Home, alongside the day-to-day brand operations.", evidence: "Store screens · Customer journey · Development work" },
      { number: "05", title: "Video & production", text: "Product photography, edits, short videos, and social-first creative belong alongside the campaigns that used them.", evidence: "Product shoots · Reels · Video edits" },
    ],
  },
  rs: {
    headline: "Sales first. Then operations. Then marketing.",
    intro: "My RS work developed across three connected roles. I started close to customers, moved into the systems behind the business, and began working in digital marketing in July 2024.",
    chapters: [
      { number: "01", title: "Sales · from February 2024", text: "Worked with customers and generated approximately EGP 200,000 in sales over a three-month period.", evidence: "~EGP 200K sales · 3 months" },
      { number: "02", title: "Operations · before July 2024", text: "Handled operational coordination, Odoo ERP data entry, and reporting. This gave me a closer view of the customer and business workflow.", evidence: "Customer operations · Odoo · Reports" },
      { number: "03", title: "Digital marketing · July 2024 onward", text: "Created designs and content, photographed and edited short-form video, managed publishing and moderation, worked on Meta campaigns, and reported performance.", evidence: "Designs · Video · Campaign results · Engaging posts" },
    ],
  },
  aleem: {
    headline: "Content and design for business learning.",
    intro: "For Aleem, I worked on the words and the visuals: Arabic educational and promotional content shaped for a Saudi audience. The designs below are selected examples of that work.",
    chapters: [
      { number: "01", title: "Educational content", text: "Developed content angles and copy around business, professional learning, courses, and practical skills.", evidence: "Content concepts · Arabic copy · Course posts" },
      { number: "02", title: "Social design", text: "Turned topics and course messages into clear branded social visuals for Aleem's audience.", evidence: "Six selected designs below" },
    ],
  },
} as const;

export function generateStaticParams() { return Object.keys(details).map((slug) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((item) => item.slug === slug);
  return { title: study ? `${study.name} — Amr Ahmed Abdelhay` : "Portfolio", description: study?.summary };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in details)) notFound();
  const detail = details[slug as keyof typeof details];
  const study = caseStudies.find((item) => item.slug === slug)!;
  return <main className="detail-page" style={{ "--detail-accent": study.accent } as React.CSSProperties}>
    <nav className="nav shell" aria-label="Case study navigation"><a className="brand-mark" href="/" aria-label="Portfolio home">AA</a><a className="detail-back" href="/#work">← All case studies</a></nav>
    <header className="detail-hero shell"><div className="detail-overline">CASE STUDY / {study.market} / {study.period}</div><div className="detail-hero-row"><div><h1>{study.name}<span>{detail.headline}</span></h1><p>{detail.intro}</p></div><img src={study.image} alt={`${study.name} logo`} /></div><div className="detail-tags">{study.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
    {study.metrics && <section className="detail-metrics shell" aria-label="Selected results">{study.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}{slug === "noga" && <p>Approximate commercial results based on campaign exports and delivered-order records. Estimated ROAS.</p>}{slug === "rs" && <p>Approximate sales reported for a three-month period during the sales role.</p>}</section>}
    {slug === "rs" && <RSGallery />}
    <section className="detail-chapters shell"><div className="section-label"><span>01</span> My work at {study.name}</div><div className="detail-chapter-list">{detail.chapters.map(chapter => <article key={chapter.number}><span className="chapter-number">{chapter.number}</span><div><h2>{chapter.title}</h2><p>{chapter.text}</p><small>{chapter.evidence}</small></div></article>)}</div></section>
    {slug === "aleem" && <section className="detail-creative shell"><div className="section-label"><span>02</span> Selected Aleem designs</div><div className="detail-design-grid">{aleemDesigns.map(design => <a href={design.image} target="_blank" rel="noreferrer" key={design.image} aria-label={`Open design: ${design.label}`}><img src={design.image} alt={`تصميم عليم: ${design.label}`} loading="lazy" /><span>View full design ↗</span></a>)}</div></section>}
    {slug === "noga" && <section className="detail-website shell"><div><span className="section-label"><span>02</span> Website</span><h2>The storefront is part of the story.</h2><p>Browse the website work and code behind the Noga Home store.</p></div><a className="button primary" href="https://github.com/AmrAbdelhay/noga-home-store" target="_blank" rel="noreferrer">View store project ↗</a></section>}
    <footer className="detail-footer shell"><a href="/#work">← Back to all work</a><span>Amr Ahmed Abdelhay · 2026</span></footer>
  </main>;
}
