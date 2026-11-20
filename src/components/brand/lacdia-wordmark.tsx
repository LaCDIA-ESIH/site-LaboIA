import Image from "next/image";

/**
 * Logotype LaCDIA : la spirale officielle + le nom composé en texte
 * (net à toutes les tailles, aux couleurs du logo : « La » encre,
 * « CD » bleu, « IA » rouge).
 */
export function LaCDIAWordmark({
  size = "md",
  tone = "light",
  descriptor,
}: {
  size?: "sm" | "md" | "lg";
  /** `light` : sur fond clair · `dark` : sur fond sombre (footer) */
  tone?: "light" | "dark";
  descriptor?: string;
}) {
  const px = size === "lg" ? 72 : size === "md" ? 44 : 34;
  const font = size === "lg" ? "2.4rem" : size === "md" ? "1.55rem" : "1.25rem";
  const la = tone === "dark" ? "#d9dce6" : "#6a7287";
  const cd = tone === "dark" ? "#8fa8ff" : "var(--haiti-blue)";
  const ia = tone === "dark" ? "#ff6b81" : "var(--haiti-red)";

  return (
    <span className="lacdia-wordmark" style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
      <Image
        src="/logo/lacdia-mark.png"
        alt=""
        width={Math.round(px * 1.24)}
        height={px}
        priority
        style={{ height: px, width: "auto" }}
      />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: font,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: la }}>La</span>
          <span style={{ color: cd }}>CD</span>
          <span style={{ color: ia }}>IA</span>
        </span>
        {descriptor ? (
          <span
            style={{
              marginTop: "0.3rem",
              fontSize: "0.62rem",
              letterSpacing: "0.04em",
              color: tone === "dark" ? "rgba(243,239,228,0.7)" : "var(--labo-text-muted)",
              maxWidth: "15rem",
              lineHeight: 1.25,
            }}
          >
            {descriptor}
          </span>
        ) : null}
      </span>
    </span>
  );
}
