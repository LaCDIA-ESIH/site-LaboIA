"use client";

import { useEffect, useRef } from "react";

/**
 * Motif décoratif de l'accueil : la spirale du logo LaCDIA, tracée comme une
 * gravure. Elle tourne très lentement ; les nœuds et le tracé s'écartent et
 * s'illuminent doucement au passage du curseur (ou du doigt). Sans
 * mouvement si l'utilisateur a réduit les animations.
 */
const SIZE = 400;
const C = SIZE / 2;
const TURNS = 2.6;
const NODES = 30;
const PATH_POINTS = 160;
const LINK_STEP = 6;
const REACH = 95; // rayon d'influence du curseur (unités du viewBox)
const PUSH = 26; // déplacement maximal
const ROT_SPEED = 0.012; // rad/s (~8 min par tour)

type Pt = { x: number; y: number };
const r2 = (n: number) => Math.round(n * 100) / 100;

function base(t: number): Pt {
  const theta = t * TURNS * Math.PI * 2;
  const radius = 14 + t * 172;
  return { x: C + radius * Math.cos(theta), y: C + radius * Math.sin(theta) };
}

const pathBase = Array.from({ length: PATH_POINTS }, (_, i) => base(i / (PATH_POINTS - 1)));
const nodeBase = Array.from({ length: NODES }, (_, i) => base((i + 1) / NODES));
const linkPairs = nodeBase.flatMap((_, i) => (i + LINK_STEP < NODES ? [[i, i + LINK_STEP]] : []));

const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"}${r2(p.x)} ${r2(p.y)}`).join(" ");

export function SpiralMotif({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const linkRefs = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    const svg = svgRef.current;
    const pathEl = pathRef.current;
    if (!svg || !pathEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pointer = { x: -9999, y: -9999, active: false };
    // décalages lissés (ressort amorti simple)
    const pathOff = pathBase.map(() => ({ x: 0, y: 0 }));
    const nodeOff = nodeBase.map(() => ({ x: 0, y: 0, glow: 0 }));
    let angle = 0;
    let last = performance.now();
    let raf = 0;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width) return;
      pointer.x = ((e.clientX - rect.left) / rect.width) * SIZE;
      pointer.y = ((e.clientY - rect.top) / rect.height) * SIZE;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    const rotate = (p: Pt, cos: number, sin: number): Pt => {
      const dx = p.x - C;
      const dy = p.y - C;
      return { x: C + dx * cos - dy * sin, y: C + dx * sin + dy * cos };
    };

    // retourne l'influence (0-1) et le vecteur de répulsion pour un point
    const influence = (p: Pt) => {
      if (!pointer.active) return { k: 0, dx: 0, dy: 0 };
      const dx = p.x - pointer.x;
      const dy = p.y - pointer.y;
      const d = Math.hypot(dx, dy);
      if (d >= REACH || d === 0) return { k: 0, dx: 0, dy: 0 };
      const k = 1 - d / REACH;
      const f = k * k * PUSH;
      return { k, dx: (dx / d) * f, dy: (dy / d) * f };
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      angle += ROT_SPEED * dt;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const ease = 1 - Math.exp(-dt * 7);

      const pathPts = pathBase.map((b, i) => {
        const p = rotate(b, cos, sin);
        const inf = influence(p);
        const o = pathOff[i];
        o.x += (inf.dx - o.x) * ease;
        o.y += (inf.dy - o.y) * ease;
        return { x: p.x + o.x, y: p.y + o.y };
      });
      pathEl.setAttribute("d", toPath(pathPts));

      const nodePts = nodeBase.map((b, i) => {
        const p = rotate(b, cos, sin);
        const inf = influence(p);
        const o = nodeOff[i];
        o.x += (inf.dx * 1.4 - o.x) * ease;
        o.y += (inf.dy * 1.4 - o.y) * ease;
        o.glow += (inf.k - o.glow) * ease;
        return { x: p.x + o.x, y: p.y + o.y, glow: o.glow };
      });

      nodePts.forEach((n, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        const red = i % 7 === 3;
        el.setAttribute("cx", String(r2(n.x)));
        el.setAttribute("cy", String(r2(n.y)));
        el.setAttribute("r", String(r2((red ? 4.2 : 2.6) + n.glow * 3.2)));
        el.style.opacity = String(r2(0.85 + n.glow * 0.15));
      });

      linkPairs.forEach(([a, b], i) => {
        const el = linkRefs.current[i];
        if (!el) return;
        const glow = Math.max(nodePts[a].glow, nodePts[b].glow);
        el.setAttribute("x1", String(r2(nodePts[a].x)));
        el.setAttribute("y1", String(r2(nodePts[a].y)));
        el.setAttribute("x2", String(r2(nodePts[b].x)));
        el.setAttribute("y2", String(r2(nodePts[b].y)));
        el.style.opacity = String(r2(0.28 + glow * 0.9));
      });
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(svg);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={`spiral-motif ${className}`.trim()}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="var(--haiti-blue)" strokeLinecap="round">
        {[60, 110, 160, 190].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} strokeWidth="0.6" opacity="0.18" strokeDasharray="2 5" />
        ))}
        <g strokeWidth="0.7">
          {linkPairs.map(([a, b], i) => (
            <line
              key={i}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              x1={r2(nodeBase[a].x)}
              y1={r2(nodeBase[a].y)}
              x2={r2(nodeBase[b].x)}
              y2={r2(nodeBase[b].y)}
              opacity="0.28"
            />
          ))}
        </g>
        <path ref={pathRef} className="spiral-motif-path" d={toPath(pathBase)} pathLength={1} strokeWidth="1.6" />
      </g>
      <g>
        {nodeBase.map((n, i) => {
          const red = i % 7 === 3;
          return (
            <circle
              key={i}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              cx={r2(n.x)}
              cy={r2(n.y)}
              r={red ? 4.2 : 2.6}
              fill={red ? "var(--haiti-red)" : "var(--paper)"}
              stroke={red ? "var(--haiti-red)" : "var(--haiti-blue)"}
              strokeWidth="1.2"
            />
          );
        })}
      </g>
    </svg>
  );
}
