import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedContent } from "../../cms/server";

import RSPortfolio, { DesignGallery } from "../../rs-portfolio";
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
  const { caseStudies, details, aleemDesigns, nogaDesigns, rsWorks, rsDesigns, rsCampaigns, rsContent, brandPlatforms } = await publishedContent();
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
    {study.template === "aleem" && <DesignGallery brand="Aleem" designs={aleemDesigns.map(design => ({ title: design.label, description: "Arabic educational design crafted for Aleem’s audience and learning goals.", role: "Social design / visual communication", url: design.image, images: [{ image: design.image, label: design.label }] }))} />}
    {study.template === "noga" && <DesignGallery brand="Noga" designs={nogaDesigns} />}
    {study.template === "noga" && <section className="detail-website shell"><div><span className="section-label"><span>02</span> Website</span><h2>The storefront is part of the story.</h2><p>I designed and developed this storefront for Noga Home. The website is still under development.</p></div><a className="button primary" href="https://noga-home-store.amr743366.workers.dev/" target="_blank" rel="noreferrer">Visit website · In development ↗</a></section>}
    <footer className="detail-footer shell"><Link href="/#work">← Back to all work</Link><span>Amr Ahmed Abdelhay · 2026</span></footer>
  </main>;
}
