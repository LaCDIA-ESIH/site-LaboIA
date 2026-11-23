import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/cms";
import { getSiteUrl, getSiteUrlObject } from "@/lib/site-url";
import { DEFAULT_OG_IMAGE } from "@/lib/seo";

// display "optional" : la police n'est utilisée que si elle est prête au premier affichage (elle est préchargée) ;
// sinon la police de secours reste, sans bascule en cours de lecture ni décalage de mise en page (CLS = 0).
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "optional" });
const heading = Fraunces({ variable: "--font-heading", subsets: ["latin"], style: ["normal", "italic"], display: "optional" });
// Police mono : étiquettes secondaires seulement, pas de préchargement (libère la bande passante du premier rendu).
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400","500"], display: "optional", preload: false });

type Messages = Record<string, unknown>;

// Seuls les espaces de noms lus par des composants client sont envoyés au navigateur
// (le reste est rendu côté serveur) : HTML et hydratation nettement plus légers.
const CLIENT_NAMESPACES = [
  "brand", "common", "header", "locale", "nav",
  "home.actualites", "home.highlights", "home.kpis", "home.partners", "home.team",
  "pages.contactTabs", "forms.newsletter", "forms.newsletterUnsubscribe",
  // Formulaires contact/collaborer : sans page aujourd'hui. À ajouter ici ("forms.contact",
  // "forms.collaborate") si les pages reviennent, sinon next-intl signale des messages manquants.
];

function clientMessages(all: Messages): Messages {
  const out: Messages = {};
  for (const path of CLIENT_NAMESPACES) {
    const keys = path.split(".");
    let src: unknown = all;
    for (const k of keys) src = (src as Messages | undefined)?.[k];
    if (src === undefined) continue;
    let dst = out;
    keys.slice(0, -1).forEach((k) => {
      dst = (dst[k] ??= {}) as Messages;
    });
    dst[keys[keys.length - 1]] = src;
  }
  return out;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const validLocale: Locale = isLocale(locale) ? locale : "fr";
  const site = await getSiteSettings(validLocale);
  return {
    metadataBase: getSiteUrlObject(),
    title: {
      default: site.name,
      template: `%s | ${site.shortName}`,
    },
    description: site.description,
    openGraph: {
      type: "website",
      title: site.name,
      description: site.description,
      siteName: site.shortName,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = clientMessages(await getMessages());
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "ResearchOrganization"],
    name: "LaCDIA — Laboratoire Caribéen des Sciences de Données et de l'Intelligence Artificielle",
    alternateName: "LaCDIA",
    url: siteUrl,
    logo: `${siteUrl}/logo/lacdia-mark.png`,
    foundingDate: "2025",
    email: "contact.lacdia@esih.edu",
    areaServed: ["HT", "Caribbean"],
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "École Supérieure d'Infotronique d'Haïti (ESIH)",
      url: "https://esih.edu",
    },
  };

  const fontClasses = [inter.variable, heading.variable, jetbrains.variable].join(" ");

  return (
    <html lang={locale} className={fontClasses}>
      <body className="antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
