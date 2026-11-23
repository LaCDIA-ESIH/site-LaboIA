import type { MetadataRoute } from "next";

import { locales, localizedPath, type Locale } from "@/lib/i18n";
import { sanityFetch } from "@/lib/sanity/client";
import { eventListQuery, newsListQuery } from "@/lib/sanity/queries";
import type { EventListItem, NewsListItem } from "@/lib/sanity/types";
import { siteUrl } from "@/lib/seo";

// Régénéré toutes les heures : un nouvel article apparaît sans redéploiement.
export const revalidate = 3600;

// Pages indexables. /newsletter (désinscription) est volontairement absente : page utilitaire.
const staticPaths = [
  "/",
  "/axes-de-recherche",
  "/mentions-legales",
  "/confidentialite",
  "/conditions-utilisation",
  "/cookies",
];

function buildUrl(path: string, locale: Locale) {
  return new URL(localizedPath(path, locale), siteUrl).toString();
}

/** Une entrée par langue, chacune déclarant ses équivalents (hreflang). */
function entriesFor(
  pathByLocale: Record<Locale, string>,
  lastModified?: string,
): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    locales.map((l) => [l, buildUrl(pathByLocale[l], l)]),
  ) as Record<Locale, string>;
  return locales.map((l) => ({
    url: languages[l],
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localeParam = { locale: "fr" };
  const [news, events] = await Promise.all([
    sanityFetch<NewsListItem[]>(newsListQuery, localeParam, []),
    sanityFetch<EventListItem[]>(eventListQuery, localeParam, []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  staticPaths.forEach((path) => {
    entries.push(...entriesFor({ fr: path, en: path, ht: path }));
  });

  news.forEach((article) => {
    const fr = article.slugIntl?.fr?.current ?? article.slug.current;
    const en = article.slugIntl?.en?.current ?? article.slug.current;
    entries.push(
      ...entriesFor({
        fr: `/actualites/${fr}`,
        en: `/actualites/${en}`,
        ht: `/actualites/${fr}`,
      }),
    );
  });

  events.forEach((event) => {
    const fr = event.slugIntl?.fr?.current ?? event.slug.current;
    const en = event.slugIntl?.en?.current ?? event.slug.current;
    entries.push(
      ...entriesFor({
        fr: `/actualites/evenements/${fr}`,
        en: `/actualites/evenements/${en}`,
        ht: `/actualites/evenements/${fr}`,
      }),
    );
  });

  return entries;
}
