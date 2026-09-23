"use client";

import { useMemo, useState } from "react";
import { aleemDesigns, caseStudies, experience, projects, services, stack } from "./portfolio-data";

const filters = ["All", "Brand", "Paid Media", "Content", "Video", "Development"];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const visibleProjects = useMemo(
    () => projects.filter((project) => activeFilter === "All" || project.category === activeFilter),
    [activeFilter],
  );

  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Amr Ahmed Abdelhay, home">AA</a>
        <div className="nav-links"><a href="#work">Work</a><a href="#aleem-gallery">Aleem designs</a><a href="#experience">Experience</a><a href="#about">About</a></div>
        <a className="nav-cta" href="https://github.com/AmrAbdelhay" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-kicker reveal"><span className="status-dot" /> Cairo, Egypt · Open to opportunities</div>
        <h1 className="hero-title reveal delay-1">I build brands<span>from the ground up.</span></h1>
        <div className="hero-bottom reveal delay-2">
          <p>I&apos;m <strong>Amr Ahmed Abdelhay</strong>, a Digital Marketing &amp; Brand Growth Specialist connecting strategy, content, paid media, design, sales, and digital execution.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore my work <span>↓</span></a><a className="button ghost" href="#about">My story</a></div>
        </div>
        <div className="hero-portrait">
          <img src="/amr-ahmed-abdelhay.jpeg" alt="Amr Ahmed Abdelhay" />
        </div>
      </section>

      <section className="impact shell" aria-label="Selected performance results">
        <div className="section-label"><span>01</span> Measured impact</div>
        <div className="stat-grid">
          <article><strong>3.2K+</strong><span>Messaging contacts</span></article><article><strong>7.6×</strong><span>Estimated ROAS</span></article>
          <article><strong>96.7%</strong><span>Delivery rate</span></article><article><strong>EGP 112K</strong><span>Delivered revenue</span></article>
        </div>
        <p className="data-note">Noga Home · Approximate commercial results based on Meta campaign exports and delivered-order records.</p>
      </section>

      <div className="service-rail" aria-label="Services"><div className="service-track">{[...services, ...services].map((service, index) => <span key={`${service}-${index}`}>{service}<b>✦</b></span>)}</div></div>

      <section className="case-section shell" id="work">
        <div className="section-head"><div className="section-label"><span>02</span> Selected case studies</div><p>Work that moves from idea to measurable business outcome.</p></div>
        <div className="case-list">
          {caseStudies.map((study, index) => (
            <article className={`case-card ${index === 0 ? "featured" : ""}`} key={study.name}>
              <div className={`case-visual ${study.image ? "has-logo" : ""}`} style={{ "--accent": study.accent } as React.CSSProperties}>
                <div className="visual-index">0{index + 1}</div>
                {study.image ? <img className={`case-logo logo-${study.slug}`} src={study.image} alt={`${study.name} logo`} /> : <div className="visual-monogram">{study.monogram}</div>}
                <div className="asset-note"><span>{study.image ? "BRAND IDENTITY" : "CASE STUDY VISUAL"}</span><small>{study.assetHint}</small></div>
              </div>
              <div className="case-copy">
                <div className="case-meta"><span>{study.market}</span><span>{study.period}</span></div><h2>{study.name}</h2><h3>{study.role}</h3><p>{study.summary}</p>
                <div className="tag-row">{study.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                {study.metrics && <div className="mini-metrics">{study.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
                <a className="case-work-link" href={`/work/${study.slug}`}>Explore the full {study.name} story ↗</a>
              </div>
            </article>
          ))}
        </div>
        <div className="aleem-gallery" id="aleem-gallery">
          <div className="aleem-gallery-heading"><div><span className="gallery-eyebrow">ALEEM · SELECTED CREATIVE</span><h2>Designs for learning in action.</h2><p>Arabic social designs for courses and business education. Select a design to see it in full.</p></div><span className="gallery-count">01 — 06</span></div>
          <div className="aleem-gallery-window" aria-label="Aleem design gallery">
            <div className="aleem-gallery-track">
              {[...aleemDesigns, ...aleemDesigns].map((design, index) => <a className="aleem-design" href={design.image} target="_blank" rel="noreferrer" aria-label={`View Aleem design: ${design.label}`} key={`${design.image}-${index}`} tabIndex={index >= aleemDesigns.length ? -1 : undefined}><img src={design.image} alt={index < aleemDesigns.length ? `تصميم عليم: ${design.label}` : ""} loading="lazy" /><span aria-hidden="true">↗</span></a>)}
            </div>
          </div>
          <p className="aleem-gallery-tip">Scroll to browse · Hover to pause</p>
        </div>
      </section>

      <section className="project-section shell">
        <div className="section-head"><div className="section-label"><span>03</span> Work library</div><p>A curated space for campaigns, content, visuals, video, and products.</p></div>
        <div className="filters" role="group" aria-label="Filter projects">{filters.map((filter) => <button key={filter} className={activeFilter === filter ? "active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
        <div className="project-grid">
          {visibleProjects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className={`project-thumb tone-${project.tone} ${project.image ? "has-image" : ""}`} style={project.image ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.08), rgba(0,0,0,.68)), url(${project.image})` } : undefined}><span>{project.category}</span><div className="thumb-title">{project.short}</div>{project.status === "placeholder" && <small>ADD SELECTED WORK</small>}</div>
              <div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div>{project.link ? <a href={project.link} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}>↗</a> : <span className="coming">Coming soon</span>}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="experience shell" id="experience">
        <div className="section-head"><div className="section-label"><span>04</span> Experience</div><p>A path built across operations, sales, creativity, and growth.</p></div>
        <div className="timeline">{experience.map((item) => <article key={`${item.company}-${item.role}`}><div className="timeline-period">{item.period}</div><div><h3>{item.role}</h3><p>{item.company}</p></div><p className="timeline-copy">{item.description}</p></article>)}</div>
      </section>

      <section className="about shell" id="about">
        <div className="about-copy"><div className="section-label"><span>05</span> About</div><h2>Business thinking.<br />Creative execution.<br /><em>Technical edge.</em></h2><p>With a 2020 degree in Management Information Systems, I bring a business-first lens to creative work. I moved from sales and Odoo-based operations into end-to-end marketing—then expanded into brand design, short-form video, AI-assisted production, Flutter, and e-commerce development.</p></div>
        <div className="stack-panel"><span className="stack-title">TOOLS &amp; CAPABILITIES</span>{stack.map((group) => <div className="stack-group" key={group.name}><h3>{group.name}</h3><p>{group.items.join(" · ")}</p></div>)}</div>
      </section>

      <footer className="footer shell"><p>Have a brand, campaign, or digital product in mind?</p><h2>Let&apos;s make it move.</h2><div className="footer-links"><a href="https://github.com/AmrAbdelhay" target="_blank" rel="noreferrer">GitHub ↗</a><a href="#top">Back to top ↑</a></div><div className="footer-bottom"><span>Amr Ahmed Abdelhay</span><span>© 2026 · Cairo, Egypt</span></div></footer>
    </main>
  );
}
