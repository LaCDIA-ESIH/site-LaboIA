"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";
import { type Locale, localeNames } from "@/lib/i18n";
import { routing } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("locale");
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: Locale) {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <div
      className="locale-toggle"
      role="group"
      aria-label={t("switchLanguage")}
    >
      {routing.locales.map((loc) => {
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            lang={loc}
            title={localeNames[loc]}
            type="button"
            onClick={() => switchLocale(loc)}
            disabled={isPending}
            aria-pressed={isActive}
            className={`locale-toggle-option ${isActive ? "locale-toggle-option--active" : ""}`}
          >
            {loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
