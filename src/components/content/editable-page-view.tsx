import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

import ContactForm from "@/components/forms/contact-form";
import CollaborateForm from "@/components/forms/collaborate-form";
import NewsletterForm from "@/components/forms/newsletter-form";
import NewsletterUnsubscribeForm from "@/components/forms/newsletter-unsubscribe-form";
import PortableTextRenderer from "@/components/content/portable-text";
import type { Locale } from "@/lib/i18n";
import type { FormSettings, InstitutionalPage, PageSection } from "@/lib/sanity/types";

type Props = {
  page: InstitutionalPage | null;
  forms?: FormSettings | null;
  children?: ReactNode;
  locale?: Locale;
};

function sectionClass(variant?: PageSection["variant"]) {
  if (variant === "heroDark") return "page-hero page-hero-dark";
  if (variant === "ctaDark") return "section section-dark";
  if (variant === "light") return "section section-light";
  return "section section-white";
}

function renderActions(actions?: PageSection["actions"], dark = false) {
  if (!actions?.length) return null;

  return (
    <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: dark ? "center" : undefined }}>
      {actions.map((action, index) => {
        if (!action.href || !action.label) return null;
        const className = action.variant === "primary" ? "btn btn-cta-primary" : "btn btn-secondary";
        return (
          <Link key={`${action.href}-${index}`} href={action.href} className={className}>
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}

function EditableForm({ type, forms, locale }: { type?: PageSection["formType"]; forms?: FormSettings | null; locale?: Locale }) {
  if (type === "contact") return <ContactForm copy={forms?.contact} locale={locale} />;
  if (type === "collaborate") return <CollaborateForm copy={forms?.collaborate} />;
  if (type === "newsletter") return <NewsletterForm copy={forms?.newsletter} />;
  if (type === "unsubscribe") return <NewsletterUnsubscribeForm copy={forms?.unsubscribe} locale={locale} />;
  return null;
}

function EditableSection({ section, forms, locale }: { section: PageSection; forms?: FormSettings | null; locale?: Locale }) {
  const isDark = section.variant === "heroDark" || section.variant === "ctaDark";
  const isHero = section.variant === "heroDark";
  const layout = section.layout ?? "content";

  return (
    <section id={section.anchor} className={sectionClass(section.variant)}>
      {isDark ? <div className="section-pattern grid-pattern pattern-40" /> : null}
      <div
        className="container"
        style={{
          position: "relative",
          maxWidth: layout === "form" ? "48rem" : undefined,
          textAlign: section.variant === "ctaDark" ? "center" : undefined,
        }}
      >
        {section.eyebrow ? (
          <div className="hero-badge" style={{ display: "inline-flex", marginBottom: "1.5rem" }}>
            <span className="hero-badge-text">{section.eyebrow}</span>
          </div>
        ) : null}

        {section.title ? (
          isHero ? (
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--color-text-white)",
                marginBottom: "1.5rem",
                maxWidth: "20ch",
              }}
            >
              {section.title}
            </h1>
          ) : (
            <h2
              className={isDark ? "section-title section-title-white" : "section-title"}
              style={{ marginBottom: "1rem" }}
            >
              {section.title}
            </h2>
          )
        ) : null}

        {section.intro ? (
          <p
            style={{
              maxWidth: "52ch",
              fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
              color: isDark ? "var(--color-text-light)" : "var(--color-text-body)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            {section.intro}
          </p>
        ) : null}

        {section.body?.length ? (
          <div style={{ marginTop: section.title || section.intro ? "1.5rem" : 0, maxWidth: "56rem" }}>
            <PortableTextRenderer value={section.body} />
          </div>
        ) : null}

        {layout === "cards" && section.cards?.length ? (
          <div className="card-grid card-grid-2" style={{ marginTop: "3rem" }}>
            {section.cards.map((card, index) => (
              <article key={card._key ?? `${card.title}-${index}`} className="card card-hover gradient-card-bg" style={{ padding: "2rem" }}>
                <div className="card-accent-top" />
                {card.icon ? <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div> : null}
                {card.label ? <span className="badge badge-cyan" style={{ marginBottom: "1rem" }}>{card.label}</span> : null}
                {card.title ? <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0f172a", marginBottom: "0.75rem" }}>{card.title}</h3> : null}
                {card.description ? <p style={{ color: "#475569", lineHeight: 1.7 }}>{card.description}</p> : null}
                {card.items?.length ? (
                  <ul style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {card.items.map((item) => <li key={item} style={{ color: "#475569" }}>{item}</li>)}
                  </ul>
                ) : null}
                {card.href && card.label ? <Link href={card.href} className="btn-link" style={{ marginTop: "1rem" }}>{card.label}</Link> : null}
              </article>
            ))}
          </div>
        ) : null}

        {layout === "pills" && section.cards?.length ? (
          <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            {section.cards.map((card, index) => (
              <span key={card._key ?? `${card.title}-${index}`} className="btn btn-cta-secondary" style={{ borderRadius: "9999px" }}>
                {card.title}
              </span>
            ))}
          </div>
        ) : null}

        {layout === "table" && section.tableRows?.length ? (
          <div className="card gradient-card-bg" style={{ marginTop: "2rem", padding: "2rem", overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: "0.875rem" }}>
              {section.tableHeaders?.length ? (
                <thead>
                  <tr>
                    {section.tableHeaders.map((cell) => <th key={cell} style={{ textAlign: "left", padding: "0.75rem 1rem" }}>{cell}</th>)}
                  </tr>
                </thead>
              ) : null}
              <tbody>
                {section.tableRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.cells?.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} style={{ padding: "0.75rem 1rem" }}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {layout === "form" ? <div style={{ marginTop: "2rem" }}><EditableForm type={section.formType} forms={forms} locale={locale} /></div> : null}
        {renderActions(section.actions, isDark)}
      </div>
    </section>
  );
}

export default function EditablePageView({ page, forms, children, locale }: Props) {
  if (!page) return null;

  const hasSections = Boolean(page.sections?.length);

  return (
    <main>
      {hasSections ? (
        page.sections?.map((section, index) => (
          <EditableSection key={section._key ?? `${section.title}-${index}`} section={section} forms={forms} locale={locale} />
        ))
      ) : (
        <>
          <EditableSection
            section={{
              _type: "pageSection",
              variant: "heroDark",
              layout: "content",
              eyebrow: page.heroBadge,
              title: page.title,
              intro: page.summary,
            }}
            forms={forms}
          />
          {page.content?.length ? (
            <section className="section section-white">
              <div className="container" style={{ maxWidth: "56rem" }}>
                <PortableTextRenderer value={page.content} />
              </div>
            </section>
          ) : null}
        </>
      )}
      {children}
      {page.ctaLabel && page.ctaHref ? (
        <section className="section section-light">
          <div className="container" style={{ textAlign: "center" }}>
            <Link href={page.ctaHref} className="btn btn-cta-primary">
              {page.ctaLabel}
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
