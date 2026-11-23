"use client";

import { useTranslations } from "next-intl";

/* ─── SVG icons (inline, zero deps) ───────────────────────── */
function IconBrain({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9.5 2C7.6 2 6 3.6 6 5.5c0 .4.1.8.2 1.2C4.9 7.3 4 8.6 4 10c0 1.1.4 2.1 1.1 2.8-.1.4-.1.8-.1 1.2C5 15.7 6.3 17 8 17.5V22h8v-4.5c1.7-.5 3-1.8 3-3.5 0-.4-.1-.8-.2-1.2.7-.7 1.2-1.7 1.2-2.8 0-1.4-.9-2.7-2.2-3.3.1-.4.2-.8.2-1.2C18 3.6 16.4 2 14.5 2c-.8 0-1.5.3-2 .7C12 2.3 11.3 2 10.5 2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v8M9 11h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconNetwork({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="5" r="2" stroke={color} strokeWidth="1.6" />
      <circle cx="5" cy="19" r="2" stroke={color} strokeWidth="1.6" />
      <circle cx="19" cy="19" r="2" stroke={color} strokeWidth="1.6" />
      <path d="M12 7v4M12 11 5 17M12 11l7 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconRocket({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C12 2 7 7 7 14l5 5 5-5c0-7-5-12-5-12Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="2" stroke={color} strokeWidth="1.6" />
      <path d="M7 14c-1.5 1-2.5 3-2 5l2-2M17 14c1.5 1 2.5 3 2 5l-2-2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L4 6v5c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V6l-8-4Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEye({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

function IconLock({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke={color} strokeWidth="1.6" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill={color} />
    </svg>
  );
}

function IconScale({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v18M3 9l4 7-4 0M21 9l-4 7 4 0" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9h6M15 9h6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 21h8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" />
      <path d="M8.5 12.5l2.5 2.5 5-5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconDoc({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v6h6M8 13h8M8 17h5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const PILLAR_ICONS: Record<string, typeof IconShield> = {
  shield: IconShield,
  eye: IconEye,
  lock: IconLock,
  scale: IconScale,
  check: IconCheck,
  doc: IconDoc,
};

type EthicsPillar = { icon: string; label: string };

/* ─── Keyword tag ──────────────────────────────────────────── */
function KeyTag({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span style={{
      fontSize: "0.72rem",
      fontWeight: 500,
      padding: "0.3rem 0.7rem",
      borderRadius: 999,
      background: bg,
      border: "1px solid " + border,
      color,
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

/* ─── Axis card ────────────────────────────────────────────── */
function AxeCard({
  label, num, title, description, keywords, objectives, objectivesLabel,
  color, bg, border, Icon,
}: {
  label: string; num: string; title: string; description: string;
  keywords: string[]; objectives: string; objectivesLabel: string;
  color: string; bg: string; border: string;
  Icon: typeof IconBrain;
}) {
  return (
    <div
      className="axe-card-scientific"
      style={{
        position: "relative",
        background: "var(--labo-surface)",
        border: "1px solid " + border,
        borderRadius: 20,
        padding: "2.5rem 2.25rem 2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.35rem",
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* Top accent line */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${color}, ${color === "var(--haiti-blue)" ? "var(--haiti-red)" : "var(--haiti-blue)"})`,
      }} />

      {/* Ghost number */}
      <span aria-hidden="true" className="ghost-num" data-num={num} style={{ color }} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${color} 27%, transparent), color-mix(in srgb, ${color} 7%, transparent))`,
          border: "1px solid " + border,
          display: "flex", alignItems: "center", justifyContent: "center", color,
          flexShrink: 0,
        }}>
          <Icon size={23} color={color} />
        </div>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.18em",
          color, fontWeight: 700,
          background: bg, border: "1px solid " + border,
          padding: "0.3rem 0.7rem", borderRadius: 999,
        }}>
          {label}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
        fontWeight: 600, color: "var(--labo-text)", margin: 0, lineHeight: 1.25,
        letterSpacing: "-0.02em",
      }}>
        {title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: "0.88rem", color: "var(--labo-text-muted)", lineHeight: 1.75,
        margin: 0, flex: 1,
      }}>
        {description}
      </p>

      {/* Keywords */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {keywords.map((kw) => (
          <KeyTag key={kw} label={kw} color={color} bg={bg} border={border} />
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: border }} />

      {/* Objectives */}
      <div>
        <p style={{
          fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color, marginBottom: "0.5rem", fontWeight: 700,
        }}>
          {objectivesLabel}
        </p>
        <p style={{ fontSize: "0.8rem", color: "rgba(var(--ink-rgb),0.66)", lineHeight: 1.7, margin: 0 }}>
          {objectives.split("·").map((obj, i) => (
            <span key={i} style={{ display: "block" }}>
              {i > 0 ? "· " : ""}{obj.trim()}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

/* ─── Pôle card ────────────────────────────────────────────── */
function PoleCard({
  label, title, description, sectors, note, sectorsLabel,
}: {
  label: string; title: string; description: string; sectors: string[]; note: string; sectorsLabel: string;
}) {
  const gold = "var(--ink)";
  const goldBg = "rgba(var(--ink-rgb),0.06)";
  const goldBorder = "rgba(var(--ink-rgb),0.2)";

  return (
    <div style={{
      position: "relative",
      background: "var(--labo-surface)",
      border: "1px solid " + goldBorder,
      borderRadius: 20,
      padding: "2.25rem 2.5rem",
      overflow: "hidden",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 17rem), 1fr))",
      gap: "2rem",
      alignItems: "start",
    }}>
      {/* Top accent */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${gold}, rgba(var(--ink-rgb),0.2), transparent)`,
      }} />

      {/* Left — identity */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${gold} 20%, transparent), color-mix(in srgb, ${gold} 5%, transparent))`,
            border: "1px solid " + goldBorder,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconRocket size={23} color={gold} />
          </div>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.18em",
            color: gold, opacity: 0.9, fontWeight: 700,
            background: goldBg, border: "1px solid " + goldBorder,
            padding: "0.3rem 0.7rem", borderRadius: 999,
          }}>
            {label}
          </span>
        </div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
          fontWeight: 600, color: "var(--labo-text)", margin: 0, letterSpacing: "-0.02em", lineHeight: 1.3,
        }}>
          {title}
        </h3>
        <p style={{ fontSize: "0.88rem", color: "var(--labo-text-muted)", lineHeight: 1.75, margin: 0 }}>
          {description}
        </p>
      </div>

      {/* Right — sectors + note */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em",
            textTransform: "uppercase", color: gold, marginBottom: "0.6rem", fontWeight: 700,
          }}>
            {sectorsLabel}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {sectors.map((s) => (
              <KeyTag key={s} label={s} color={gold} bg={goldBg} border={goldBorder} />
            ))}
          </div>
        </div>
        <div style={{
          background: "rgba(var(--ink-rgb),0.04)", border: "1px solid rgba(var(--ink-rgb),0.14)",
          borderRadius: 12, padding: "1rem 1.1rem",
        }}>
          <p style={{ fontSize: "0.78rem", color: "rgba(var(--ink-rgb),0.66)", lineHeight: 1.65, margin: 0, fontStyle: "italic" }}>
            {note}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Flow arrow connector ─────────────────────────────────── */
function FlowConnector({ label, text }: { label: string; text: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
      padding: "1.25rem 0",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(var(--haiti-blue-rgb),0.4))" }} />
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.14em",
          textTransform: "uppercase", color: "var(--labo-accent-teal)",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="var(--haiti-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {label}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="var(--haiti-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(var(--haiti-blue-rgb),0.4), transparent)" }} />
      </div>
      <p style={{
        fontSize: "0.78rem", color: "rgba(var(--ink-rgb),0.66)", textAlign: "center",
        fontStyle: "italic", maxWidth: 480, margin: 0, lineHeight: 1.6,
      }}>
        {text}
      </p>
    </div>
  );
}

/* ─── Ethics transversal banner ────────────────────────────── */
function EthicsBanner({
  ethicsLabel, ethicsTitle, ethicsText, ethicsPillars,
}: {
  ethicsLabel: string; ethicsTitle: string; ethicsText: string; ethicsPillars: EthicsPillar[];
}) {
  const teal = "var(--labo-accent-teal)";
  const violet = "var(--labo-accent-violet)";

  return (
    <div style={{
      position: "relative",
      background: "linear-gradient(135deg, rgba(var(--haiti-blue-rgb),0.06) 0%, rgba(var(--haiti-red-rgb),0.06) 50%, rgba(var(--haiti-blue-rgb),0.04) 100%)",
      border: "1px solid rgba(var(--haiti-blue-rgb),0.2)",
      borderRadius: 24,
      padding: "2.5rem 2.5rem 2rem",
      overflow: "hidden",
    }}>
      {/* Gradient border top */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${teal}, ${violet}, ${teal})`,
      }} />

      {/* Background glow */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(var(--haiti-blue-rgb),0.08) 0%, transparent 70%)",
      }} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: "linear-gradient(135deg, rgba(var(--haiti-blue-rgb),0.2), rgba(var(--haiti-red-rgb),0.2))",
          border: "1px solid rgba(var(--haiti-blue-rgb),0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <IconShield size={20} color={teal} />
        </div>
        <div>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em",
            textTransform: "uppercase", color: teal, opacity: 0.85, marginBottom: "0.15rem", fontWeight: 700,
          }}>
            {ethicsLabel}
          </p>
          <h3 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
            fontWeight: 600, color: "var(--labo-text)", margin: 0, letterSpacing: "-0.02em",
          }}>
            {ethicsTitle}
          </h3>
        </div>
      </div>

      <p style={{
        fontSize: "0.9rem", color: "var(--labo-text-muted)", lineHeight: 1.75,
        margin: "0 0 2rem", maxWidth: 740,
      }}>
        {ethicsText}
      </p>

      {/* Pillars grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "0.75rem",
      }} className="ethics-pillars-grid">
        {ethicsPillars.map((pillar) => {
          const PillarIcon = PILLAR_ICONS[pillar.icon] ?? IconShield;
          return (
            <div key={pillar.label} style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              background: "rgba(var(--haiti-blue-rgb),0.05)", border: "1px solid rgba(var(--haiti-blue-rgb),0.12)",
              borderRadius: 10, padding: "0.7rem 0.9rem",
            }}>
              <PillarIcon size={15} color={teal} />
              <span style={{ fontSize: "0.78rem", color: "rgba(var(--ink-rgb),0.7)", lineHeight: 1.4 }}>
                {pillar.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main component ───────────────────────────────────────── */
type HighlightsProps = {
  // Legacy / fallback props (existing CMS highlights, kept for compat)
  title?: string;
  intro?: string;
  items?: unknown[];
  // Option A — Sanity overrides for scientific architecture
  axe1Title?: string;
  axe1Description?: string;
  axe1Keywords?: string; // "A · B · C" string from Sanity
  axe1Objectives?: string;
  axe2Title?: string;
  axe2Description?: string;
  axe2Keywords?: string;
  axe2Objectives?: string;
  poleTitle?: string;
  poleDescription?: string;
  poleSectors?: string; // "A · B · C" string from Sanity
  poleNote?: string;
  ethicsTitle?: string;
  ethicsText?: string;
};

/** Split a "A · B · C" Sanity string into a trimmed string array. */
function splitDot(s?: string): string[] | null {
  if (!s?.trim()) return null;
  return s.split("·").map((p) => p.trim()).filter(Boolean);
}

export default function Highlights({
  axe1Title: sAxe1Title,
  axe1Description: sAxe1Desc,
  axe1Keywords: sAxe1Kw,
  axe1Objectives: sAxe1Obj,
  axe2Title: sAxe2Title,
  axe2Description: sAxe2Desc,
  axe2Keywords: sAxe2Kw,
  axe2Objectives: sAxe2Obj,
  poleTitle: sPoleTitle,
  poleDescription: sPoleDesc,
  poleSectors: sPoleSectors,
  poleNote: sPoleNote,
  ethicsTitle: sEthicsTitle,
  ethicsText: sEthicsText,
}: HighlightsProps) {
  const t = useTranslations("home.highlights");

  // Keywords / sectors: prefer Sanity string (split on ·), fallback to translation array
  const axe1Keywords = splitDot(sAxe1Kw) ?? (t.raw("axe1Keywords") as string[]);
  const axe2Keywords = splitDot(sAxe2Kw) ?? (t.raw("axe2Keywords") as string[]);
  const poleSectors  = splitDot(sPoleSectors) ?? (t.raw("poleSectors") as string[]);
  const ethicsPillars = t.raw("ethicsPillars") as EthicsPillar[];

  const teal = "var(--haiti-blue)";
  const tealBg = "rgba(var(--haiti-blue-rgb),0.1)";
  const tealBorder = "rgba(var(--haiti-blue-rgb),0.2)";
  const violet = "var(--haiti-red)";
  const violetBg = "rgba(var(--haiti-red-rgb),0.1)";
  const violetBorder = "rgba(var(--haiti-red-rgb),0.2)";

  return (
    <section
      id="architecture-scientifique"
      style={{
        padding: "clamp(5rem,9vw,8rem) 0",
        background: "var(--labo-bg)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glows */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 55% 40% at 15% 20%, rgba(var(--haiti-blue-rgb),0.06) 0%, transparent 60%)," +
          "radial-gradient(ellipse 50% 35% at 85% 70%, rgba(var(--haiti-red-rgb),0.06) 0%, transparent 60%)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* ── Section header ──────────────────────────────────── */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 1, background: "var(--labo-accent-teal)", opacity: 0.6 }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--labo-accent-teal)", fontWeight: 700,
            }}>
              {t("sectionLabel")}
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.0,
            color: "var(--labo-text)", margin: "0 0 1.25rem",
          }}>
            {t("sectionTitle")}
          </h2>
          <p style={{
            fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)", color: "var(--labo-text-muted)",
            lineHeight: 1.75, maxWidth: 680, margin: 0, fontStyle: "italic",
          }}>
            &ldquo;{t("sectionIntro")}&rdquo;
          </p>
        </div>

        {/* ── Two axes side by side ────────────────────────────── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.75rem",
          marginBottom: "0",
        }} className="axes-duo-grid">
          <AxeCard
            label={t("axe1Label")}
            num="01"
            title={sAxe1Title ?? t("axe1Title")}
            description={sAxe1Desc ?? t("axe1Description")}
            keywords={axe1Keywords}
            objectives={sAxe1Obj ?? t("axe1Objectives")}
            objectivesLabel={t("objectivesLabel")}
            color={teal}
            bg={tealBg}
            border={tealBorder}
            Icon={IconBrain}
          />
          <AxeCard
            label={t("axe2Label")}
            num="02"
            title={sAxe2Title ?? t("axe2Title")}
            description={sAxe2Desc ?? t("axe2Description")}
            keywords={axe2Keywords}
            objectives={sAxe2Obj ?? t("axe2Objectives")}
            objectivesLabel={t("objectivesLabel")}
            color={violet}
            bg={violetBg}
            border={violetBorder}
            Icon={IconNetwork}
          />
        </div>

        {/* ── Flow connector ────────────────────────────────────── */}
        <FlowConnector
          label={t("flowLabel")}
          text={t("flowText")}
        />

        {/* ── Pôle de valorisation ─────────────────────────────── */}
        <div style={{ marginBottom: "2.5rem" }}>
          <PoleCard
            label={t("poleLabel")}
            title={sPoleTitle ?? t("poleTitle")}
            description={sPoleDesc ?? t("poleDescription")}
            sectors={poleSectors}
            note={sPoleNote ?? t("poleNote")}
            sectorsLabel={t("sectorsLabel")}
          />
        </div>

        {/* ── Ethics transversal banner ─────────────────────────── */}
        <EthicsBanner
          ethicsLabel={t("ethicsLabel")}
          ethicsTitle={sEthicsTitle ?? t("ethicsTitle")}
          ethicsText={sEthicsText ?? t("ethicsText")}
          ethicsPillars={ethicsPillars}
        />
      </div>

      <style>{`
        @media (max-width: 900px) {
          #architecture-scientifique .axes-duo-grid {
            grid-template-columns: 1fr !important;
          }
          #architecture-scientifique .ethics-pillars-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 640px) {
          #architecture-scientifique .ethics-pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          #architecture-scientifique .axe-card-scientific [style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        #architecture-scientifique .axe-card-scientific {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        #architecture-scientifique .axe-card-scientific:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        @media (prefers-reduced-motion: reduce) {
          #architecture-scientifique .axe-card-scientific { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
