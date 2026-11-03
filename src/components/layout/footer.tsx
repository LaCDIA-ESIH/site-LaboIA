import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import CookieSettingsLink from "@/components/layout/cookie-settings-link";
import type { Locale } from "@/lib/i18n";
import type { Navigation, SiteSettings } from "@/lib/sanity/types";
import { resolveNavItems } from "@/lib/nav";

export default async function Footer({
  nav,
  site,
  locale = "fr",
}: {
  nav: Navigation;
  site: SiteSettings;
  locale?: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "footer" });
  const year = new Date().getFullYear();
  const logoSrc = site.logo?.url ?? "/logo/logo-site.svg";
  const logoAlt = site.logo?.alt ?? site.shortName ?? "LaCDIA";
  const shortName = site.shortName ?? "LaCDIA";
  const copyrightText = (site.footerCopyrightText ?? `© {year} {shortName}. ${t("copyright")}`)
    .replace("{year}", String(year))
    .replace("{shortName}", shortName);

  return (
    <footer
      className="relative bg-[#0a0f1c]"
      style={{ fontFamily: "var(--font-body, sans-serif)" }}
    >
      {/* — Accent divider */}
      <div
        aria-hidden="true"
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,212,170,0.5) 30%, rgba(108,99,255,0.5) 70%, transparent 100%)",
        }}
      />

      {/* — Main footer grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">

          {/* — LABO column */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="relative h-11 w-11 shrink-0 rounded-xl border border-white/10 bg-white/[0.03] p-1.5">
                <Image
                  src={logoSrc}
                  alt={logoAlt}
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <div
                  className="text-base font-bold text-[#f0f4ff] tracking-tight"
                  style={{ fontFamily: "var(--font-syne, sans-serif)" }}
                >
                  {site.shortName ?? "LaCDIA"}
                  <span
                    className="ml-2 text-[10px] font-normal text-[#8892b0] tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
                  >
                    LABO
                  </span>
                </div>
                <div className="text-xs text-[#8892b0] mt-0.5 leading-snug max-w-[16rem]">
                  {site.name ?? t("nameFallback")}
                </div>
              </div>
            </div>

            <p className="text-sm text-[#8892b0] leading-relaxed max-w-sm">
              {site.description ?? t("descriptionFallback")}
            </p>

            {/* Réseaux sociaux */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/lacdia"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8892b0] transition-all hover:border-[#00d4aa]/40 hover:text-[#00d4aa] hover:shadow-[0_0_0_1px_rgba(0,212,170,0.2)]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a
                href="https://www.researchgate.net"
                target="_blank"
                rel="noreferrer"
                aria-label="ResearchGate"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8892b0] transition-all hover:border-[#00d4aa]/40 hover:text-[#00d4aa] hover:shadow-[0_0_0_1px_rgba(0,212,170,0.2)]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.586 0H4.414A4.414 4.414 0 000 4.414v15.172A4.414 4.414 0 004.414 24h15.172A4.414 4.414 0 0024 19.586V4.414A4.414 4.414 0 0019.586 0zM11.67 17.35h-1.81v-5.04H8.23v5.04H6.42V6.65h1.81v4.01h1.63V6.65h1.81v10.7zm5.35 0c-1.76 0-3.12-1.12-3.12-3.08v-4.54c0-1.96 1.36-3.08 3.12-3.08 1.77 0 3.13 1.12 3.13 3.08v1.28h-1.72v-1.28c0-.84-.54-1.38-1.41-1.38-.87 0-1.41.54-1.41 1.38v4.54c0 .84.54 1.38 1.41 1.38.87 0 1.41-.54 1.41-1.38v-1.73h-1.41v-1.7h3.13v3.43c0 1.96-1.36 3.08-3.13 3.08z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* — Navigation + Legal + Contact */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div
                className="text-[10px] font-medium text-[#8892b0] tracking-widest uppercase mb-4"
                style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
              >
                {t("navigation")}
              </div>
              <nav className="flex flex-col gap-2.5">
                {resolveNavItems(nav.mainNav).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-[#8892b0] hover:text-[#f0f4ff] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <div
                className="text-[10px] font-medium text-[#8892b0] tracking-widest uppercase mb-4"
                style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
              >
                {t("legal")}
              </div>
              <nav className="flex flex-col gap-2.5">
                {(nav.footerNav.length > 0
                  ? nav.footerNav
                  : [
                      { label: t("legalNotice"), href: "/mentions-legales" },
                      { label: t("privacy"), href: "/confidentialite" },
                      { label: t("cookies"), href: "/cookies" },
                      { label: t("terms"), href: "/conditions-utilisation" },
                    ]
                ).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm text-[#8892b0] hover:text-[#f0f4ff] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <CookieSettingsLink label={t("manageCookies")} />
              </nav>
            </div>

            <div className="glass-labo-hover rounded-xl p-4 sm:col-span-1 col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4aa" strokeWidth="1.6" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div
                  className="text-[10px] font-medium text-[#8892b0] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
                >
                  {site.footerContactTitle ?? t("contact")}
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-[#8892b0]">
                {site.footerContactText && (
                  <p className="leading-relaxed">{site.footerContactText}</p>
                )}
                <Link
                  href={site.footerContactCtaHref ?? "/contact"}
                  className="inline-flex items-center gap-1.5 font-medium text-[#f0f4ff] transition-colors hover:text-[#00d4aa] group/link"
                >
                  {site.footerContactCtaLabel ?? t("contactCtaLabel")}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-transform group-hover/link:translate-x-0.5"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* — Bottom bar */}
      <div className="border-t border-white/6">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p
            className="text-xs text-[#8892b0]/60"
            style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
          >
            {copyrightText}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00d4aa] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00d4aa]" />
            </span>
            <span
              className="text-xs text-[#8892b0]/60"
              style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
            >
              {site.tagline ?? t("tagline")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
