import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

/**
 * Proxy i18n — Gestion du routage multi-langues
 *
 * Langues supportées : FR (défaut), EN, HT (créole haïtien)
 *
 * Comportement :
 * - / → redirige vers /fr (localePrefix: "always")
 * - /fr/... → contenu en français
 * - /en/... → contenu en anglais
 * - /ht/... → contenu en créole haïtien (repli sur le français pour le contenu CMS non traduit)
 */
export default createMiddleware(routing);

export const config = {
  matcher: [
    "/",
    "/(fr|en|ht)/:path*",
    "/((?!api|studio|_next|_vercel|.*\\..*|favicon\\.ico|robots\\.txt|sitemap\\.xml).*)",
  ],
};
