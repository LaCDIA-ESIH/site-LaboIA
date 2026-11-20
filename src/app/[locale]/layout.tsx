import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { locales, type Locale, isLocale } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/cms";
import { getSiteUrlObject } from "@/lib/site-url";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const heading = Fraunces({ variable: "--font-heading", subsets: ["latin"], style: ["normal", "italic"], display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], weight: ["400","500"], display: "swap" });

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
  const banner = site.banner;
  const bannerImage = banner?.url
    ? [
        {
          url: banner.url,
          width: banner.width,
          height: banner.height,
          alt: banner.alt ?? site.name,
        },
      ]
    : undefined;

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
      images: bannerImage,
    },
    twitter: {
      card: "summary_large_image",
      title: site.name,
      description: site.description,
      images: banner?.url ? [banner.url] : undefined,
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

  const messages = await getMessages();

  const fontClasses = [inter.variable, heading.variable, jetbrains.variable].join(" ");

  return (
    <html lang={locale} className={fontClasses}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
