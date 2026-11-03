"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { NewsListItem } from "@/lib/sanity/types";
import type { Locale } from "@/lib/i18n";

type Props = {
  title?: string;
  intro?: string;
  items: NewsListItem[];
  locale?: Locale;
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Recherche: { bg: "rgba(0,212,170,0.10)", text: "#00d4aa", border: "rgba(0,212,170,0.25)" },
  Partenariat: { bg: "rgba(108,99,255,0.10)", text: "#8b85ff", border: "rgba(108,99,255,0.25)" },
  Événement: { bg: "rgba(0,180,228,0.10)", text: "#00b4e4", border: "rgba(0,180,228,0.25)" },
  Annonce: { bg: "rgba(255,186,0,0.10)", text: "#ffc947", border: "rgba(255,186,0,0.25)" },
  default: { bg: "rgba(136,146,176,0.10)", text: "#8892b0", border: "rgba(136,146,176,0.20)" },
};

function getCategoryStyle(cat?: string) {
  if (!cat) return CATEGORY_COLORS.default;
  for (const key of Object.keys(CATEGORY_COLORS)) {
    if (key !== "default" && cat.toLowerCase().includes(key.toLowerCase())) {
      return CATEGORY_COLORS[key];
    }
  }
  return CATEGORY_COLORS.default;
}

function formatDate(dateStr?: string, locale = "fr"): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return dateStr;
  }
}

function getHref(item: NewsListItem, locale: Locale) {
  if (item.sourceUrl) return item.sourceUrl;
  const slugVal = item.slugIntl?.[locale]?.current ?? item.slug?.current;
  return `/actualites/${slugVal}`;
}

// `category` sert de clé interne pour le mapping de couleur (stable quelle
// que soit la locale) ; `label` est le texte affiché, localisable via
// `news.categoryIntl` côté CMS, retombe sur `category` si non traduit.
function CategoryPill({ category, label }: { category?: string; label?: string }) {
  if (!category) return null;
  const s = getCategoryStyle(category);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "0.2rem 0.65rem",
      borderRadius: 9999,
      fontSize: "0.62rem",
      fontFamily: "var(--font-mono)",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      background: s.bg,
      color: s.text,
      border: "1px solid " + s.border,
      flexShrink: 0,
    }}>
      {label ?? category}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.55 }}>
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Featured Card (large) ─── */
function FeaturedCard({ item, locale }: { item: NewsListItem; locale: Locale }) {
  const t = useTranslations("home.actualites");
  const tc = useTranslations("common");
  const ref = useRef<HTMLAnchorElement>(null);
  const catStyle = getCategoryStyle(item.category);
  const isExternal = Boolean(item.sourceUrl);
  const href = getHref(item, locale);

  const handleEnter = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translateY(-4px)";
    ref.current.style.boxShadow = "0 28px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(0,212,170,0.18)";
  }, []);
  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    ref.current.style.boxShadow = "0 12px 40px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.06)";
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={item.title}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        minHeight: "var(--actu-card-minh, 400px)",
        padding: "var(--actu-card-pad, 2.5rem)",
        background: "linear-gradient(135deg, rgba(0,212,170,0.08) 0%, rgba(108,99,255,0.12) 100%), #111827",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.06)",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        cursor: "pointer",
      }}
    >
      {/* Decorative blobs */}
      <div aria-hidden="true" style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden="true" style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Grid pattern overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        pointerEvents: "none",
      }} />

      {/* Top: category + date */}
      <div style={{ position: "absolute", top: "2rem", left: "var(--actu-card-pad, 2.5rem)", right: "var(--actu-card-pad, 2.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <CategoryPill category={item.category} label={item.categoryLabel} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.1em", color: "rgba(136,146,176,0.6)" }}>
          {formatDate(item.date, locale)}
        </span>
      </div>

      {/* Large watermark number */}
      <div aria-hidden="true" style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontFamily: "var(--font-display)",
        fontSize: "clamp(var(--actu-wm-min, 8rem), 15vw, 14rem)",
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: "-0.06em",
        color: "transparent",
        WebkitTextStroke: "1px rgba(0,212,170,0.06)",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
      }}>01</div>

      {/* Bottom content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.35rem, 2.5vw, 1.9rem)",
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: "-0.03em",
          color: "var(--labo-text, #f0f4ff)",
          marginBottom: "0.85rem",
        }}>
          {item.title}
        </h3>
        {item.summary && (
          <p style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9rem",
            color: "rgba(136,146,176,0.8)",
            lineHeight: 1.7,
            marginBottom: "1.5rem",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
            {item.summary}
          </p>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: catStyle.text, fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em" }}>
          <span>{isExternal ? t("external") : tc("readMore")}</span>
          {isExternal ? <ExternalIcon /> : <ArrowIcon />}
        </div>
      </div>
    </Link>
  );
}

/* ─── Compact Card ─── */
function CompactCard({ item, locale }: { item: NewsListItem; locale: Locale }) {
  const t = useTranslations("home.actualites");
  const ref = useRef<HTMLAnchorElement>(null);
  const catStyle = getCategoryStyle(item.category);
  const isExternal = Boolean(item.sourceUrl);
  const href = getHref(item, locale);

  const handleEnter = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translateX(4px)";
    ref.current.style.borderColor = catStyle.border;
    ref.current.style.background = "rgba(17,24,39,0.95)";
  }, [catStyle.border]);
  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "";
    ref.current.style.borderColor = "rgba(255,255,255,0.06)";
    ref.current.style.background = "rgba(17,24,39,0.75)";
  }, []);

  return (
    <Link
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      aria-label={item.title}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        padding: "1.4rem 1.5rem",
        borderRadius: 14,
        background: "rgba(17,24,39,0.75)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.22s ease, border-color 0.22s ease, background 0.22s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left accent bar */}
      <div aria-hidden="true" style={{
        position: "absolute", left: 0, top: "15%", bottom: "15%",
        width: 2, borderRadius: 2,
        background: "linear-gradient(to bottom, " + catStyle.text + "60, " + catStyle.text + "00)",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
        <CategoryPill category={item.category} label={item.categoryLabel} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.59rem", letterSpacing: "0.08em", color: "rgba(136,146,176,0.5)", flexShrink: 0 }}>
          {formatDate(item.date, locale)}
        </span>
      </div>

      <h3 style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(0.88rem, 1.2vw, 1.02rem)",
        fontWeight: 700,
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
        color: "var(--labo-text, #f0f4ff)",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}>
        {item.title}
      </h3>

      {item.summary && (
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "0.78rem",
          color: "rgba(136,146,176,0.65)",
          lineHeight: 1.6,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: 0,
        }}>
          {item.summary}
        </p>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: catStyle.text, marginTop: "auto" }}>
        {isExternal ? <ExternalIcon /> : <ArrowIcon />}
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.08em", fontWeight: 600 }}>
          {isExternal ? t("sourceLabel") : t("readLabel")}
        </span>
      </div>
    </Link>
  );
}

/* ─── Main Section ─── */
export default function ActualitesSection({ title, intro, items, locale = "fr" }: Props) {
  const t = useTranslations("home.actualites");
  const news = items.length > 0 ? items : (t.raw("fallbackItems") as NewsListItem[]);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Collect all unique categories (clé interne) + leur libellé localisé
  const allLabel = t("all");
  const categories = [allLabel, ...Array.from(new Set(news.map((n) => n.category).filter(Boolean) as string[]))];
  const categoryLabels = news.reduce<Record<string, string>>((acc, n) => {
    if (n.category && !acc[n.category]) acc[n.category] = n.categoryLabel ?? n.category;
    return acc;
  }, {});
  const [activeCategory, setActiveCategory] = useState<string>(allLabel);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setVisible(true); }, { threshold: 0.08 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Filtered list
  const filtered = activeCategory === allLabel
    ? news
    : news.filter((n) => n.category === activeCategory);

  // Featured = first with featured flag, fallback to first
  const featured = filtered.find((n) => n.featured) ?? filtered[0];
  const rest = filtered.filter((n) => n !== featured);

  // Initially show 4 compact cards, expand to show all
  const INITIAL_COUNT = 4;
  const visibleRest = expanded ? rest : rest.slice(0, INITIAL_COUNT);
  const hasMore = rest.length > INITIAL_COUNT && !expanded;

  if (news.length === 0) return null;

  return (
    <section
      id="actualites"
      ref={sectionRef}
      style={{
        background: "var(--labo-bg, #0A0F1C)",
        padding: "clamp(5rem, 9vw, 8rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decorative elements */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
        width: "80%", height: 1,
        background: "linear-gradient(90deg, transparent, rgba(0,212,170,0.15), transparent)",
        pointerEvents: "none",
      }} />
      <div aria-hidden="true" style={{
        position: "absolute", top: "20%", right: "-10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,99,255,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative" }}>

        {/* Section header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "flex-end",
          gap: "2rem",
          marginBottom: "2.5rem",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
          <div>
            <div className="badge-teal" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--labo-accent-teal)", flexShrink: 0 }} />
              {t("badge")}
            </div>
            {title && (
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontWeight: 900,
                color: "var(--labo-text, #f0f4ff)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: 0,
              }}>
                {title}
              </h2>
            )}
            {!title && (
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
                fontWeight: 900,
                color: "var(--labo-text, #f0f4ff)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                margin: 0,
              }}>
                {t("defaultTitle")}
              </h2>
            )}
            {intro && (
              <p style={{ marginTop: "0.75rem", fontSize: "0.95rem", color: "var(--labo-text-muted, #8892b0)", lineHeight: 1.7, maxWidth: "52ch" }}>
                {intro}
              </p>
            )}
          </div>

          {/* Decorative vertical count */}
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.12em",
            color: "rgba(136,146,176,0.35)",
            textAlign: "right",
            lineHeight: 2,
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "rgba(0,212,170,0.15)", letterSpacing: "-0.05em", lineHeight: 1 }}>
              {String(filtered.length).padStart(2, "0")}
            </div>
            <div>{t("articlesLabel")}</div>
          </div>
        </div>

        {/* Category filters */}
        {categories.length > 2 && (
          <div style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.15s",
          }}>
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              const s = cat === allLabel ? null : getCategoryStyle(cat);
              return (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setExpanded(false); }}
                  style={{
                    padding: "0.35rem 0.9rem",
                    borderRadius: 9999,
                    border: isActive
                      ? "1px solid " + (s?.border ?? "rgba(0,212,170,0.3)")
                      : "1px solid rgba(255,255,255,0.08)",
                    background: isActive
                      ? (s?.bg ?? "rgba(0,212,170,0.10)")
                      : "transparent",
                    color: isActive
                      ? (s?.text ?? "var(--labo-accent-teal)")
                      : "rgba(136,146,176,0.6)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat === allLabel ? cat : categoryLabels[cat] ?? cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Main layout: featured left + grid right */}
        {featured && (
          <div className="actualites-grid" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.25rem",
            alignItems: "stretch",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: "opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s",
          }}>
            {/* Featured card */}
            <FeaturedCard item={featured} locale={locale} />

            {/* Right column: compact cards grid */}
            <div className="actualites-compact-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "repeat(2, 1fr)",
              gap: "1.25rem",
            }}>
              {visibleRest.slice(0, 4).map((item) => (
                <CompactCard key={item._id} item={item} locale={locale} />
              ))}

              {/* Show more / empty slot */}
              {visibleRest.length < 4 && hasMore && (
                <button
                  onClick={() => setExpanded(true)}
                  style={{
                    gridColumn: visibleRest.length < 3 ? "span 2" : "span 1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "1.4rem",
                    borderRadius: 14,
                    border: "1px dashed rgba(0,212,170,0.20)",
                    background: "transparent",
                    color: "rgba(0,212,170,0.6)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,170,0.4)"; (e.currentTarget as HTMLElement).style.color = "#00d4aa"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,212,170,0.20)"; (e.currentTarget as HTMLElement).style.color = "rgba(0,212,170,0.6)"; }}
                >
                  <span>+{rest.length - visibleRest.length}</span>
                  <ArrowIcon />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Extended cards below (when expanded or more than 4 in rest) */}
        {visible && visibleRest.length > 4 && (
          <div className="actualites-ext-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.25rem",
            marginTop: "1.25rem",
          }}>
            {visibleRest.slice(4).map((item) => (
              <CompactCard key={item._id} item={item} locale={locale} />
            ))}
          </div>
        )}

        {/* Show all button */}
        {hasMore && !expanded && rest.length >= 4 && (
          <div style={{ marginTop: "2.5rem", display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setExpanded(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.75rem 2rem",
                borderRadius: 9999,
                border: "1px solid rgba(0,212,170,0.25)",
                background: "transparent",
                color: "#00d4aa",
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.22s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "rgba(0,212,170,0.08)";
                el.style.borderColor = "rgba(0,212,170,0.45)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "transparent";
                el.style.borderColor = "rgba(0,212,170,0.25)";
                el.style.transform = "";
              }}
            >
              {t("showAll")} (+{rest.length - INITIAL_COUNT})
              <ArrowIcon />
            </button>
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "rgba(136,146,176,0.5)", fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
            {t("noItems")}
          </div>
        )}
      </div>

      <style>{`
        #actualites { --actu-card-pad: 2.5rem; --actu-card-minh: 400px; --actu-wm-min: 8rem; }
        @media (max-width: 900px) {
          #actualites .actualites-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          #actualites .actualites-compact-grid { grid-template-columns: 1fr !important; }
          #actualites .actualites-ext-grid { grid-template-columns: 1fr 1fr !important; }
          #actualites { --actu-card-pad: 1.5rem; --actu-card-minh: 300px; --actu-wm-min: 5rem; }
        }
        @media (max-width: 480px) {
          #actualites .actualites-ext-grid { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; animation: none !important; }
        }
      `}</style>
    </section>
  );
}
