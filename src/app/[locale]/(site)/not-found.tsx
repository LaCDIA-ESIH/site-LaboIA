import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { getServerLocale } from "@/lib/i18n-server";

export default async function NotFound() {
  const locale = await getServerLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <section className="not-found">
      <div className="container">
        <p className="not-found-code">404</p>
        <h1>{t("title")}</h1>
        <p>{t("body")}</p>
        <Link href="/" className="btn-primary-labo">
          {t("cta")}
        </Link>
      </div>
    </section>
  );
}
