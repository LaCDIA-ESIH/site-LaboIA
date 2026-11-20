import type { PortableTextBlock } from "@portabletext/types";

export type SanitySlug = {
  current: string;
};

export type LocalizedSlug = {
  fr?: SanitySlug;
  en?: SanitySlug;
  ht?: SanitySlug;
};

export type SanityImage = {
  _type: "image";
  asset?: { _ref: string; _type?: "reference" };
} & Record<string, unknown>;

export type SeoData = {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  openGraphImageUrl?: string;
  openGraphImageAlt?: string;
  openGraphImageWidth?: number;
  openGraphImageHeight?: number;
  noIndex?: boolean;
  noFollow?: boolean;
};

export type PageCard = {
  _key?: string;
  icon?: string;
  title?: string;
  description?: string;
  label?: string;
  href?: string;
  items?: string[];
};

export type PageSection = {
  _key?: string;
  _type: "pageSection";
  variant?: "heroDark" | "white" | "light" | "ctaDark";
  layout?: "content" | "cards" | "pills" | "table" | "form";
  anchor?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  body?: PortableTextBlock[];
  actions?: Array<{ label?: string; href?: string; variant?: string }>;
  cards?: PageCard[];
  tableHeaders?: string[];
  tableRows?: Array<{ cells?: string[] }>;
  formType?: "contact" | "collaborate" | "newsletter" | "unsubscribe";
};

export type ProjectListItem = {
  _id: string;
  title: string;
  slug: SanitySlug;
  slugIntl?: LocalizedSlug;
  projectType?: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  shortDescription?: string;
  statusLabel?: string;
  tags?: string[];
  featured?: boolean;
};

export type KpiItem = {
  _id: string;
  key: string;
  label: string;
  value: string;
  note?: string;
  status: "draft" | "confirmed";
};

export type NewsListItem = {
  _id: string;
  title: string;
  slug: SanitySlug;
  slugIntl?: LocalizedSlug;
  date?: string;
  // Clé interne non localisée (utilisée pour le mapping de couleur des
  // badges) — categoryLabel est le libellé localisé à afficher, retombe
  // sur `category` si aucune traduction n'a été saisie côté éditeur.
  category?: string;
  categoryLabel?: string;
  summary?: string;
  mainImageUrl?: string;
  mainImageAlt?: string;
  sourceUrl?: string;
  featured?: boolean;
};

export type EventListItem = {
  _id: string;
  title: string;
  slug: SanitySlug;
  slugIntl?: LocalizedSlug;
  eventType?: string;
  startDate?: string;
  location?: string;
  summary?: string;
};

export type PartnerListItem = {
  _id: string;
  name: string;
  slug: SanitySlug;
  slugIntl?: LocalizedSlug;
  partnerType?: string;
  shortDescription?: string;
  website?: string;
  tags?: string[];
  featured?: boolean;
  logo?: SiteAsset | null;
};

export type InstitutionalPage = {
  _id: string;
  title: string;
  slug: SanitySlug;
  slugIntl?: LocalizedSlug;
  heroBadge?: string;
  summary?: string;
  content?: PortableTextBlock[];
  sections?: PageSection[];
  ctaLabel?: string;
  ctaHref?: string;
  seo?: SeoData;
};

export type Person = {
  _id: string;
  name: string;
  slug?: SanitySlug;
  photo?: SanityImage;
  roleTitle?: string;
  roleCategory?: string;
  shortBio?: string;
  longBio?: string;
  affiliation?: string;
  teamGroup?: "research" | "associate";
  expertise?: string[];
  links?: {
    email?: string;
    linkedin?: string;
    scholar?: string;
    orcid?: string;
    website?: string;
  };
  contribution?: string;
  order?: number;
};

export type TeamPage = {
  _id: string;
  title: string;
  slug: SanitySlug;
  intro?: PortableTextBlock[];
  researchSectionTitle?: string;
  associatesSectionTitle?: string;
  readMoreLabel?: string;
  associateBadgeLabel?: string;
  emptyResearchText?: string;
  emptyAssociatesText?: string;
};

export type SiteAsset = {
  url: string | null;
  alt?: string;
  width?: number;
  height?: number;
};

export type SiteSettings = {
  _id: string;
  name: string;
  shortName: string;
  description?: string;
  tagline?: string;
  footerContactTitle?: string;
  footerContactText?: string;
  footerContactCtaLabel?: string;
  footerContactCtaHref?: string;
  footerCopyrightText?: string;
  cookieTitle?: string;
  cookieMessage?: string;
  cookiePolicyLabel?: string;
  cookiePolicyHref?: string;
  cookieAcceptLabel?: string;
  cookieRejectLabel?: string;
  logo?: SiteAsset;
  banner?: SiteAsset;
};

export type NavItem = {
  label: string;
  href: string;
};

export type Navigation = {
  _id: string;
  mainNav: NavItem[];
  footerNav: NavItem[];
};

export type HomePageData = {
  _id: string;
  seo?: SeoData;
  heroBadge?: string;
  heroSubtitle?: string;
  // Override optionnel des 4 lignes du titre du hero — si absent, le
  // composant Hero retombe sur son texte de design par défaut (next-intl
  // home.hero.titleLine1..4). Voir src/components/home/hero.tsx.
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroTitleLine3?: string;
  heroTitleLine4?: string;
  heroActions?: Array<{ label: string; href: string; variant?: string }>;
  introEyebrow?: string;
  introTitle?: string;
  introBody?: string;
  introActions?: Array<{ label: string; href: string; variant?: string }>;
  missionItems?: Array<{ text: string }>;
  highlightsTitle?: string;
  highlightsIntro?: string;
  highlights?: Array<{ title: string; description: string }>;
  // Architecture scientifique (Option A)
  axe1Title?: string;
  axe1Description?: string;
  axe1Keywords?: string;   // "A · B · C" — split on " · " in component
  axe1Objectives?: string; // "A · B · C" — split on "·" in component
  axe2Title?: string;
  axe2Description?: string;
  axe2Keywords?: string;
  axe2Objectives?: string;
  poleTitle?: string;
  poleDescription?: string;
  poleSectors?: string;    // "A · B · C"
  poleNote?: string;
  ethicsTitle?: string;
  ethicsText?: string;
  kpisTitle?: string;
  kpisIntro?: string;
  teamSectionLabel?: string;
  teamTitle?: string;
  teamIntro?: string;
  teamNote?: string;
  teamCategories?: Array<{ badge: string; title: string; description: string; linkLabel?: string; linkHref?: string }>;
  teamStats?: Array<{ value: string; label: string }>;
  publicationsTitle?: string;
  publicationsIntro?: string;
  partnersTitle?: string;
  partnersIntro?: string;
  partnersBadge?: string;
  collaborateTitle?: string;
  collaborateBody?: string;
  collaborateActions?: Array<{ label: string; href: string; variant?: string }>;
};

export type KpiSettings = {
  _id: string;
  lastUpdated?: string;
  disclaimer?: string;
};

export type AiSolution = {
  _id: string;
  title: string;
  shortDescription?: string;
  benefits?: string[];
  examples?: string[];
  icon?: string;
  order?: number;
};

export type UseCase = {
  _id: string;
  title: string;
  context?: string;
  solution?: string;
  benefits?: string[];
  order?: number;
};

export type Sector = {
  _id: string;
  name: string;
  icon?: string;
  order?: number;
};

export type SolutionsPage = {
  _id: string;
  seo?: SeoData;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroPrimaryCta?: { label: string; href: string; variant?: string };
  heroSecondaryCta?: { label: string; href: string; variant?: string };
  approachTitle?: string;
  approachIntro?: string;
  approachSteps?: Array<{ title: string; description: string }>;
  solutionsTitle?: string;
  solutionsIntro?: string;
  solutions?: AiSolution[];
  useCasesTitle?: string;
  useCasesIntro?: string;
  featuredUseCase?: UseCase | null;
  flowTitle?: string;
  flowDescription?: string;
  flowSteps?: string[];
  servicesTitle?: string;
  servicesIntro?: string;
  services?: string[];
  sectorsTitle?: string;
  sectorsIntro?: string;
  sectors?: Sector[];
  projectsTitle?: string;
  projectsIntro?: string;
};

export type FormCopy = {
  title?: string;
  subtitle?: string;
  fullNameLabel?: string;
  fullNamePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  organizationLabel?: string;
  organizationPlaceholder?: string;
  subjectLabel?: string;
  subjectPlaceholder?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  consentText?: string;
  privacyLabel?: string;
  privacyHref?: string;
  submitLabel?: string;
  loadingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
};

export type FormSettings = {
  _id: string;
  contact?: FormCopy;
  collaborate?: FormCopy;
  newsletter?: FormCopy;
  unsubscribe?: FormCopy;
};
