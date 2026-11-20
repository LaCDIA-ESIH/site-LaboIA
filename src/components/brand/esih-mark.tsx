"use client";

import { useEffect, useState } from "react";

/** Logo officiel ESIH (copie de `public/logo/Porteur/`). */
export const ESIH_LOGO_SRC = "/logo/esih.webp";
export const ESIH_URL = "https://esih.edu";

/**
 * Marque de l'institution porteuse (ESIH).
 * Affiche le logo officiel `public/logo/esih.webp` (500×144, texte « ESIH » + nom inclus),
 * sinon un composé typographique propre — jamais d'image cassée.
 */
export function EsihMark({
  tone = "light",
  height = 34,
  withName = false,
  name,
}: {
  tone?: "light" | "dark";
  height?: number;
  withName?: boolean;
  name?: string;
}) {
  // Fallback typographique par défaut ; le logo officiel ne remplace que s'il charge vraiment.
  const [hasLogo, setHasLogo] = useState(false);
  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setHasLogo(true);
    probe.onerror = () => setHasLogo(false);
    probe.src = ESIH_LOGO_SRC;
  }, []);
  const missing = !hasLogo;
  const color = tone === "dark" ? "#f3efe4" : "var(--ink)";

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem" }}>
      {missing ? (
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            height,
            padding: "0 0.7rem",
            border: `1.5px solid ${color}`,
            color,
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            fontSize: height * 0.42,
          }}
        >
          ESIH
        </span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={ESIH_LOGO_SRC}
          alt="ESIH — École Supérieure d'Infotronique d'Haïti"
          height={height}
          style={{
            height,
            width: "auto",
            maxWidth: "100%",
            // Le logo officiel est rouge + bleu nuit : sur fond sombre, plaque papier.
            ...(tone === "dark"
              ? { background: "var(--paper)", padding: "0.5rem 0.75rem", borderRadius: 2 }
              : {}),
          }}
        />
      )}
      {withName && name ? (
        <span style={{ color, fontSize: "0.8rem", lineHeight: 1.25, maxWidth: "13rem" }}>{name}</span>
      ) : null}
    </span>
  );
}
