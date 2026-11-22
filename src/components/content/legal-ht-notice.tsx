import type { Locale } from "@/lib/i18n";

/** Avertissement affiché en tête des pages légales traduites en créole. */
export default function LegalHtNotice({ locale }: { locale: Locale }) {
  if (locale !== "ht") return null;
  return (
    <div
      role="note"
      style={{
        background: "var(--paper-2)",
        borderBottom: "1px solid var(--labo-border)",
        padding: "0.75rem 0",
        fontSize: "0.85rem",
        color: "var(--labo-text-muted)",
      }}
    >
      <div className="container">
        Vèsyon kreyòl sa a se yon tradiksyon enfòmatif. Si gen diferans, vèsyon fransè a fè lwa.
      </div>
    </div>
  );
}
