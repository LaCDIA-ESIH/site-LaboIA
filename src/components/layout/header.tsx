"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/navigation";
import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

import LocaleSwitcher from "@/components/layout/locale-switcher";
import type { Navigation, SiteSettings } from "@/lib/sanity/types";
import { resolveNavItems } from "@/lib/nav";

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
  const tCommon = useTranslations("common");
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
      return { ...item, active: isActivePath(basePath, pathOnly) };
    });
  }, [basePath, nav.mainNav]);

  const logoSrc = site.logo?.url ?? "/logo/logo-site.svg";
  const logoAlt = site.logo?.alt ?? site.shortName ?? "LaCDIA";

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_32px_rgba(0,0,0,0.4)]"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="mx-auto flex w-full items-center justify-between gap-6 px-[clamp(1.5rem,6vw,6rem)] py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            aria-label={site.name ?? "LaCDIA"}
          >
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src={logoSrc}
                alt={logoAlt}
                width={36}
                height={36}
                className="object-contain transition-opacity group-hover:opacity-80"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-base font-bold tracking-tight text-[#f0f4ff]"
                style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              >
                {site.shortName ?? "LaCDIA"}
              </span>
              <span
                className="hidden text-[10px] tracking-widest uppercase text-[#8892b0] md:block"
                style={{ fontFamily: "var(--font-jetbrains, monospace)" }}
              >
                LABO ◆
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={item.active ? "page" : undefined}
                className={[
                  "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  "hover:bg-white/6 hover:text-[#f0f4ff]",
                  "after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px",
                  "after:bg-[#00d4aa] after:origin-left after:transition-transform after:duration-200",
                  item.active
                    ? "text-[#f0f4ff] after:scale-x-100"
                    : "text-[#8892b0] after:scale-x-0 hover:after:scale-x-100",
                ].join(" ")}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LocaleSwitcher />

            {/* Mobile burger */}
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8892b0] transition hover:border-white/20 hover:text-[#f0f4ff] md:hidden"
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
      <div className="h-18.25" aria-hidden="true" />

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("navigation")}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-[#111827] border-l border-white/8 flex flex-col p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <span
                className="text-lg font-bold text-[#f0f4ff]"
                style={{ fontFamily: "var(--font-syne, sans-serif)" }}
              >
                {site.shortName ?? "LaCDIA"}
              </span>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#8892b0] hover:text-[#f0f4ff] transition"
                aria-label={t("closeMenu")}
                onClick={() => setMobileOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item, idx) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={item.active ? "page" : undefined}
                  className={[
                    "flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all",
                    item.active
                      ? "bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20"
                      : "text-[#8892b0] hover:bg-white/5 hover:text-[#f0f4ff]",
                  ].join(" ")}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <span>{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}
            </nav>

            {/* Footer CTA */}
            <div className="mt-8 pt-6 border-t border-white/8">
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-[#00d4aa]/10 border border-[#00d4aa]/30 text-[#00d4aa] hover:bg-[#00d4aa]/20 transition"
              >
                {tCommon("contactUs")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
