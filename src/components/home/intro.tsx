import { pick } from "@/lib/i18n-pick";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n";

type IntroProps = {
  eyebrow?: string;
  title?: string;
  body?: string;
  locale?: Locale;
  // Option A — Sanity overrides
  visionTitle?: string;
  visionBody?: string;
  missionItems?: Array<{ text: string }>;
};

const MISSION_ITEMS = [
  {
    icon: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
    fr: "Produire des connaissances scientifiques originales en intelligence artificielle et en science des données.",
    en: "Produce original scientific knowledge in artificial intelligence and data science.",
    ht: "Pwodui konesans syantifik orijinal nan entèlijans atifisyèl ak nan syans done.",
  },
  {
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
    fr: "Développer des méthodes, jeux de données, prototypes et outils adaptés aux contextes haïtien et caribéen.",
    en: "Develop methods, datasets, prototypes and tools adapted to Haitian and Caribbean contexts.",
    ht: "Devlope metòd, baz done, pwototip ak zouti ki adapte ak kontèks ayisyen ak karayibeyen yo.",
  },
  {
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    fr: "Contribuer à la formation de chercheurs, doctorants, ingénieurs et professionnels.",
    en: "Contribute to the training of researchers, doctoral students, engineers and professionals.",
    ht: "Kontribye nan fòmasyon chèchè, doktoran, enjenyè ak pwofesyonèl.",
  },
  {
    icon: "M8 7h12m0 0l-4-4m4 4-4 4m0 6H4m0 0l4 4m-4-4 4-4",
    fr: "Favoriser le transfert responsable des connaissances et des technologies vers les acteurs publics, privés et communautaires.",
    en: "Foster responsible transfer of knowledge and technologies to public, private and community actors.",
    ht: "Ankouraje transfè konesans ak teknoloji yo avèk responsablite bay aktè piblik, prive ak kominotè yo.",
  },
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    fr: "Promouvoir une intelligence artificielle robuste, explicable, éthique, inclusive et respectueuse des personnes.",
    en: "Promote robust, explainable, ethical, inclusive and person-respecting artificial intelligence.",
    ht: "Defann yon entèlijans atifisyèl ki solid, ki ka eksplike, etik, enklizif epi ki respekte moun.",
  },
  {
    icon: "M3.055 11H5a2 2 0 0 1 2 2v1a2 2 0 0 0 2 2 2 2 0 0 1 2 2v2.945M8 3.935V5.5A2.5 2.5 0 0 0 10.5 8h.5a2 2 0 0 1 2 2 2 2 0 0 0 4 0 2 2 0 0 1 2-2h1.064M15 20.488V18a2 2 0 0 1 2-2h3.064",
    fr: "Contribuer au rayonnement scientifique d'Haïti et au développement de coopérations caribéennes et internationales.",
    en: "Contribute to Haiti's scientific influence and the development of Caribbean and international collaborations.",
    ht: "Kontribye nan reyonman syantifik Ayiti ak nan devlopman kolaborasyon karayibeyen ak entènasyonal.",
  },
];

const VALUES = [
  { fr: "Excellence scientifique", en: "Scientific excellence", ht: "Ekselans syantifik" },
  { fr: "Intégrité & transparence", en: "Integrity & transparency", ht: "Entegrite & transparans" },
  { fr: "Innovation responsable", en: "Responsible innovation", ht: "Inovasyon responsab" },
  { fr: "Inclusion & non-discrimination", en: "Inclusion & non-discrimination", ht: "Enklizyon & pa gen diskriminasyon" },
  { fr: "Interdisciplinarité", en: "Interdisciplinarity", ht: "Entèdisiplinarite" },
  { fr: "Ouverture scientifique", en: "Open science", ht: "Syans ouvè" },
  { fr: "Coopération caribéenne", en: "Caribbean cooperation", ht: "Kooperasyon karayibeyen" },
  { fr: "Protection des données", en: "Data protection", ht: "Pwoteksyon done" },
];

export default async function Intro({
  locale = "fr",
  visionTitle: sanityVisionTitle,
  visionBody: sanityVisionBody,
  missionItems: sanityMissionItems,
}: IntroProps) {
  const t = await getTranslations({ locale, namespace: "home" });
  const tIntro = await getTranslations({ locale, namespace: "home.intro" });

  // Mission items: use Sanity texts merged with local icons; fallback to local entirely
  const missionItems = MISSION_ITEMS.map((m, i) => ({
    icon: m.icon,
    text: sanityMissionItems?.[i]?.text ?? pick(locale, m),
  }));
  const values = VALUES.map((v) => pick(locale, v));

  return (
    <section
      id="vision-mission"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--labo-bg) 0%, var(--labo-surface) 50%, var(--labo-bg) 100%)",
        padding: "clamp(5rem,9vw,8rem) 0",
      }}
    >
      {/* Decorative gradient top border */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--labo-accent-teal), var(--labo-accent-violet), transparent)",
        }}
      />

      {/* Ambient glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(var(--haiti-blue-rgb),0.05) 0%, transparent 70%)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Grid: Vision (left) + Mission (right) ─────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
          marginBottom: "4rem",
        }} className="vision-mission-grid">

          {/* ── LEFT: Vision ────────────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 32, height: 1, background: "var(--labo-accent-teal)", opacity: 0.6 }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--labo-accent-teal)", fontWeight: 700,
              }}>
                {t("introEyebrow")}
              </span>
            </div>

            {/* Large vision statement */}
            <div style={{ position: "relative" }}>
              {/* Opening quote mark — decorative */}
              <span aria-hidden="true" style={{
                position: "absolute", top: "-1.5rem", left: "-0.5rem",
                fontFamily: "var(--font-display)", fontSize: "8rem", fontWeight: 600,
                lineHeight: 1, color: "var(--labo-accent-teal)", opacity: 0.07,
                userSelect: "none", pointerEvents: "none",
              }}>&ldquo;</span>

              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "clamp(1.5rem, 3.4vw, 2.6rem)", overflowWrap: "anywhere",
                lineHeight: 1.1, letterSpacing: "-0.035em",
                color: "var(--labo-text)", margin: "0 0 1.5rem",
                position: "relative",
              }}>
                {sanityVisionTitle ?? t("introTitle")}
              </h2>
            </div>

            <p style={{
              fontSize: "1rem", color: "var(--labo-text-muted)",
              lineHeight: 1.8, margin: "0 0 2rem",
            }}>
              {sanityVisionBody ?? t("introBody")}
            </p>

            {/* Founding date + institution */}
            <div style={{
              display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1rem", borderRadius: 999,
                background: "rgba(var(--haiti-blue-rgb),0.08)", border: "1px solid rgba(var(--haiti-blue-rgb),0.18)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--labo-accent-teal)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--labo-accent-teal)", letterSpacing: "0.08em" }}>
                  {tIntro("foundedLabel")}
                </span>
              </div>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 1rem", borderRadius: 999,
                background: "rgba(var(--haiti-red-rgb),0.08)", border: "1px solid rgba(var(--haiti-red-rgb),0.18)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--labo-accent-violet)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--labo-accent-violet)", letterSpacing: "0.08em" }}>
                  {pick(locale, { fr: "ESIH · Haïti", en: "ESIH · Haiti", ht: "ESIH · Ayiti" })}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Mission ───────────────────────────────── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 32, height: 1, background: "var(--labo-accent-violet)", opacity: 0.6 }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--labo-accent-violet)", fontWeight: 700,
              }}>
                Mission
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              {missionItems.map((item, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: "0.85rem",
                  padding: "0.9rem 1rem",
                  background: "rgba(var(--ink-rgb),0.02)",
                  border: "1px solid rgba(var(--ink-rgb),0.05)",
                  borderRadius: 12,
                  transition: "background 0.2s ease",
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: i % 2 === 0 ? "rgba(var(--haiti-blue-rgb),0.1)" : "rgba(var(--haiti-red-rgb),0.1)",
                    border: `1px solid ${i % 2 === 0 ? "rgba(var(--haiti-blue-rgb),0.2)" : "rgba(var(--haiti-red-rgb),0.2)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d={item.icon}
                        stroke={i % 2 === 0 ? "var(--haiti-blue)" : "var(--haiti-red)"}
                        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p style={{
                    fontSize: "0.84rem", color: "rgba(var(--ink-rgb),0.72)",
                    lineHeight: 1.65, margin: 0,
                  }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Values band ────────────────────────────────────── */}
        <div style={{
          borderTop: "1px solid rgba(var(--ink-rgb),0.06)",
          paddingTop: "2.5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.2em",
            textTransform: "uppercase", color: "var(--labo-text-muted)", opacity: 0.6,
            marginBottom: "1.25rem",
          }}>
            {pick(locale, { fr: "Valeurs", en: "Values", ht: "Valè" })}
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: "0.5rem",
          }}>
            {values.map((v, i) => (
              <span key={v} style={{
                fontSize: "0.8rem", fontWeight: 500,
                padding: "0.4rem 0.85rem", borderRadius: 999,
                background: i % 3 === 0
                  ? "rgba(var(--haiti-blue-rgb),0.07)"
                  : i % 3 === 1
                    ? "rgba(var(--haiti-red-rgb),0.07)"
                    : "rgba(var(--ink-rgb),0.04)",
                border: `1px solid ${i % 3 === 0
                  ? "rgba(var(--haiti-blue-rgb),0.15)"
                  : i % 3 === 1
                    ? "rgba(var(--haiti-red-rgb),0.15)"
                    : "rgba(var(--ink-rgb),0.08)"}`,
                color: i % 3 === 0
                  ? "rgba(var(--haiti-blue-rgb),0.85)"
                  : i % 3 === 1
                    ? "rgba(var(--haiti-red-rgb),0.9)"
                    : "rgba(var(--ink-rgb),0.55)",
              }}>
                {v}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #vision-mission .vision-mission-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </section>
  );
}
