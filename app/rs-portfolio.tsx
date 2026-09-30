"use client";
import { useRef, useState } from "react";
import type { PortfolioContent } from "./cms/content";

type Picture = { image: string; label: string };
function Pictures({ images, title }: { images: Picture[]; title: string }) {
  const pictures = images.filter(item => item.image);
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  if (!pictures.length) return null;
  return <><div className="rs-picture-grid">{pictures.map((item, i) => <button key={i} aria-label={`View ${item.label || title}, image ${i + 1}`} onClick={() => { setIndex(i); dialog.current?.showModal(); }}><img src={item.image} alt={item.label || title} loading="lazy" /></button>)}</div>
    <dialog className="rs-lightbox" ref={dialog} aria-label={title} onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }} onKeyDown={e => { if (e.key === "ArrowRight") setIndex((index + 1) % pictures.length); if (e.key === "ArrowLeft") setIndex((index - 1 + pictures.length) % pictures.length); }}>
      <button className="rs-close" onClick={() => dialog.current?.close()} autoFocus aria-label="Close image">Close ×</button>
      <img src={pictures[index].image} alt={pictures[index].label || title} />
      <div className="rs-lightbox-controls"><button disabled={pictures.length < 2} onClick={() => setIndex((index - 1 + pictures.length) % pictures.length)} aria-label="Previous image">←</button><span>{index + 1} / {pictures.length}</span><button disabled={pictures.length < 2} onClick={() => setIndex((index + 1) % pictures.length)} aria-label="Next image">→</button></div>
      <p dir="auto">{pictures[index].label || title}</p>
    </dialog></>;
}
export function DesignGallery({ brand, designs }: { brand: string; designs: PortfolioContent["rsDesigns"] }) {
  const pictures = designs.flatMap(work => work.images.map(image => ({ image: image.image, label: image.label || work.title }))).filter(image => image.image);
  if (!pictures.length) return null;
  const slug = brand.toLowerCase();
  const heading = brand === "Aleem" ? "Designs for learning in action." : brand === "Noga" ? "Selected creative for Noga Home." : "Designs with a purpose.";
  const intro = brand === "Aleem" ? "Arabic social designs for courses and business education. Select a design to see it in full." : brand === "Noga" ? "Product and campaign visuals for Noga Home. Select a design to see it in full." : "Social visuals and campaign creative. Select any image to explore the full design.";
  return <section className="creative-gallery shell" id={slug === "aleem" ? "aleem-gallery" : `${slug}-designs`}>
    <div className="creative-gallery-heading"><div><span className="creative-gallery-eyebrow">{brand.toUpperCase()} · SELECTED CREATIVE</span><h2>{heading}</h2><p>{intro}</p></div><span className="creative-gallery-count">01 — {String(pictures.length).padStart(2, "0")}</span></div>
    <div className="creative-gallery-window" aria-label={`${brand} design gallery`}>
      <div className="creative-gallery-track">
        {[...pictures, ...pictures].map((picture, index) => {
          const isDuplicate = index >= pictures.length;
          return <a className="creative-design" href={picture.image} target="_blank" rel="noreferrer" aria-label={isDuplicate ? undefined : `View ${brand} design: ${picture.label}`} aria-hidden={isDuplicate || undefined} key={`${picture.image}-${index}`} tabIndex={isDuplicate ? -1 : undefined}><img src={picture.image} alt={isDuplicate ? "" : picture.label} loading="lazy" /><span aria-hidden="true">↗</span></a>;
        })}
      </div>
    </div>
    <p className="creative-gallery-tip">Scroll to browse · Hover to pause</p>
  </section>;
}

export default function RSPortfolio({ designs, campaigns, content }: { designs: PortfolioContent["rsDesigns"]; campaigns: PortfolioContent["rsCampaigns"]; content: PortfolioContent["rsContent"] }) {
  return <>
    <DesignGallery brand="RS" designs={designs} />
    {!!campaigns.length && <section className="rs-section shell" id="rs-campaigns"><span className="section-label">PAID MEDIA / RS</span><h2>Campaigns & results.</h2><div className="rs-portfolio-grid">{campaigns.map((work, i) => <article className="rs-portfolio-card" key={i}><div className="rs-portfolio-copy"><h3 dir="auto">{work.title}</h3><small>{work.period}</small><p dir="auto">{work.description}</p>{work.objective && <p dir="auto">Objective / {work.objective}</p>}{work.role && <small dir="auto">My role / {work.role}</small>}<dl className="rs-result-grid">{work.metrics.filter(m => m.value).map((m, n) => <div key={n}><dt dir="auto">{m.label}</dt><dd dir="auto">{m.value}</dd></div>)}</dl>{work.note && <p dir="auto">{work.note}</p>}</div><Pictures images={work.images} title={work.title} /></article>)}</div></section>}
    {!!content.length && <section className="rs-section shell" id="rs-content"><span className="section-label">CONTENT / RS</span><h2>The words behind the work.</h2><div className="rs-portfolio-grid">{content.map((work, i) => <article className="rs-portfolio-card" key={i}><div className="rs-portfolio-copy"><small dir="auto">{work.format}</small><h3 dir="auto">{work.title}</h3><p dir="auto">{work.description}</p>{work.role && <small dir="auto">My role / {work.role}</small>}{work.text && <div className="rs-written-content" dir="auto">{work.text}</div>}{work.url && <a href={work.url} target="_blank" rel="noreferrer">View related work ↗</a>}</div><Pictures images={work.images} title={work.title} /></article>)}</div></section>}
  </>;
}
