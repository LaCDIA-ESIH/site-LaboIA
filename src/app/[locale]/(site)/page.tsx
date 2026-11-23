import Hero from "@/components/home/hero";
import Intro from "@/components/home/intro";
import Institution from "@/components/home/institution";
import Kpis from "@/components/home/kpis";
import Highlights from "@/components/home/highlights";
import GovernanceEthics from "@/components/home/governance-ethics";
import Team from "@/components/home/team";
import ActualitesSection from "@/components/home/actualites-section";
import Partners from "@/components/home/partners";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { initLocale, type LocaleParams } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { getHomeData, getSiteSettings } from "@/lib/cms";

// Rendu mis en cache et rafraîchi toutes les 60 s : les modifications du CMS apparaissent en une minute.
export const revalidate = 60;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await initLocale(params);
  return await buildMetadata({
    locale,
    path: localizedPath("/", locale),
    alternates: {
      fr: localizedPath("/", "fr"),
      en: localizedPath("/", "en"),
      ht: localizedPath("/", "ht"),
    },
  });
}

export default async function Home({ params }: LocaleParams) {
  const locale = await initLocale(params);
  const [, homeData] = await Promise.all([getSiteSettings(locale), getHomeData(locale)]);
  const { home, kpis, kpiSettings, allNews, featuredPartners } = homeData;

  const partners = featuredPartners.map((partner) => ({
    _id: partner._id,
    name: partner.name,
    type: partner.partnerType,
    shortDescription: partner.shortDescription,
    website: partner.website,
    tags: partner.tags,
    logo: partner.logo,
  }));

  return (
    <>
      <Hero
        badge={home.heroBadge}

        locale={locale}
        titleLine1={home.heroTitleLine1}
        titleLine2={home.heroTitleLine2}
        titleLine3={home.heroTitleLine3}
        titleLine4={home.heroTitleLine4}
      />
      <Intro
        locale={locale}
        visionTitle={home.introTitle}
        visionBody={home.introBody}
        missionItems={home.missionItems}
      />
      <Institution locale={locale} />
      <Highlights
        title={home.highlightsTitle}
        intro={home.highlightsIntro}
        items={home.highlights?.length ? home.highlights : undefined}
        axe1Title={home.axe1Title}
        axe1Description={home.axe1Description}
        axe1Keywords={home.axe1Keywords}
        axe1Objectives={home.axe1Objectives}
        axe2Title={home.axe2Title}
        axe2Description={home.axe2Description}
        axe2Keywords={home.axe2Keywords}
        axe2Objectives={home.axe2Objectives}
        poleTitle={home.poleTitle}
        poleDescription={home.poleDescription}
        poleSectors={home.poleSectors}
        poleNote={home.poleNote}
        ethicsTitle={home.ethicsTitle}
        ethicsText={home.ethicsText}
      />
      <GovernanceEthics locale={locale} />
      <Kpis title={home.kpisTitle} intro={home.kpisIntro} items={kpis} meta={kpiSettings} />
      <Team
        sectionLabel={home.teamSectionLabel}
        title={home.teamTitle}
        intro={home.teamIntro}
        note={home.teamNote}
        categories={home.teamCategories}
        stats={home.teamStats}
      />
      <ActualitesSection
        title={home.publicationsTitle}
        intro={home.publicationsIntro}
        items={allNews}
        locale={locale}
      />
      <Partners
        title={home.partnersTitle}
        intro={home.partnersIntro}
        badge={home.partnersBadge}
        items={partners}
      />
    </>
  );
}
