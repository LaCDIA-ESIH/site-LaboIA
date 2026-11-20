import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/cms";
import { locales, type Locale, localizedPath, stripLocaleFromPath } from "@/lib/i18n";
import type { SeoData } from "@/lib/sanity/types";
import { getSiteUrl } from "@/lib/site-url";

export const siteUrl = getSiteUrl();

type MetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  locale: Locale;
  alternates?: Partial<Record<Locale, string>>;
  seo?: SeoData;
};

export async function buildMetadata({
  title,
  description,
  path,
  alternates,
  locale,
  seo,
}: MetadataInput): Promise<Metadata> {
  const site = await getSiteSettings(locale);
  const resolvedTitle = seo?.title ?? title;
  const resolvedDescription = seo?.description ?? description ?? site.description;
  const fullTitle = resolvedTitle ? `${resolvedTitle} | ${site.shortName}` : site.name;
  const url = seo?.canonicalUrl ?? (path ? new URL(path, siteUrl).toString() : siteUrl);
  const banner = site.banner;
  const ogTitle = seo?.openGraphTitle ? `${seo.openGraphTitle} | ${site.shortName}` : fullTitle;
  const ogDescription = seo?.openGraphDescription ?? resolvedDescription;
  const ogImage = seo?.openGraphImageUrl
    ? {
        url: seo.openGraphImageUrl,
        width: seo.openGraphImageWidth,
        height: seo.openGraphImageHeight,
        alt: seo.openGraphImageAlt ?? resolvedTitle ?? site.name,
      }
    : banner?.url
      ? {
          url: banner.url,
          width: banner.width,
          height: banner.height,
          alt: banner.alt ?? site.name,
        }
      : null;

  const metadata: Metadata = {
    // `absolute` : le gabarit du layout ajouterait sinon un second « | LaCDIA ».
    title: { absolute: fullTitle },
    description: resolvedDescription,
    keywords: seo?.keywords,
    robots:
      seo?.noIndex || seo?.noFollow
        ? {
            index: !seo?.noIndex,
            follow: !seo?.noFollow,
          }
        : undefined,
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      siteName: site.shortName,
      url,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage?.url ? [ogImage.url] : undefined,
    },
  };

  const fallbackAlternates = path
    ? Object.fromEntries(
        locales.map((candidateLocale) => [candidateLocale, localizedPath(stripLocaleFromPath(path), candidateLocale)]),
      )
    : undefined;

  const resolvedAlternates = {
    ...(fallbackAlternates ?? {}),
    ...(alternates ?? {}),
  } as Partial<Record<Locale, string>>;

  if (Object.values(resolvedAlternates).some(Boolean)) {
    metadata.alternates = {
      languages: {
        ...Object.fromEntries(
          locales.flatMap((l) => (resolvedAlternates[l] ? [[l, resolvedAlternates[l] as string]] : [])),
        ),
      },
    };
  }

  return metadata;
}
