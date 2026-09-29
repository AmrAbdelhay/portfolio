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
export default function RSPortfolio({ designs, campaigns, content }: { designs: PortfolioContent["rsDesigns"]; campaigns: PortfolioContent["rsCampaigns"]; content: PortfolioContent["rsContent"] }) {
  return <>
    {!!designs.length && <section className="rs-section shell" id="rs-designs"><span className="section-label">DESIGN / RS</span><h2>Designs with a purpose.</h2><p className="rs-section-intro">Social visuals and campaign creative. Select any image to explore the full design.</p><div className="rs-portfolio-grid">{designs.map((work, i) => <article className="rs-portfolio-card" key={i}><Pictures images={work.images} title={work.title} /><div className="rs-portfolio-copy"><h3 dir="auto">{work.title}</h3><p dir="auto">{work.description}</p>{work.role && <small dir="auto">My role / {work.role}</small>}</div></article>)}</div></section>}
    {!!campaigns.length && <section className="rs-section shell" id="rs-campaigns"><span className="section-label">PAID MEDIA / RS</span><h2>Campaigns & results.</h2><div className="rs-portfolio-grid">{campaigns.map((work, i) => <article className="rs-portfolio-card" key={i}><div className="rs-portfolio-copy"><h3 dir="auto">{work.title}</h3><small>{work.period}</small><p dir="auto">{work.description}</p>{work.objective && <p dir="auto">Objective / {work.objective}</p>}{work.role && <small dir="auto">My role / {work.role}</small>}<dl className="rs-result-grid">{work.metrics.filter(m => m.value).map((m, n) => <div key={n}><dt dir="auto">{m.label}</dt><dd dir="auto">{m.value}</dd></div>)}</dl>{work.note && <p dir="auto">{work.note}</p>}</div><Pictures images={work.images} title={work.title} /></article>)}</div></section>}
    {!!content.length && <section className="rs-section shell" id="rs-content"><span className="section-label">CONTENT / RS</span><h2>The words behind the work.</h2><div className="rs-portfolio-grid">{content.map((work, i) => <article className="rs-portfolio-card" key={i}><div className="rs-portfolio-copy"><small dir="auto">{work.format}</small><h3 dir="auto">{work.title}</h3><p dir="auto">{work.description}</p>{work.role && <small dir="auto">My role / {work.role}</small>}{work.text && <div className="rs-written-content" dir="auto">{work.text}</div>}{work.url && <a href={work.url} target="_blank" rel="noreferrer">View related work ↗</a>}</div><Pictures images={work.images} title={work.title} /></article>)}</div></section>}
  </>;
}
