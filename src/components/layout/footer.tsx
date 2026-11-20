import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import CookieSettingsLink from "@/components/layout/cookie-settings-link";
import { LaCDIAWordmark } from "@/components/brand/lacdia-wordmark";
import { EsihMark } from "@/components/brand/esih-mark";
import type { Locale } from "@/lib/i18n";
import type { Navigation, SiteSettings } from "@/lib/sanity/types";
import { localizeNavLabel, resolveNavItems } from "@/lib/nav";
import { sanityFetch } from "@/lib/sanity/client";
import { partnerListQuery } from "@/lib/sanity/queries";
import { localLogoFor } from "@/lib/partner-logos";
import type { PartnerListItem } from "@/lib/sanity/types";

const CONTACT_EMAIL = "contact.lacdia@esih.edu";

const heading = "mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#f3efe4]/55";
const link = "text-sm text-[#f3efe4]/80 transition-colors hover:text-white";

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
  const tBrand = await getTranslations({ locale, namespace: "brand" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const partners = (await sanityFetch<PartnerListItem[]>(partnerListQuery, { locale }, []))
    .map((p) => ({ name: p.name, website: p.website, logo: p.logo?.url ?? localLogoFor(p.name) }))
    .filter((p) => Boolean(p.logo));
  const year = new Date().getFullYear();
  const shortName = site.shortName ?? "LaCDIA";
  const copyrightText = (site.footerCopyrightText ?? `© {year} {shortName}. ${t("copyright")}`)
    .replace("{year}", String(year))
    .replace("{shortName}", shortName);

  const legalItems =
    nav.footerNav.length > 0
      ? nav.footerNav
      : [
          { label: t("legalNotice"), href: "/mentions-legales" },
          { label: t("privacy"), href: "/confidentialite" },
          { label: t("cookies"), href: "/cookies" },
          { label: t("terms"), href: "/conditions-utilisation" },
        ];

  return (
    <footer style={{ background: "var(--footer-ink)", color: "#f3efe4", fontFamily: "var(--font-body)" }}>
      {/* Filet tricolore discret (bleu / rouge) */}
      <div aria-hidden="true" className="flex h-1 w-full">
        <span className="flex-1" style={{ background: "var(--haiti-blue)" }} />
        <span className="flex-1" style={{ background: "var(--haiti-red)" }} />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Marque + institution porteuse */}
          <div className="lg:col-span-5">
            <LaCDIAWordmark size="md" tone="dark" descriptor={site.name ?? tBrand("descriptor")} />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#f3efe4]/75">
              {site.description ?? t("descriptionFallback")}
            </p>

            {partners.length > 0 && (
              <div className="mt-8 border-t border-[#f3efe4]/15 pt-6">
                <p className={heading} style={{ marginBottom: "0.9rem" }}>
                  {t("partners")}
                </p>
                <ul className="flex flex-wrap items-center gap-3">
                  {partners.map((p) => {
                    const img = (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.logo as string}
                        alt={p.name}
                        className="h-14 w-auto max-w-[8rem] object-contain"
                      />
                    );
                    return (
                      <li key={p.name} className="rounded-sm bg-[var(--paper)] p-2">
                        {p.website ? (
                          <a href={p.website} target="_blank" rel="noreferrer" aria-label={p.name}>
                            {img}
                          </a>
                        ) : (
                          img
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-8 border-t border-[#f3efe4]/15 pt-6">
              <p className={heading} style={{ marginBottom: "0.9rem" }}>
                {tBrand("carriedBy")}
              </p>
              <a href="https://esih.edu" target="_blank" rel="noreferrer" className="inline-block rounded-sm">
                <EsihMark tone="dark" height={44} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-7">
            <div>
              <div className={heading}>{t("navigation")}</div>
              <nav className="flex flex-col gap-2.5">
                {resolveNavItems(nav.mainNav).map((item) => (
                  <Link key={item.href} href={item.href} className={link}>
                    {localizeNavLabel(item.href, item.label, locale, tNav)}
                  </Link>
                ))}
              </nav>
            </div>

            <div>
              <div className={heading}>{t("legal")}</div>
              <nav className="flex flex-col gap-2.5">
                {legalItems.map((item) => (
                  <Link key={item.href} href={item.href} className={link}>
                    {item.label}
                  </Link>
                ))}
                <CookieSettingsLink label={t("manageCookies")} />
              </nav>
            </div>

            <div>
              <div className={heading}>{site.footerContactTitle ?? t("contact")}</div>
              <div className="flex flex-col gap-3 text-sm text-[#f3efe4]/75">
                {site.footerContactText && <p className="leading-relaxed">{site.footerContactText}</p>}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="break-all font-medium text-white underline decoration-[#f3efe4]/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  {CONTACT_EMAIL}
                </a>
                <address className="text-xs not-italic leading-relaxed">{t("address")}</address>
                <p className="text-xs leading-relaxed">{t("location")}</p>
                <p className="text-xs leading-relaxed">{t("responseTime")}</p>
                <div className="mt-2 flex items-center gap-3">
                  <a
                    href="https://www.linkedin.com/company/lacdia"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center border border-[#f3efe4]/25 text-[#f3efe4]/80 transition-colors hover:border-white hover:text-white"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#f3efe4]/15">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#f3efe4]/60">{copyrightText}</p>
          <p className="text-xs text-[#f3efe4]/60">{site.tagline ?? t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
