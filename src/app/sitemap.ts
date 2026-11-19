import type { MetadataRoute } from "next";

import { locales, localizedPath } from "@/lib/i18n";
import { sanityFetch } from "@/lib/sanity/client";
import { eventListQuery, newsListQuery } from "@/lib/sanity/queries";
import type { EventListItem, NewsListItem } from "@/lib/sanity/types";
import { siteUrl } from "@/lib/seo";

// Perimetre reduit a 4 pages (voir next.config.ts pour les redirections des
// anciennes routes).
const staticPaths = ["/", "/axes-de-recherche"];

function buildUrl(path: string, locale: (typeof locales)[number]) {
  return new URL(localizedPath(path, locale), siteUrl).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localeParam = { locale: "fr" };
  const [news, events] = await Promise.all([
    sanityFetch<NewsListItem[]>(newsListQuery, localeParam, []),
    sanityFetch<EventListItem[]>(eventListQuery, localeParam, []),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  staticPaths.forEach((path) => {
    locales.forEach((locale) => {
      entries.push({ url: buildUrl(path, locale) });
    });
  });

  news.forEach((article) => {
    const frSlug = article.slugIntl?.fr?.current ?? article.slug.current;
    const enSlug = article.slugIntl?.en?.current ?? article.slug.current;
    entries.push({ url: buildUrl(`/actualites/${frSlug}`, "fr") });
    entries.push({ url: buildUrl(`/actualites/${enSlug}`, "en") });
  });

  events.forEach((event) => {
    const frSlug = event.slugIntl?.fr?.current ?? event.slug.current;
    const enSlug = event.slugIntl?.en?.current ?? event.slug.current;
    entries.push({ url: buildUrl(`/actualites/evenements/${frSlug}`, "fr") });
    entries.push({ url: buildUrl(`/actualites/evenements/${enSlug}`, "en") });
  });

  return entries;
}
