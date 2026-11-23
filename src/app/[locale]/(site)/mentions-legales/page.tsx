import type { Metadata } from "next";

import EditablePageView from "@/components/content/editable-page-view";
import LegalHtNotice from "@/components/content/legal-ht-notice";
import { sanityFetch } from "@/lib/sanity/client";
import { initLocale, type LocaleParams } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { institutionalPageBySlugQuery } from "@/lib/sanity/queries";
import type { InstitutionalPage } from "@/lib/sanity/types";
import { buildMetadata } from "@/lib/seo";

// Rendu mis en cache et rafraîchi toutes les 60 s : les modifications du CMS apparaissent en une minute.
export const revalidate = 60;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await initLocale(params);
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

export default async function Page({ params }: LocaleParams) {
  const locale = await initLocale(params);
  const page = await sanityFetch<InstitutionalPage | null>(
    institutionalPageBySlugQuery,
    { slug: "mentions-legales", locale },
    null,
  );

  return (
    <>
      <LegalHtNotice locale={locale} />
      <EditablePageView page={page} locale={locale} />
    </>
  );
}
