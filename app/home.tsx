"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { PortfolioContent } from "./cms/content";

const filters = ["All", "Brand", "Paid Media", "Content", "Video", "Development"];

export default function Home({ content }: { content: PortfolioContent }) {
  const { caseStudies, experience, projects, services, stack, profile } = content;
  const aleemBrand = caseStudies.find(study => study.template === "aleem");
  const [activeFilter, setActiveFilter] = useState("All");
  const visibleProjects = useMemo(
    () => projects.filter((project) => activeFilter === "All" || project.category === activeFilter),
    [activeFilter, projects],
  );

  return (
    <main>
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand-mark" href="#top" aria-label="Amr Ahmed Abdelhay, home">AA</a>
        <div className="nav-links"><a href="#work">Work</a>{aleemBrand && <Link href={`/work/${aleemBrand.slug}#aleem-gallery`}>{aleemBrand.name} designs</Link>}<a href="#experience">Experience</a><a href="#about">About</a></div>
        <a className="nav-cta" href={profile.github} target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-kicker reveal"><span className="status-dot" /> {profile.location}</div>
        <h1 className="hero-title reveal delay-1">{profile.headline}<span>{profile.headlineSecond}</span></h1>
        <div className="hero-bottom reveal delay-2">
          <p>I&apos;m <strong>{profile.name}</strong>, a {profile.title} {profile.intro}</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore my work <span>↓</span></a><a className="button ghost" href="#about">My story</a></div>
        </div>
        <div className="hero-portrait">
          <img src={profile.portrait} alt={profile.name} />
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
                {study.template !== "rs" && !!study.metrics.length && <div className="mini-metrics">{study.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>}
                <a className="case-work-link" href={`/work/${study.slug}`}>Explore the full {study.name} story ↗</a>
              </div>
            </article>
          ))}
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
        <div className="about-copy"><div className="section-label"><span>05</span> About</div><h2>Business thinking.<br />Creative execution.<br /><em>Technical edge.</em></h2><p>{profile.about}</p></div>
        <div className="stack-panel"><span className="stack-title">TOOLS &amp; CAPABILITIES</span>{stack.map((group) => <div className="stack-group" key={group.name}><h3>{group.name}</h3><p>{group.items.join(" · ")}</p></div>)}</div>
      </section>

      <footer className="footer shell"><p>Have a brand, campaign, or digital product in mind?</p><h2>Let&apos;s make it move.</h2><div className="footer-links"><a href={profile.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href="#top">Back to top ↑</a></div><div className="footer-bottom"><span>{profile.name}</span><span>© 2026 · Cairo, Egypt</span></div></footer>
    </main>
  );
}
