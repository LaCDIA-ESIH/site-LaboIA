"use client";

import { useTranslations } from "next-intl";
import NeuralHeroBackground from "@/components/shared/neural-hero-background";
import type { Locale } from "@/lib/i18n";

type HeroProps = {
  badge?: string;
  subtitle?: string;
  locale?: Locale;
  // Override optionnel des 4 lignes du titre (CMS homePage.heroTitleLine1..4).
  // Vide par défaut : le titre de design ci-dessous (next-intl) s'affiche
  // tel quel tant qu'aucun éditeur ne les renseigne.
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  titleLine4?: string;
};

/* ─── Hero ─────────────────────────────────────────────────── */
export default function Hero({
  badge,
  subtitle,
  locale = "fr",
  titleLine1,
  titleLine2,
  titleLine3,
  titleLine4,
}: HeroProps) {
  const t = useTranslations("home.hero");
  const isFr = locale === "fr";
  let hiCount = 0;
  const labLines = (t.raw("labLines") as { t: string; hi?: boolean }[][]).map((line) =>
    line.map((part) => ({ ...part, order: part.hi ? hiCount++ : -1 })),
  );

  return (
    <section
      className="relative overflow-hidden hero-neural hero-section"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",
        backgroundColor: "var(--labo-bg)",
      }}
    >
      {/* Full-bleed neural network — the hero's background, not a side panel */}
      <NeuralHeroBackground />

      {/* Radial glow — teal bottom-left + violet top-right, over the whole section */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 55% at 88% 15%, rgba(108,99,255,0.20) 0%, transparent 65%)," +
            "radial-gradient(ellipse 50% 45% at 75% 85%, rgba(0,212,170,0.14) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* Legibility scrim — solid where the text sits, fading out toward the
          open network on the right. This is what turns the canvas into a
          true background instead of competing with the copy. */}
      <div
        aria-hidden="true"
        className="hero-scrim"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, var(--labo-bg) 0%, var(--labo-bg) 32%, rgba(10,15,28,0.86) 46%, rgba(10,15,28,0.32) 66%, transparent 84%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Content — overlaid on the network, not boxed beside it ─── */}
      <div
        className="relative hero-content"
        style={{
          padding: "clamp(2rem,4.5vw,3.75rem) clamp(2rem,6vw,6rem) clamp(6.5rem,11vw,8rem)",
          maxWidth: "47.5rem",
          marginLeft: "max(0px, calc((100% - 120rem) / 2))",
          zIndex: 10,
        }}
      >
        {/* Lab name — the acronym LaCDIA spelled out: its letters light up one by one */}
        <div className="lab-name" role="img" aria-label={t("labAria")}>
          <span className="lab-name-rule" aria-hidden="true" />
          <div aria-hidden="true">
            {labLines.map((line, i) => (
              <div key={i} className="lab-name-line">
                {line.map((part, j) => {
                  if (!part.hi) return <span key={j}>{part.t}</span>;
                  return (
                    <span
                      key={j}
                      className="lab-name-hi"
                      style={{ animationDelay: `${0.5 + part.order * 0.28}s` }}
                    >
                      {part.t}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
        <style>{`
          .lab-name { display: flex; gap: 1.35rem; margin: 0 0 2.75rem; }
          .lab-name-rule {
            width: 4px; flex-shrink: 0; border-radius: 4px;
            background: linear-gradient(to bottom, var(--labo-accent-teal), var(--labo-accent-violet));
            transform-origin: top; animation: lab-rule 0.9s cubic-bezier(.2,.7,.2,1) both;
          }
          .lab-name-line {
            font-family: var(--font-display); font-weight: 600;
            font-size: clamp(1.45rem, 2.7vw, 2.3rem); line-height: 1.22;
            letter-spacing: -0.015em; color: rgba(240,244,255,0.8);
          }
          .lab-name-hi {
            font-weight: 800; font-size: 1.1em; color: var(--labo-accent-teal);
            animation: lab-hi 0.7s ease-out both;
          }
          @keyframes lab-rule { from { transform: scaleY(0); } to { transform: scaleY(1); } }
          @keyframes lab-hi {
            from { color: rgba(240,244,255,0.8); text-shadow: none; }
            40% { color: #fff; text-shadow: 0 0 18px rgba(0,212,170,0.9); }
            to { color: var(--labo-accent-teal); text-shadow: 0 0 22px rgba(0,212,170,0.5); }
          }
          @media (prefers-reduced-motion: reduce) {
            .lab-name-rule, .lab-name-hi { animation: none; }
            .lab-name-hi { text-shadow: 0 0 22px rgba(0,212,170,0.5); }
          }
        `}</style>

        {/* Badge */}
        <div
          className="badge-teal"
          style={{ display: "inline-flex", marginBottom: "2.25rem" }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "var(--labo-accent-teal)",
              flexShrink: 0,
            }}
          />
          {badge ?? t("badge")}
        </div>

        {/* Stacked title — Syne 900. Font sizes are overridden with !important
            on narrow viewports (see <style> below): clamp() alone can't keep
            the longest line ("into intelligence." / "en intelligence.") from
            overflowing a ~360px phone at a sane minimum, so small screens get
            an explicit, visually-verified size instead of a computed guess. */}
        <h1
          className="hero-h1"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 900,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: "0 0 2rem",
          }}
        >
          {/* Line 1 */}
          <span
            className="hero-line"
            style={{
              display: "block",
              fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
              color: "var(--labo-text)",
            }}
          >
            {titleLine1 ?? t("titleLine1")}
          </span>

          {/* Line 2 */}
          <span
            className="hero-line"
            style={{
              display: "block",
              fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
              color: "var(--labo-text)",
            }}
          >
            {titleLine2 ?? t("titleLine2")}
          </span>

          {/* Line 3 — "caraïbéenne" / "data" — italic + gradient */}
          <span
            className="hero-line hero-line-accent"
            style={{
              display: "inline-block",
              fontSize: isFr
                ? "clamp(1.95rem, 3.8vw, 3.6rem)"
                : "clamp(3rem, 6vw, 5.75rem)",
              fontStyle: "italic",
              background: "linear-gradient(120deg, var(--labo-accent-teal) 0%, var(--labo-accent-violet) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              lineHeight: 1.05,
              // Italic glyphs slant past the text's own box, which cuts them
              // off when the background gradient is clipped to that box —
              // the extra right padding gives the slant room so the last
              // letters stay painted instead of vanishing.
              paddingRight: "0.2em",
            }}
          >
            {titleLine3 ?? t("titleLine3")}
          </span>

          {/* Line 4 */}
          <span
            className="hero-line"
            style={{
              display: "block",
              fontSize: "clamp(2.7rem, 5.1vw, 4.9rem)",
              color: "var(--labo-text)",
              opacity: 0.85,
            }}
          >
            {titleLine4 ?? t("titleLine4")}
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "clamp(0.98rem, 1.4vw, 1.2rem)",
            color: "var(--labo-text-muted)",
            lineHeight: 1.75,
            maxWidth: "37.5rem",
            marginBottom: "3rem",
          }}
        >
          {subtitle ?? t("subtitle")}
        </p>
      </div>

      {/* ── Bottom band — static (no animation), gray/gradient, full-bleed.
          Consolidates what used to be two separately-positioned pieces (a
          floating bottom-right caption, a plain fade) into one controlled
          region that closes the section: canvas label + scroll hint,
          right-aligned. Gray rather than the teal/violet accent used
          above — this band is the quiet close, not another accent
          moment. ─────────────────────────────────────────────────────── */}
      <div
        className="hero-bottom-band"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 8,
          borderTop: "1px solid rgba(148,163,184,0.12)",
          background:
            "linear-gradient(180deg, transparent 0%, rgba(17,24,39,0.55) 40%, rgba(17,24,39,0.95) 75%, var(--labo-bg) 100%)",
        }}
      >
        <div
          className="hero-bottom-band-inner"
          style={{
            maxWidth: "77.5rem",
            margin: "0 auto",
            padding: "clamp(1.1rem,2.4vw,1.6rem) clamp(2rem,6vw,6rem)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "1.25rem 2rem",
          }}
        >
          {/* Canvas label + scroll hint — same cluster, right-aligned */}
          <div className="hero-bottom-band-right" style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            <div
              aria-hidden="true"
              className="hero-canvas-label"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(0,212,170,0.5)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "rgba(0,212,170,0.5)",
                  boxShadow: "0 0 8px rgba(0,212,170,0.5)",
                  animation: "pulse-dot 2.4s ease-in-out infinite",
                }}
              />
              {t("canvasLabel")}
            </div>
            <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <span
                style={{
                  width: "24px",
                  height: "1px",
                  background: "linear-gradient(to right, transparent, rgba(148,163,184,0.5))",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(148,163,184,0.5)",
                }}
              >
                {t("scrollHint")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* minHeight: 100vh (inline, above) is the fallback for browsers
           without dvh support. On mobile, 100vh includes the area behind
           the address bar, which can clip content until the user scrolls —
           100dvh (dynamic viewport height) tracks the *visible* viewport
           instead. @supports keeps old browsers on the safe 100vh fallback. */
        @supports (height: 100dvh) {
          .hero-section { min-height: 100dvh !important; }
        }
        @media (max-width: 760px) {
          .hero-scrim {
            background: linear-gradient(
              180deg,
              var(--labo-bg) 0%,
              var(--labo-bg) 55%,
              rgba(10,15,28,0.9) 72%,
              rgba(10,15,28,0.55) 100%
            ) !important;
          }
          .hero-content { max-width: 100% !important; }
          .hero-h1 .hero-line { font-size: 2.5rem !important; }
          .hero-h1 .hero-line-accent { font-size: 2.15rem !important; }
          .hero-canvas-label { display: none !important; }
        }
        @media (max-width: 400px) {
          .hero-h1 .hero-line { font-size: 2.05rem !important; }
          .hero-h1 .hero-line-accent { font-size: 1.8rem !important; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-neural [style*="pulse-dot"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
