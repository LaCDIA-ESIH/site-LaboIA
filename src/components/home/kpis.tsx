"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { KpiItem, KpiSettings } from "@/lib/sanity/types";

type KpisProps = {
  title?: string;
  intro?: string;
  items: KpiItem[];
  meta?: KpiSettings;
};

type StripeMeta = { color: string; gradEnd: string };

// Cycled per item so the underline gradient direction alternates teal->violet / violet->teal.
const STRIPE_META: StripeMeta[] = [
  { color: "var(--haiti-blue)", gradEnd: "var(--haiti-red)" },
  { color: "var(--haiti-red)", gradEnd: "var(--haiti-blue)" },
  { color: "var(--haiti-blue)", gradEnd: "var(--haiti-red)" },
  { color: "var(--haiti-red)", gradEnd: "var(--haiti-blue)" },
];

function parseNum(val: string): number | null {
  const n = parseInt(val.replace(/\D/g, ""), 10);
  return isNaN(n) ? null : n;
}

function useCounter(target: number, active: boolean, duration = 1300) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return count;
}

function KpiStripe({ item, index, active }: { item: KpiItem; index: number; active: boolean }) {
  const m = STRIPE_META[index % STRIPE_META.length];
  const num = parseNum(item.value);
  const hasSuffix = item.value.includes("+");
  const count = useCounter(num ?? 0, active && num !== null, 1200 + index * 150);
  const display = num !== null ? String(count) + (hasSuffix ? "+" : "") : item.value;

  return (
    <div className="kpi-stripe" style={{ flex: "1 1 0", minWidth: 180, padding: "0 1.75rem" }}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.5rem,4vw,3.75rem)",
          fontWeight: 600,
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          backgroundImage: "linear-gradient(135deg, " + m.color + ", " + m.gradEnd + ")",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {display}
      </div>
      <span
        aria-hidden="true"
        style={{
          display: "block",
          width: 40,
          height: 3,
          borderRadius: 999,
          margin: "0.85rem 0 1rem",
          background: "linear-gradient(90deg, " + m.color + ", " + m.gradEnd + ")",
        }}
      />
      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 600, color: "var(--labo-text)", marginBottom: "0.35rem", lineHeight: 1.25 }}>
        {item.label}
      </div>
      {item.note && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.06em", color: "rgba(var(--ink-rgb),0.66)", margin: 0, lineHeight: 1.5 }}>
          {item.note}
        </p>
      )}
    </div>
  );
}

export default function Kpis({ title, intro, items, meta }: KpisProps) {
  const t = useTranslations("home.kpis");
  const list = items.length ? items : (t.raw("fallbackItems") as KpiItem[]);
  const sectionLabel = t("sectionLabel");
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const onIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    if (entries[0]?.isIntersecting) setActive(true);
  }, []);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(onIntersect, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onIntersect]);

  return (
    <section ref={sectionRef} className="section-labo" style={{ padding: "clamp(5rem,9vw,8rem) 0" }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "end", marginBottom: "3.5rem" }}>
          <div>
            <div className="badge-teal" style={{ display: "inline-flex", marginBottom: "1.25rem" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--labo-accent-teal)", flexShrink: 0 }} />
              {sectionLabel}
            </div>
            {title && (
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,3vw,2.75rem)", fontWeight: 600, color: "var(--labo-text)", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
                {title}
              </h2>
            )}
          </div>
          {intro && (
            <p style={{ fontSize: "0.95rem", color: "var(--labo-text-muted)", lineHeight: 1.75, margin: 0 }}>
              {intro}
            </p>
          )}
        </div>
        <div
          className="kpi-bar"
          style={{
            display: "flex",
            flexWrap: "wrap",
            borderRadius: 20,
            border: "1px solid var(--labo-border)",
            background: "var(--labo-surface)",
            padding: "2.5rem 0",
          }}
        >
          {list.map((item, i) => (
            <div key={item._id ?? i} className="kpi-bar-item" style={{ display: "flex", flex: "1 1 0", minWidth: 180 }}>
              <KpiStripe item={item} index={i} active={active} />
            </div>
          ))}
        </div>
        {(meta?.lastUpdated || meta?.disclaimer) && (
          <div style={{ marginTop: "1.75rem", display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.63rem", letterSpacing: "0.07em", color: "rgba(var(--ink-rgb),0.66)" }}>
            {meta.lastUpdated && <span>{t("updated")} {meta.lastUpdated}</span>}
            {meta.disclaimer && <span>{meta.disclaimer}</span>}
          </div>
        )}
      </div>
      <style>{`
        .kpi-bar-item:not(:first-child) { border-left: 1px solid var(--labo-border); }
        @media (max-width: 900px) {
          .kpi-bar-item { flex: 1 1 50% !important; min-width: 50% !important; margin-bottom: 2rem; }
          .kpi-bar-item:nth-child(odd) { border-left: none !important; }
        }
        @media (max-width: 540px) {
          .kpi-bar-item { flex: 1 1 100% !important; min-width: 100% !important; border-left: none !important; }
        }
        @media (prefers-reduced-motion: reduce) { .kpi-stripe { transition: none !important; } }
      `}</style>
    </section>
  );
}
