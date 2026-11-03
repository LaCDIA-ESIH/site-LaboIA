import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { REMOVED_NAV_TREES } from "./src/lib/nav";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Origine du Matomo configuré (auto-hébergé ou cloud) : ajoutée à la CSP pour
// que les statistiques continuent de fonctionner une fois la politique bloquante.
const matomoOrigin = (() => {
  try {
    return process.env.NEXT_PUBLIC_MATOMO_URL ? new URL(process.env.NEXT_PUBLIC_MATOMO_URL).origin : "";
  } catch {
    return "";
  }
})();

const analyticsSources = [
  "https://www.googletagmanager.com",
  "https://*.google-analytics.com",
  "https://*.analytics.google.com",
  "https://*.matomo.cloud",
  matomoOrigin,
]
  .filter(Boolean)
  .join(" ");

// CSP bloquante pour le site public. 'unsafe-inline' reste nécessaire pour les
// scripts/styles inline de Next.js (pas de nonce) ; 'unsafe-eval' est retiré.
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  `script-src 'self' 'unsafe-inline' ${analyticsSources}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://cdn.sanity.io ${analyticsSources}`,
  "font-src 'self' data:",
  `connect-src 'self' https://*.sanity.io ${analyticsSources}`,
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        // /studio (Sanity Studio) a besoin de workers blob:, websockets, etc. :
        // il est exclu de la politique du site public.
        source: "/((?!studio).*)",
        headers: [{ key: "Content-Security-Policy", value: contentSecurityPolicy }],
      },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    // Le site est volontairement reduit a 4 pages de navigation : Accueil,
    // Solutions, Actualites (integree a la home), Contact — plus la route
    // utilitaire /newsletter (desinscription, non presente dans le menu).
    // Tout le reste a ete retire du code (pas seulement masque) — voir git
    // log pour retrouver ces pages si elles doivent revenir plus tard.
    // Ces redirections couvrent
    // les liens externes/marque-pages/anciens resultats de recherche et
    // tout contenu CMS pas encore resynchronise avec le nouveau perimetre.
    // Liste partagée avec Header/Footer (src/lib/nav.ts) — un item de nav
    // Sanity vers l'une de ces arborescences est filtré côté affichage ET
    // redirigé côté serveur depuis la même source de vérité.
    // "newsletter" n'y figure pas : /newsletter est une route dédiée active
    // (désinscription newsletter, compliance-sensible — voir audit
    // pré-production COMP-1). Ne pas la réintroduire ici.
    const removedTrees = REMOVED_NAV_TREES;

    const homeRedirects = removedTrees.flatMap((tree) => [
      { source: `/${tree}`, destination: "/fr", permanent: false },
      { source: `/${tree}/:path*`, destination: "/fr", permanent: false },
      { source: `/fr/${tree}`, destination: "/fr", permanent: false },
      { source: `/fr/${tree}/:path*`, destination: "/fr", permanent: false },
      { source: `/en/${tree}`, destination: "/en", permanent: false },
      { source: `/en/${tree}/:path*`, destination: "/en", permanent: false },
    ]);

    return [
      { source: "/", destination: "/fr", permanent: false },
      // /solutions renommé en /axes-de-recherche
      { source: "/solutions", destination: "/fr/axes-de-recherche", permanent: true },
      { source: "/fr/solutions", destination: "/fr/axes-de-recherche", permanent: true },
      { source: "/en/solutions", destination: "/en/axes-de-recherche", permanent: true },
      // Actualites : listing uniquement — /actualites/[slug] et
      // /actualites/evenements/[slug] restent des pages actives, donc
      // pas de wildcard ici (contrairement aux autres arborescences).
      { source: "/actualites", destination: "/fr", permanent: false },
      { source: "/fr/actualites", destination: "/fr", permanent: false },
      { source: "/en/actualites", destination: "/en", permanent: false },
      ...homeRedirects,
      // Collaborer : plus de page dediee, tout passe par l'onglet
      // "Proposer une collaboration" sur /contact.
      { source: "/collaborer", destination: "/fr/contact?tab=collaborate", permanent: false },
      { source: "/collaborer/:path*", destination: "/fr/contact?tab=collaborate", permanent: false },
      { source: "/fr/collaborer", destination: "/fr/contact?tab=collaborate", permanent: false },
      { source: "/fr/collaborer/:path*", destination: "/fr/contact?tab=collaborate", permanent: false },
      { source: "/en/collaborer", destination: "/en/contact?tab=collaborate", permanent: false },
      { source: "/en/collaborer/:path*", destination: "/en/contact?tab=collaborate", permanent: false },
    ];
  },
  transpilePackages: ["sanity", "@sanity/ui", "@sanity/icons"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
