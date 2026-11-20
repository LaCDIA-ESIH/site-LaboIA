import { getRequestConfig } from "next-intl/server";
import { type Locale, defaultLocale, isLocale } from "@/lib/i18n";

type Messages = Record<string, unknown>;

function isPlainObject(value: unknown): value is Messages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Fusion profonde : les clés absentes de `override` retombent sur `base`. */
function mergeMessages(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] =
      isPlainObject(current) && isPlainObject(value) ? mergeMessages(current, value) : value;
  }
  return out;
}

/**
 * Configuration next-intl côté serveur.
 * Charge les messages JSON pour la locale demandée. Les locales non
 * entièrement traduites (ex. `ht`) retombent sur le français clé par clé :
 * aucune page ne casse si une chaîne manque.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale = isLocale(requested) ? requested : defaultLocale;

  const fr = (await import("../messages/fr.json")).default as Messages;
  const messages =
    locale === defaultLocale
      ? fr
      : mergeMessages(fr, (await import(`../messages/${locale}.json`)).default as Messages);

  return { locale, messages };
});
