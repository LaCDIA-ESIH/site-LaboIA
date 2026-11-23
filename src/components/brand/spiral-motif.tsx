"use client";

import { useEffect, useRef } from "react";

/**
 * Motif décoratif de l'accueil : la spirale du logo LaCDIA, tracée comme une
 * gravure. Elle tourne très lentement (animation CSS composée par le GPU : aucun
 * travail JavaScript au repos) ; les nœuds et le tracé s'écartent et s'illuminent
 * doucement au passage du curseur (ou du doigt) : la boucle d'animation ne tourne
 * que le temps de l'interaction. Sans mouvement si l'utilisateur a réduit les animations.
 */
const SIZE = 400;
const C = SIZE / 2;
const TURNS = 2.6;
const NODES = 30;
const PATH_POINTS = 160;
const LINK_STEP = 6;
const REACH = 95; // rayon d'influence du curseur (unités du viewBox)
const PUSH = 26; // déplacement maximal

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
    let last = performance.now();
    let raf = 0;
    let running = false;
    let visible = true;

    // Angle courant de la rotation CSS (propriété `rotate` calculée, ex. « 12.3deg »).
    const currentAngle = () => {
      const m = /(-?[\d.]+)deg/.exec(getComputedStyle(svg).rotate);
      return m ? (parseFloat(m[1]) * Math.PI) / 180 : 0;
    };

    // Position du curseur dans le repère du motif, avant rotation.
    const onMove = (e: PointerEvent) => {
      const rect = svg.getBoundingClientRect();
      // largeur de mise en page (indépendante de la rotation, contrairement au rectangle englobant)
      const size = parseFloat(getComputedStyle(svg).width);
      if (!rect.width || !size) return;
      const vx = e.clientX - (rect.left + rect.width / 2);
      const vy = e.clientY - (rect.top + rect.height / 2);
      const a = currentAngle();
      const cos = Math.cos(-a);
      const sin = Math.sin(-a);
      const k = SIZE / size;
      pointer.x = C + (vx * cos - vy * sin) * k;
      pointer.y = C + (vx * sin + vy * cos) * k;
      pointer.active = true;
      start();
    };
    const onLeave = () => {
      pointer.active = false;
      start();
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
      if (!visible) {
        running = false;
        return;
      }
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const ease = 1 - Math.exp(-dt * 7);
      let moving = pointer.active;

      const pathPts = pathBase.map((b, i) => {
        const inf = influence(b);
        const o = pathOff[i];
        o.x += (inf.dx - o.x) * ease;
        o.y += (inf.dy - o.y) * ease;
        if (Math.abs(o.x) + Math.abs(o.y) > 0.02) moving = true;
        return { x: b.x + o.x, y: b.y + o.y };
      });
      pathEl.setAttribute("d", toPath(pathPts));

      const nodePts = nodeBase.map((b, i) => {
        const inf = influence(b);
        const o = nodeOff[i];
        o.x += (inf.dx * 1.4 - o.x) * ease;
        o.y += (inf.dy * 1.4 - o.y) * ease;
        o.glow += (inf.k - o.glow) * ease;
        if (Math.abs(o.x) + Math.abs(o.y) + o.glow > 0.02) moving = true;
        return { x: b.x + o.x, y: b.y + o.y, glow: o.glow };
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

      // Au repos (curseur parti et tout revenu en place) : on arrête la boucle.
      if (moving) raf = requestAnimationFrame(frame);
      else running = false;
    };

    function start() {
      if (running || !visible) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(svg);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

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
