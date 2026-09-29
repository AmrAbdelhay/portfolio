import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedContent } from "../../cms/server";

import RSPortfolio from "../../rs-portfolio";
import RSGallery from "../../rs-gallery";
import BrandSocials from "../../brand-socials";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { caseStudies } = await publishedContent();
  const study = caseStudies.find((item) => item.slug === slug);
  return { title: study ? `${study.name} — Amr Ahmed Abdelhay` : "Portfolio", description: study?.summary };
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { caseStudies, details, aleemDesigns, rsWorks, rsDesigns, rsCampaigns, rsContent, brandPlatforms } = await publishedContent();
  if (!Object.hasOwn(details, slug) || !caseStudies.some(item => item.slug === slug)) notFound();
  const detail = details[slug as keyof typeof details];
  const study = caseStudies.find((item) => item.slug === slug)!;
  return <main className="detail-page" style={{ "--detail-accent": study.accent } as React.CSSProperties}>
    <nav className="nav shell" aria-label="Case study navigation"><Link className="brand-mark" href="/" aria-label="Portfolio home">AA</Link><Link className="detail-back" href="/#work">← All case studies</Link></nav>
    <header className="detail-hero shell"><div className="detail-overline">CASE STUDY / {study.market} / {study.period}</div><div className="detail-hero-row"><div><h1>{study.name}<span>{detail.headline}</span></h1><p>{detail.intro}</p><BrandSocials slug={slug} name={study.name} platforms={brandPlatforms} /></div><img src={study.image} alt={`${study.name} logo`} /></div><div className="detail-tags">{study.tags.map(tag => <span key={tag}>{tag}</span>)}</div></header>
    {study.template !== "rs" && !!study.metrics.length && <section className="detail-metrics shell" aria-label="Selected results">{study.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}{study.template === "noga" && <p>Approximate commercial results based on campaign exports and delivered-order records. Estimated ROAS.</p>}</section>}
    {study.template === "rs" && <><nav className="rs-section-nav shell" aria-label="RS work categories">{!!rsDesigns.length && <a href="#rs-designs">Designs</a>}{!!rsWorks.length && <a href="#rs-creative">Videos</a>}{!!rsCampaigns.length && <a href="#rs-campaigns">Campaign results</a>}{!!rsContent.length && <a href="#rs-content">Content writing</a>}</nav><RSPortfolio designs={rsDesigns} campaigns={rsCampaigns} content={rsContent} />{!!rsWorks.length && <RSGallery works={rsWorks} />}</>}
    <section className="detail-chapters shell"><div className="section-label"><span>01</span> My work at {study.name}</div><div className="detail-chapter-list">{detail.chapters.filter(chapter => study.template !== "rs" || !/^(Sales|Operations) ·/.test(chapter.title)).map(chapter => <article key={chapter.number}><span className="chapter-number">{chapter.number}</span><div><h2>{chapter.title}</h2><p>{chapter.text}</p><small>{chapter.evidence}</small></div></article>)}</div></section>
    {study.template === "rs" && <details className="rs-history shell"><summary>Earlier experience · Sales & operations</summary><div className="detail-chapter-list">{detail.chapters.filter(chapter => /^(Sales|Operations) ·/.test(chapter.title)).map(chapter => <article key={chapter.number}><div><h2>{chapter.title}</h2><p>{chapter.text}</p><small>{chapter.evidence}</small></div></article>)}</div>{!!study.metrics.length && <div className="detail-metrics" aria-label="Earlier sales role results">{study.metrics.map((metric, i) => <div key={i}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}<p>Earlier sales role · Approximate results from the initial three-month period, separate from marketing campaign performance.</p></div>}</details>}
    {study.template === "aleem" && (
        <section className="aleem-gallery shell" id="aleem-gallery">
          <div className="aleem-gallery-heading"><div><span className="gallery-eyebrow">ALEEM · SELECTED CREATIVE</span><h2>Designs for learning in action.</h2><p>Arabic social designs for courses and business education. Select a design to see it in full.</p></div><span className="gallery-count">01 — {String(aleemDesigns.length).padStart(2, "0")}</span></div>
          <div className="aleem-gallery-window" aria-label="Aleem design gallery">
            <div className="aleem-gallery-track">
              {[...aleemDesigns, ...aleemDesigns].map((design, index) => <a className="aleem-design" href={design.image} target="_blank" rel="noreferrer" aria-label={`View Aleem design: ${design.label}`} key={`${design.image}-${index}`} tabIndex={index >= aleemDesigns.length ? -1 : undefined}><img src={design.image} alt={index < aleemDesigns.length ? `تصميم عليم: ${design.label}` : ""} loading="lazy" /><span aria-hidden="true">↗</span></a>)}
            </div>
          </div>
          <p className="aleem-gallery-tip">Scroll to browse · Hover to pause</p>
        </section>
    )}
    {study.template === "noga" && <section className="detail-website shell"><div><span className="section-label"><span>02</span> Website</span><h2>The storefront is part of the story.</h2><p>Browse the website work and code behind the Noga Home store.</p></div><a className="button primary" href="https://github.com/AmrAbdelhay/noga-home-store" target="_blank" rel="noreferrer">View store project ↗</a></section>}
    <footer className="detail-footer shell"><Link href="/#work">← Back to all work</Link><span>Amr Ahmed Abdelhay · 2026</span></footer>
  </main>;
}
