import { getLocale, setRequestLocale } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

export async function getServerLocale(): Promise<Locale> {
  try {
    const locale = await getLocale();
    if (isLocale(locale)) return locale;
  } catch {
    // Fallback if called outside of next-intl context
  }
  return defaultLocale;
}

export type LocaleParams = { params: Promise<{ locale: string }> };

/**
 * Fixe la langue de la requête à partir des paramètres de route : sans cela,
 * next-intl lit les en-têtes de la requête et la page ne peut plus être mise
 * en cache (rendu à chaque visite).
 */
export async function initLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : defaultLocale;
  setRequestLocale(resolved);
  return resolved;
}
