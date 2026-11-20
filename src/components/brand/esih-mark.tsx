"use client";

import { useEffect, useState } from "react";

/** Chemin du logo officiel ESIH : déposer le fichier dans `public/logo/`. */
export const ESIH_LOGO_SRC = "/logo/esih.svg";
export const ESIH_URL = "https://esih.edu";

/**
 * Marque de l'institution porteuse (ESIH).
 * Affiche le logo officiel s'il est présent dans `public/logo/esih.svg`,
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
          alt="ESIH"
          height={height}
          style={{ height, width: "auto" }}
        />
      )}
      {withName && name ? (
        <span style={{ color, fontSize: "0.8rem", lineHeight: 1.25, maxWidth: "13rem" }}>{name}</span>
      ) : null}
    </span>
  );
}
