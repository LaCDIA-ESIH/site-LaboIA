import type { Metadata } from "next";

import EditablePageView from "@/components/content/editable-page-view";
import LegalHtNotice from "@/components/content/legal-ht-notice";
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
    { slug: "conditions-utilisation", locale },
    null,
  );

  return await buildMetadata({
    locale,
    title: page?.title,
    description: page?.summary,
    path: localizedPath("/conditions-utilisation", locale),
    alternates: {
      fr: localizedPath("/conditions-utilisation", "fr"),
      en: localizedPath("/conditions-utilisation", "en"),
      ht: localizedPath("/conditions-utilisation", "ht"),
    },
  });
}

export default async function Page() {
  const locale = await getServerLocale();
  const page = await sanityFetch<InstitutionalPage | null>(
    institutionalPageBySlugQuery,
    { slug: "conditions-utilisation", locale },
    null,
  );

  return (
    <>
      <LegalHtNotice locale={locale} />
      <EditablePageView page={page} locale={locale} />
    </>
  );
}
