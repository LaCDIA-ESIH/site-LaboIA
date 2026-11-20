"use client";

import { LaCDIAWordmark } from "@/components/brand/lacdia-wordmark";
import { EsihMark } from "@/components/brand/esih-mark";
import { Link, usePathname } from "@/i18n/navigation";
import { useMemo, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

import LocaleSwitcher from "@/components/layout/locale-switcher";
import type { Navigation, SiteSettings } from "@/lib/sanity/types";
import { localizeNavLabel, resolveNavItems } from "@/lib/nav";

function isActivePath(current: string, href: string) {
  if (href === "/") return current === "/";
  return current === href || current.startsWith(`${href}/`);
}

export default function Header({
  nav,
  site,
}: {
  nav: Navigation;
  site: SiteSettings;
}) {
  const t = useTranslations("header");
  const tBrand = useTranslations("brand");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const basePath = usePathname() || "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navItems = useMemo(() => {
    // resolveNavItems filtre les arborescences retirées et remappe les
    // anciennes URLs renommées ("/solutions" -> "/axes-de-recherche",
    // "/actualites" -> ancre "/#actualites") — voir src/lib/nav.ts. Tout
    // item Sanity restant (y compris une nouvelle genericPage ajoutée
    // depuis le Studio) s'affiche automatiquement, sans allowlist figée.
    return resolveNavItems(nav.mainNav).map((item) => {
      const pathOnly = item.href.split("#")[0] || "/";
      return {
        ...item,
        label: localizeNavLabel(item.href, item.label, locale, tNav),
        active: isActivePath(basePath, pathOnly),
      };
    });
  }, [basePath, nav.mainNav, locale, tNav]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-[var(--paper)]/95 backdrop-blur-md border-[var(--labo-border)]"
            : "bg-[var(--paper)] border-transparent",
        ].join(" ")}
      >
        {/* Bandeau institutionnel */}
        <div style={{ background: "var(--footer-ink)", color: "#f3efe4" }}>
          <div className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-4 px-[clamp(1rem,6vw,6rem)] py-1.5 text-[0.68rem] tracking-wide sm:text-[0.72rem]">
            <span className="truncate" style={{ opacity: 0.85 }}>
              {tBrand("carriedBy")}{" "}
              <a
                href="https://esih.edu"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2 hover:opacity-100"
                style={{ opacity: 1 }}
              >
                {tBrand("esihName")}
              </a>
            </span>
            <span className="hidden shrink-0 sm:inline" style={{ opacity: 0.7 }}>Haïti · Caraïbes</span>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[120rem] items-center justify-between gap-6 px-[clamp(1rem,6vw,6rem)] py-2.5 sm:py-3">
          {/* Logo */}
          <Link href="/" className="group flex min-w-0 items-center gap-5" aria-label={site.name ?? "LaCDIA"}>
            <LaCDIAWordmark size="md" />
            <span
              aria-hidden="true"
              className="hidden h-8 w-px lg:block"
              style={{ background: "var(--labo-border)" }}
            />
            <span className="hidden lg:block">
              <EsihMark height={38} />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={[
                  "relative px-4 py-2 text-[0.92rem] font-medium transition-colors duration-200",
                  "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-[2px]",
                  "after:bg-[var(--haiti-red)] after:origin-left after:transition-transform after:duration-200",
                  item.active
                    ? "text-[var(--ink)] after:scale-x-100"
                    : "text-[var(--labo-text-muted)] hover:text-[var(--ink)] after:scale-x-0 hover:after:scale-x-100",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LocaleSwitcher />

            {/* Mobile burger */}
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-[var(--labo-border)] text-[var(--ink)] transition hover:bg-[var(--paper-2)] md:hidden"
              aria-label={t("openMenu")}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className="header-spacer" aria-hidden="true" />

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label={t("navigation")}>
          <div className="absolute inset-0 bg-[var(--ink)]/60" onClick={() => setMobileOpen(false)} />

          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-[var(--labo-border)] bg-[var(--paper)] p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <LaCDIAWordmark size="sm" />
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center border border-[var(--labo-border)] text-[var(--ink)] transition hover:bg-[var(--paper-2)]"
                aria-label={t("closeMenu")}
                onClick={() => setMobileOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={item.active ? "page" : undefined}
                  className={[
                    "flex items-center justify-between border-b border-[var(--labo-border)] px-1 py-4 text-lg transition-colors",
                    item.active ? "text-[var(--haiti-red)]" : "text-[var(--ink)] hover:text-[var(--haiti-blue)]",
                  ].join(" ")}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span>{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </nav>

            <div className="mt-6 border-t border-[var(--labo-border)] pt-5">
              <p className="mb-2 text-xs text-[var(--labo-text-muted)]">{tBrand("carriedBy")}</p>
              <EsihMark height={44} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
