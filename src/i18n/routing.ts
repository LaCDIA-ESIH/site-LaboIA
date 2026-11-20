import { defineRouting } from "next-intl/routing";
import { locales, defaultLocale } from "@/lib/i18n";

/**
 * Configuration du routage i18n.
 * Utilisé par le middleware et les composants de navigation.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  // Toutes les locales sont préfixées dans l'URL
  // /fr = français, /en = english, /ht = kreyòl ayisyen
  // La racine / redirige automatiquement vers /fr
  localePrefix: "always",
});
