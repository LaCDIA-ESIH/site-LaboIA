import type { Locale } from "@/lib/i18n";

/**
 * Sélectionne la variante d'une chaîne éditoriale selon la locale.
 * `ht` retombe sur le français quand aucune traduction créole n'est fournie.
 */
export function pick<T>(locale: Locale, values: { fr: T; en: T; ht?: T }): T {
  if (locale === "en") return values.en;
  if (locale === "ht") return values.ht ?? values.fr;
  return values.fr;
}

const HT_MONTHS = [
  "janvye", "febrye", "mas", "avril", "me", "jen",
  "jiyè", "out", "septanm", "oktòb", "novanm", "desanm",
];

/** Date lisible dans la langue du site (le créole n'a pas toujours de données ICU). */
export function formatDate(
  value: string | Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" },
): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  if (locale === "ht") {
    const day = date.getUTCDate();
    const month = HT_MONTHS[date.getUTCMonth()];
    return options.day ? `${day} ${month} ${date.getUTCFullYear()}` : `${month} ${date.getUTCFullYear()}`;
  }
  return date.toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", options);
}
