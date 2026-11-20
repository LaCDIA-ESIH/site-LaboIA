import { notFound } from 'next/navigation';
import { sanityFetch } from '@/lib/sanity/client';
import { genericPageBySlugQuery } from '@/lib/sanity/queries';
import { PageBuilder } from '@/components/page-builder';
import { setRequestLocale } from 'next-intl/server';
import type { SeoData } from '@/lib/sanity/types';
import { buildMetadata } from '@/lib/seo';
import { getLatestNews } from '@/lib/cms';
import { isLocale } from '@/lib/i18n';

export const dynamic = "force-dynamic";

type GenericPageData = {
  title?: string;
  slug?: { current?: string };
  seo?: SeoData;
  blocks?: unknown[];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const slugStr = resolvedParams.slug.join('/');

  const page = await sanityFetch<GenericPageData | null>(
    genericPageBySlugQuery,
    { slug: slugStr, locale },
    null
  );

  if (!page) return {};

  return buildMetadata({
    locale: isLocale(locale) ? locale : "fr",
    title: page.title,
    seo: page.seo,
  });
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>
}) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  setRequestLocale(locale);
  const slugStr = resolvedParams.slug.join('/');
  
  // Intercept predefined routes or Next.js reserved chunks 
  // It's a catch-all, but we don't want it taking over /studio or other API routes
  if (resolvedParams.slug[0] === 'studio' || resolvedParams.slug[0] === 'api') {
    notFound();
  }

  const page = await sanityFetch<GenericPageData | null>(
    genericPageBySlugQuery,
    { slug: slugStr, locale },
    null
  );

  if (!page) {
    notFound();
  }

  const blocks = page.blocks ?? [];
  const newsBlocks = blocks.filter(
    (block): block is { _type: string; limit?: number } =>
      typeof block === "object" && block !== null && (block as { _type?: unknown })._type === "latestNewsBlock",
  );
  const newsItems = newsBlocks.length > 0
    ? await getLatestNews(isLocale(locale) ? locale : "fr", Math.max(...newsBlocks.map((b) => b.limit || 3)))
    : [];

  return (
    <main className="flex-1 w-full">
      <PageBuilder blocks={blocks} locale={locale} newsItems={newsItems} />
    </main>
  );
}
