import Image from "next/image";

/** Logo officiel ESIH (copie de `public/logo/Porteur/`), 500×144. */
export const ESIH_LOGO_SRC = "/logo/esih.webp";
export const ESIH_URL = "https://esih.edu";

const LOGO_RATIO = 500 / 144;

/**
 * Marque de l'institution porteuse (ESIH) : logo officiel, redimensionné et
 * servi en WebP par next/image (dimensions réservées, pas de saut de mise en page).
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
  const color = tone === "dark" ? "#f3efe4" : "var(--ink)";
  const width = Math.round(height * LOGO_RATIO);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.65rem" }}>
      <Image
        src={ESIH_LOGO_SRC}
        alt="ESIH — École Supérieure d'Infotronique d'Haïti"
        width={width}
        height={height}
        sizes={`${width}px`}
        style={{
          height,
          width,
          maxWidth: "100%",
          objectFit: "contain",
          // Le logo officiel est rouge + bleu nuit : sur fond sombre, plaque papier.
          ...(tone === "dark"
            ? { background: "var(--paper)", padding: "0.5rem 0.75rem", borderRadius: 2, boxSizing: "content-box" }
            : {}),
        }}
      />
      {withName && name ? (
        <span style={{ color, fontSize: "0.8rem", lineHeight: 1.25, maxWidth: "13rem" }}>{name}</span>
      ) : null}
    </span>
  );
}
