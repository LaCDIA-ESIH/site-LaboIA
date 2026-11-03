import { getTranslations } from "next-intl/server";

import type { Locale } from "@/lib/i18n";
import { isSanityConfigured, sanityFetch } from "@/lib/sanity/client";
import {
  formSettingsQuery,
  homePageQuery,
  kpiListQuery,
  kpiSettingsQuery,
  latestNewsForBlockQuery,
  navigationQuery,
  newsListQuery,
  partnerListQuery,
  siteSettingsQuery,
  solutionsPageQuery,
} from "@/lib/sanity/queries";
import type {
  FormSettings,
  HomePageData,
  KpiItem,
  KpiSettings,
  Navigation,
  NewsListItem,
  PartnerListItem,
  SiteSettings,
  SolutionsPage,
} from "@/lib/sanity/types";

type HomeDataBundle = {
  home: HomePageData;
  kpis: KpiItem[];
  kpiSettings: KpiSettings;
  allNews: NewsListItem[];
  featuredPartners: PartnerListItem[];
};

const emptySiteSettings: SiteSettings = {
  _id: "siteSettings-empty",
  name: "",
  shortName: "",
};

const emptyNavigation: Navigation = {
  _id: "navigation-empty",
  mainNav: [],
  footerNav: [],
};

const emptyHome: HomePageData = { _id: "homePage-empty" };
const emptySolutionsPage: SolutionsPage = { _id: "solutionsPage-empty" };

export async function getSiteSettings(locale: Locale): Promise<SiteSettings> {
  if (!isSanityConfigured) return emptySiteSettings;
  const site = (await sanityFetch<SiteSettings | null>(siteSettingsQuery, { locale }, null)) ?? emptySiteSettings;
  if (site.description) return site;
  // Pas de description dans cette langue côté CMS : repli traduit (next-intl)
  // plutôt que d'afficher le texte français sur /en.
  const t = await getTranslations({ locale, namespace: "footer" });
  return { ...site, description: t("descriptionFallback") };
}

export async function getNavigation(locale: Locale): Promise<Navigation> {
  if (!isSanityConfigured) return emptyNavigation;
  return sanityFetch<Navigation | null>(navigationQuery, { locale }, null).then(
    (nav) => nav ?? emptyNavigation,
  );
}

export async function getHomeData(locale: Locale): Promise<HomeDataBundle> {
  if (!isSanityConfigured) {
    return {
      home: emptyHome,
      kpis: [],
      kpiSettings: { _id: "kpiSettings-empty" },
      allNews: [],
      featuredPartners: [],
    };
  }

  const [home, kpis, kpiSettings, news, partners] = await Promise.all([
    sanityFetch<HomePageData | null>(homePageQuery, { locale }, null),
    sanityFetch<KpiItem[]>(kpiListQuery, { locale }, []),
    sanityFetch<KpiSettings | null>(kpiSettingsQuery, { locale }, null),
    sanityFetch<NewsListItem[]>(newsListQuery, { locale }, []),
    sanityFetch<PartnerListItem[]>(partnerListQuery, { locale }, []),
  ]);

  return {
    home: home ?? emptyHome,
    kpis,
    kpiSettings: kpiSettings ?? { _id: "kpiSettings-empty" },
    allNews: news,
    featuredPartners: partners.filter((p) => p.featured),
  };
}

export async function getLatestNews(locale: Locale, limit: number): Promise<NewsListItem[]> {
  if (!isSanityConfigured) return [];
  return sanityFetch<NewsListItem[]>(latestNewsForBlockQuery, { locale, limit }, []);
}

export async function getSolutionsPageData(locale: Locale): Promise<SolutionsPage> {
  if (!isSanityConfigured) return emptySolutionsPage;
  const page = await sanityFetch<SolutionsPage | null>(solutionsPageQuery, { locale }, null);
  return page ?? emptySolutionsPage;
}

export async function getFormSettings(locale: Locale): Promise<FormSettings | null> {
  if (!isSanityConfigured) return null;
  return sanityFetch<FormSettings | null>(formSettingsQuery, { locale }, null);
}
