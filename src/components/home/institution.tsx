import { getTranslations } from "next-intl/server";

import { EsihMark, ESIH_URL } from "@/components/brand/esih-mark";
import type { Locale } from "@/lib/i18n";

/** Bandeau « institution porteuse » : rattachement du laboratoire à l'ESIH. */
export default async function Institution({ locale = "fr" }: { locale?: Locale }) {
  const t = await getTranslations({ locale, namespace: "home.institution" });

  return (
    <section id="institution" className="institution-band" aria-labelledby="institution-title">
      <div className="container institution-grid">
        <div className="institution-logo">
          <p className="institution-label">{t("label")}</p>
          <EsihMark height={56} />
        </div>
        <div className="institution-copy">
          <h2 id="institution-title" className="institution-title">
            {t("title")}
          </h2>
          <p>{t("body")}</p>
          <a href={ESIH_URL} target="_blank" rel="noreferrer" className="institution-link">
            {t("cta")} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
