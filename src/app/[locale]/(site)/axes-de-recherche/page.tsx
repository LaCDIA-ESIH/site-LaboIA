import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

import Highlights from "@/components/home/highlights";
import { ProjectCard } from "@/components/cards/cards";
import { sanityFetch } from "@/lib/sanity/client";
import { getServerLocale } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { projectListQuery } from "@/lib/sanity/queries";
import type { ProjectListItem } from "@/lib/sanity/types";
import { buildMetadata } from "@/lib/seo";
import { getSolutionsPageData } from "@/lib/cms";

import { isRemovedNavHref } from "@/lib/nav";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const page = await getSolutionsPageData(locale);

  return await buildMetadata({
    locale,
    title: page.heroTitle,
    description: page.heroDescription,
    seo: page.seo,
    path: localizedPath("/axes-de-recherche", locale),
    alternates: {
      fr: localizedPath("/axes-de-recherche", "fr"),
      en: localizedPath("/axes-de-recherche", "en"),
      ht: localizedPath("/axes-de-recherche", "ht"),
    },
  });
}

export default async function SolutionsPage() {
  const locale = await getServerLocale();
  const [projects, solutionsPage] = await Promise.all([
    sanityFetch<ProjectListItem[]>(projectListQuery, { locale }, []),
    getSolutionsPageData(locale),
  ]);

  const appliedProjects = projects.filter(
    (project) => project.projectType === "applied" || project.projectType === "hybrid",
  );

  const featuredUseCase = solutionsPage.featuredUseCase;

  return (
    <main>
      {/* Hero Section */}
      <section className="page-hero page-hero-dark">
        <div className="container" style={{ position: "relative" }}>
          {solutionsPage.heroBadge && (
            <div className="hero-badge" style={{ display: "inline-flex", marginBottom: "2rem" }}>
              <span
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-teal)", flexShrink: 0 }}
              />
              <span className="hero-badge-text">{solutionsPage.heroBadge}</span>
            </div>
          )}

          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
              color: "var(--color-text-white)",
              marginBottom: "1.5rem",
              maxWidth: "18ch",
            }}
          >
            {solutionsPage.heroTitle}
          </h1>

          {solutionsPage.heroSubtitle && (
            <p
              style={{
                fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
                color: "var(--color-text-light)",
                lineHeight: 1.75,
                maxWidth: "52ch",
                marginBottom: "0.75rem",
              }}
            >
              {solutionsPage.heroSubtitle}
            </p>
          )}

          {solutionsPage.heroDescription && (
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.7,
                maxWidth: "48ch",
                marginBottom: "2rem",
              }}
            >
              {solutionsPage.heroDescription}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
            {solutionsPage.heroPrimaryCta && !isRemovedNavHref(solutionsPage.heroPrimaryCta.href) ? (
              <Link href={solutionsPage.heroPrimaryCta.href} className="btn-cta-primary">
                {solutionsPage.heroPrimaryCta.label}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ) : null}
            {solutionsPage.heroSecondaryCta && !isRemovedNavHref(solutionsPage.heroSecondaryCta.href) ? (
              <Link href={solutionsPage.heroSecondaryCta.href} className="btn-secondary">
                {solutionsPage.heroSecondaryCta.label}
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* Architecture scientifique */}
      <Highlights />

      {/* Section Approche */}
      <section className="section section-white">
        <div className="container">
          <div style={{maxWidth:'48rem', marginBottom:'3rem'}}>
            <h2 className="section-title">
              {solutionsPage.approachTitle}
            </h2>
            <p className="section-subtitle">
              {solutionsPage.approachIntro}
            </p>
          </div>
          <div className="card-grid card-grid-3">
            {solutionsPage.approachSteps?.map((step, idx) => (
              <article
                key={`${step.title}-${idx}`}
                className="card card-hover" style={{padding:'2rem', animationDelay: `${idx * 100}ms`}}
              >
                <div className="card-accent-top" />
                <div style={{marginBottom:'1rem', display:'flex', height:'3rem', width:'3rem', alignItems:'center', justifyContent:'center', borderRadius:'0.75rem', background:'#ecfeff', color:'var(--haiti-blue)'}}>
                  <span style={{fontSize:'1.5rem', fontWeight:700}}>{idx + 1}</span>
                </div>
                <h3 style={{fontSize:'1.25rem', fontWeight:700, color:'#0f172a', marginBottom:'0.75rem'}}>{step.title}</h3>
                <p style={{fontSize:'1rem', color:'#475569', lineHeight:1.7}}>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section Solutions IA */}
      <section id="solutions" className="section section-light" style={{position:'relative', overflow:'hidden'}}>
        <div className="section-pattern dot-pattern pattern-20" />
        <div className="container" style={{position:'relative'}}>
          <div style={{maxWidth:'48rem', marginBottom:'3rem'}}>
            <h2 className="section-title">
              {solutionsPage.solutionsTitle}
            </h2>
            <p className="section-subtitle">
              {solutionsPage.solutionsIntro}
            </p>
          </div>
          <div className="card-grid card-grid-2">
            {solutionsPage.solutions?.map((solution, idx) => (
              <article
                key={solution._id}
                className="card card-hover" style={{padding:'2rem', animationDelay: `${idx * 100}ms`}}
              >
                <div className="card-accent-top" style={{background:'linear-gradient(to right, var(--haiti-blue), var(--haiti-blue))'}} />
                {solution.icon ? (
                  <span className="badge badge-cyan" style={{marginBottom:'1rem', textTransform:'uppercase', letterSpacing:'0.05em'}}>
                    {solution.icon}
                  </span>
                ) : null}
                <h3 style={{fontSize:'1.25rem', fontWeight:700, color:'#0f172a', marginBottom:'0.75rem'}}>
                  {solution.title}
                </h3>
                <p style={{fontSize:'1rem', color:'#475569', lineHeight:1.7}}>
                  {solution.shortDescription}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Section Cas d'usage */}
      <section id="cas-usage" className="section section-white">
        <div className="container">
          <div style={{display:'grid', gap:'3rem', gridTemplateColumns:'1fr', alignItems:'center'}} className="card-grid">
            <div>
              <span className="badge badge-teal" style={{marginBottom:'1.5rem', textTransform:'uppercase', letterSpacing:'0.05em'}}>
                {solutionsPage.useCasesTitle}
              </span>
              <h2 className="section-title" style={{marginBottom:'1.5rem'}}>
                {featuredUseCase?.title}
              </h2>
              <p style={{fontSize:'1rem', color:'#475569', lineHeight:1.7, marginBottom:'1rem'}}>
                {featuredUseCase?.context}
              </p>
              <p style={{fontSize:'1rem', color:'#475569', lineHeight:1.7, marginBottom:'1.5rem'}}>
                {featuredUseCase?.solution}
              </p>
              {featuredUseCase?.benefits?.length ? (
                <ul style={{display:'flex', flexDirection:'column', gap:'0.75rem'}}>
                  {featuredUseCase.benefits.map((benefit) => (
                    <li key={benefit} style={{display:'flex', alignItems:'flex-start', gap:'0.75rem'}}>
                      <div style={{marginTop:'0.375rem', display:'flex', height:'1.25rem', width:'1.25rem', alignItems:'center', justifyContent:'center', borderRadius:'9999px', background:'rgba(20,184,166,0.1)'}}>
                        <span style={{height:'0.5rem', width:'0.5rem', borderRadius:'9999px', background:'var(--haiti-blue)'}} aria-hidden />
                      </div>
                      <span style={{fontSize:'1rem', color:'#334155', lineHeight:1.7}}>{benefit}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="card gradient-card-bg" style={{position:'relative', borderRadius:'1.5rem', padding:'2rem', boxShadow:'var(--shadow-lg)'}}>
              <div style={{position:'absolute', inset:0, background:'radial-gradient(circle at 20% 20%, rgba(6,182,212,0.08), transparent 55%)'}} />
              <div className="card-accent-top" style={{background:'linear-gradient(to right, var(--haiti-blue), var(--haiti-blue))'}} />
              <div style={{position:'relative'}}>
                <p style={{fontSize:'1rem', fontWeight:700, color:'#0f172a', marginBottom:'1rem'}}>
                  {solutionsPage.flowTitle}
                </p>
                <p style={{fontSize:'0.875rem', color:'#475569', lineHeight:1.7, marginBottom:'2rem'}}>
                  {solutionsPage.flowDescription}
                </p>
                <div style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                  {solutionsPage.flowSteps?.map((step, idx) => (
                    <div key={`${step}-${idx}`} style={{display:'flex', alignItems:'center', gap:'0.75rem'}}>
                      <div style={{display:'flex', height:'2rem', width:'2rem', alignItems:'center', justifyContent:'center', borderRadius:'0.5rem', background:'#ecfeff', color:'var(--haiti-blue)'}}>
                        <span style={{fontSize:'0.875rem', fontWeight:700}}>{idx + 1}</span>
                      </div>
                      <span style={{fontSize:'0.875rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.05em', color:'#475569'}}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Secteurs */}
      <section className="section section-white">
        <div className="container">
          <div style={{maxWidth:'48rem', marginBottom:'3rem'}}>
            <h2 className="section-title">
              {solutionsPage.sectorsTitle}
            </h2>
            <p className="section-subtitle">
              {solutionsPage.sectorsIntro}
            </p>
          </div>
          <div className="card-grid card-grid-4" style={{gap:'1rem'}}>
            {solutionsPage.sectors?.map((sector, idx) => (
              <div
                key={sector._id}
                className="card card-hover gradient-card-bg" style={{padding:'1rem 1.5rem', textAlign:'center', fontSize:'1rem', fontWeight:500, color:'#334155', animationDelay: `${idx * 50}ms`}}
              >
                <div className="card-accent-top" style={{height:'2px', background:'linear-gradient(to right, var(--haiti-blue), var(--haiti-blue))', opacity:0, transition:'opacity 0.3s'}} />
                {sector.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Projets */}
      {appliedProjects.length > 0 && (
        <section id="projets" className="section section-light">
          <div className="container">
            <div style={{maxWidth:'48rem', marginBottom:'3rem'}}>
              <h2 className="section-title">
                {solutionsPage.projectsTitle}
              </h2>
              <p className="section-subtitle">
                {solutionsPage.projectsIntro}
              </p>
            </div>

            <div className="card-grid card-grid-2">
              {appliedProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
