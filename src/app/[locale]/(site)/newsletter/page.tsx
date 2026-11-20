import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import NewsletterUnsubscribeForm from "@/components/forms/newsletter-unsubscribe-form";
import { getFormSettings } from "@/lib/cms";
import { getServerLocale } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";

// Route dédiée, indépendante du renderer de page générique Sanity : la
// désinscription newsletter doit rester accessible même si aucun éditeur
// n'a configuré de page CMS pour /newsletter (voir audit pré-production,
// constat COMP-1). Ne pas ajouter "newsletter" à la liste des redirections
// dans next.config.ts sans revalider ce point.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = await getTranslations({ locale, namespace: "pages.newsletter" });

  return await buildMetadata({
    locale,
    title: t("unsubscribeTitle"),
    description: t("unsubscribeIntro"),
    path: localizedPath("/newsletter", locale),
    alternates: {
      fr: localizedPath("/newsletter", "fr"),
      en: localizedPath("/newsletter", "en"),
      ht: localizedPath("/newsletter", "ht"),
    },
    seo: { noIndex: true },
  });
}

export default async function Page() {
  const locale = await getServerLocale();
  const t = await getTranslations({ locale, namespace: "pages.newsletter" });
  const forms = await getFormSettings(locale);

  return (
    <section className="container" style={{ maxWidth: "40rem", paddingTop: "8rem", paddingBottom: "5rem" }}>
      <h1 className="section-title">{t("unsubscribeTitle")}</h1>
      <p className="section-subtitle" style={{ marginTop: "0.75rem" }}>
        {t("unsubscribeIntro")}
      </p>
      <div style={{ marginTop: "2rem" }}>
        <NewsletterUnsubscribeForm copy={forms?.unsubscribe} locale={locale} />
      </div>
    </section>
  );
}
