"use client";

import { useTranslations } from "next-intl";
import { GraduationCap, Globe, Users, Database, Building2, Sparkles } from "lucide-react";
import type { ComponentType, CSSProperties } from "react";

type TeamCategory = { badge: string; title: string; description: string; linkLabel?: string; linkHref?: string };
type TeamStat = { value: string; label: string };

// Splices a single inline link into a plain-text description by matching
// linkLabel verbatim (e.g. turning the "ESIH" in a sentence into a link to
// esih.edu) instead of requiring rich text for what's otherwise one word.
function DescriptionWithLink({ text, linkLabel, linkHref, color }: { text: string; linkLabel?: string; linkHref?: string; color: string }) {
  if (!linkLabel || !linkHref) return <>{text}</>;
  const index = text.indexOf(linkLabel);
  if (index === -1) return <>{text}</>;
  const before = text.slice(0, index);
  const after = text.slice(index + linkLabel.length);
  return (
    <>
      {before}
      <a href={linkHref} target="_blank" rel="noreferrer" style={{ color, textDecoration: "underline", textUnderlineOffset: 2 }}>
        {linkLabel}
      </a>
      {after}
    </>
  );
}

type TeamProps = {
  sectionLabel?: string;
  title?: string;
  intro?: string;
  note?: string;
  categories?: TeamCategory[];
  stats?: TeamStat[];
};

type CategoryMeta = {
  icon: ComponentType<{ size?: number; strokeWidth?: number; "aria-hidden"?: boolean }>;
  color: string;
};

// Order matches home.team.categories.
// Colors are literal hex (mirroring --tech-accent-teal / --tech-accent-violet)
// because they're suffixed with an alpha channel below (e.g. `color + "22"`),
// which var() cannot do.
const CATEGORY_META: CategoryMeta[] = [
  { icon: GraduationCap, color: "var(--haiti-blue)" },
  { icon: Globe, color: "var(--haiti-red)" },
  { icon: Users, color: "var(--haiti-blue)" },
  { icon: Database, color: "var(--haiti-red)" },
  { icon: Building2, color: "var(--haiti-blue)" },
  { icon: Sparkles, color: "var(--haiti-red)" },
];

// The zigzag offset is keyed by column position (index % 3), never by raw
// item index, and only takes effect once the grid is guaranteed to be 3
// columns wide (see the >=1024px rule below). That's what keeps a node from
// ever drifting into the row above/below it: two cards sharing a column
// always carry the *same* offset, so they move together instead of toward
// each other — a previous version alternated by raw index, which let a
// "down" card in row 1 collide with an "up" card directly below it in row 2.
const COLUMN_SHIFT = [-22, 30, -14];

function TeamNode({ item, meta, columnIndex }: { item: TeamCategory; meta: CategoryMeta; columnIndex: number }) {
  const Icon = meta.icon;
  const shift = COLUMN_SHIFT[columnIndex % COLUMN_SHIFT.length];
  return (
    <div
      className="team-node"
      style={{ "--node-shift": `${shift}px` } as CSSProperties}
    >
      <div
        className="card-tech-hover team-node-card"
        style={{ borderRadius: 18, padding: "1.5rem 1.5rem 1.65rem" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.85rem" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              flexShrink: 0,
              background: `radial-gradient(circle at 30% 30%, color-mix(in srgb, ${meta.color} 13%, transparent), color-mix(in srgb, ${meta.color} 5%, transparent))`,
              border: "1px solid " + meta.color + "33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: meta.color,
            }}
          >
            <Icon size={19} strokeWidth={1.7} aria-hidden />
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              letterSpacing: "0.06em",
              padding: "0.2rem 0.55rem",
              borderRadius: 999,
              background: meta.color + "14",
              border: "1px solid " + meta.color + "33",
              color: meta.color,
              whiteSpace: "nowrap",
            }}
          >
            {item.badge}
          </span>
        </div>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "0.98rem",
            fontWeight: 600,
            color: "var(--tech-text)",
            marginBottom: "0.4rem",
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>
        <p style={{ fontSize: "0.83rem", color: "var(--tech-text-muted)", lineHeight: 1.6, margin: 0 }}>
          <DescriptionWithLink text={item.description} linkLabel={item.linkLabel} linkHref={item.linkHref} color={meta.color} />
        </p>
      </div>
    </div>
  );
}

export default function Team({ sectionLabel, title, intro, note, categories, stats }: TeamProps) {
  const t = useTranslations("home.team");
  const list = categories?.length ? categories : (t.raw("categories") as TeamCategory[]);
  const statList = stats?.length ? stats : (t.raw("stats") as TeamStat[]);

  return (
    <section id="notre-equipe" className="section-tech" style={{ padding: "clamp(5rem,9vw,8rem) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "end", marginBottom: "4rem" }}>
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--tech-accent-teal)",
                marginBottom: "0.85rem",
              }}
            >
              {sectionLabel ?? t("sectionLabel")}
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem,3.2vw,2.75rem)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--tech-text)",
                margin: 0,
              }}
            >
              {title ?? t("sectionTitle")}
            </h2>
          </div>
          <p style={{ fontSize: "0.95rem", color: "var(--tech-text-muted)", lineHeight: 1.75, margin: 0 }}>
            {intro ?? t("sectionIntro")}
          </p>
        </div>

        <div className="team-track">
          {list.map((item, i) => (
            <TeamNode key={item.title} item={item} meta={CATEGORY_META[i % CATEGORY_META.length]} columnIndex={i % 3} />
          ))}
        </div>

        <div
          className="team-stats"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            overflow: "hidden",
            borderRadius: 16,
            border: "1px solid var(--tech-border)",
            gap: 1,
            background: "var(--tech-border)",
            marginTop: "3.5rem",
          }}
        >
          {statList.map((s) => (
            <div key={s.label} style={{ background: "var(--tech-surface)", padding: "1.5rem 1.25rem", textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "2.1rem",
                  fontWeight: 600,
                  lineHeight: 1,
                  marginBottom: "0.4rem",
                  backgroundImage: "linear-gradient(135deg, var(--tech-accent-teal), var(--tech-accent-violet))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--tech-text-muted)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.03em",
            color: "rgba(10,15,28,0.4)",
          }}
        >
          {note ?? t("note")}
        </p>
      </div>

      <style>{`
        .team-track {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.75rem;
          padding: 1rem 0;
        }
        .team-node {
          position: relative;
        }
        @media (min-width: 640px) {
          .team-track { grid-template-columns: repeat(2, 1fr); gap: 2rem; }
        }
        /* The zigzag offset only ever runs at this fixed 3-column width —
           COLUMN_SHIFT is written for exactly 3 columns, so it stays off at
           the 2-column tablet breakpoint above instead of risking a
           mismatched column count. */
        @media (min-width: 1024px) {
          .team-track { grid-template-columns: repeat(3, 1fr); gap: 2.5rem 1.75rem; padding: 3rem 0 1rem; }
          .team-node { transform: translateY(var(--node-shift)); transition: transform 0.4s ease; }
        }
        @media (max-width: 640px) {
          #notre-equipe [style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
          #notre-equipe .team-stats { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .team-node { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
