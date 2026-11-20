import type { Metadata } from "next";

import EditablePageView from "@/components/content/editable-page-view";
import { sanityFetch } from "@/lib/sanity/client";
import { getServerLocale } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { institutionalPageBySlugQuery } from "@/lib/sanity/queries";
import type { InstitutionalPage } from "@/lib/sanity/types";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const page = await sanityFetch<InstitutionalPage | null>(
    institutionalPageBySlugQuery,
    { slug: "mentions-legales", locale },
    null,
  );

  return await buildMetadata({
    locale,
    title: page?.title,
    description: page?.summary,
    path: localizedPath("/mentions-legales", locale),
    alternates: {
      fr: localizedPath("/mentions-legales", "fr"),
      en: localizedPath("/mentions-legales", "en"),
      ht: localizedPath("/mentions-legales", "ht"),
    },
  });
}

export default async function Page() {
  const locale = await getServerLocale();
  const page = await sanityFetch<InstitutionalPage | null>(
    institutionalPageBySlugQuery,
    { slug: "mentions-legales", locale },
    null,
  );

  return <EditablePageView page={page} locale={locale} />;
}
