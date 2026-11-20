/**
 * Motif décoratif de l'accueil : la spirale du logo LaCDIA, tracée comme une
 * gravure (trait fin, nœuds, liaisons discrètes). Statique, sans script ;
 * le tracé s'anime à l'apparition sauf si l'utilisateur réduit les animations.
 */
const SIZE = 400;
const C = SIZE / 2;
const TURNS = 2.6;
const NODES = 30;

const r2 = (n: number) => Math.round(n * 100) / 100;

function spiralPoint(t: number) {
  // t ∈ [0,1] ; spirale d'Archimède, du centre vers l'extérieur
  const theta = t * TURNS * Math.PI * 2;
  const radius = 14 + t * 172;
  return { x: r2(C + radius * Math.cos(theta)), y: r2(C + radius * Math.sin(theta)), t };
}

const path = Array.from({ length: 160 }, (_, i) => spiralPoint(i / 159))
  .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
  .join(" ");

const nodes = Array.from({ length: NODES }, (_, i) => spiralPoint((i + 1) / NODES));
const links = nodes.flatMap((a, i) => {
  const b = nodes[i + 6];
  return b ? [{ a, b }] : [];
});

export function SpiralMotif({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`spiral-motif ${className}`.trim()}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="none" stroke="var(--haiti-blue)" strokeLinecap="round">
        {[60, 110, 160, 190].map((r) => (
          <circle key={r} cx={C} cy={C} r={r} strokeWidth="0.6" opacity="0.18" strokeDasharray="2 5" />
        ))}
        <g strokeWidth="0.7" opacity="0.28">
          {links.map(({ a, b }, i) => (
            <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />
          ))}
        </g>
        <path className="spiral-motif-path" d={path} pathLength={1} strokeWidth="1.6" />
      </g>
      <g>
        {nodes.map((n, i) => {
          const red = i % 7 === 3;
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
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
