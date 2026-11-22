import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/lib/i18n";
import { SpiralMotif } from "@/components/brand/spiral-motif";

type HeroProps = {
  badge?: string;
  subtitle?: string;
  locale?: Locale;
  // Override optionnel des 4 lignes du titre (CMS homePage.heroTitleLine1..4).
  titleLine1?: string;
  titleLine2?: string;
  titleLine3?: string;
  titleLine4?: string;
};

type LabPart = { t: string; hi?: boolean };
type Fact = { value: string; label: string };

/** Les initiales de l'acronyme reprennent les couleurs du logo : encre / bleu / rouge. */
function initialColor(letter: string) {
  if (letter === "C" || letter === "D") return "var(--haiti-blue)";
  if (letter === "I" || letter === "A") return "var(--haiti-red)";
  return "var(--ink)";
}

export default async function Hero({
  badge,
  subtitle,
  locale = "fr",
  titleLine1,
  titleLine2,
  titleLine3,
  titleLine4,
}: HeroProps) {
  const t = await getTranslations({ locale, namespace: "home.hero" });
  const labLines = t.raw("labLines") as LabPart[][];
  const facts = t.raw("facts") as Fact[];

  return (
    <section className="hero-id">
      <div className="hero-id-grid container">
        <div className="hero-id-copy">
          <p className="hero-id-kicker">
            <span aria-hidden="true" className="hero-id-kicker-rule" />
            {badge ?? t("kicker")}
          </p>

          <h1 className="hero-id-title">
            <span>{titleLine1 ?? t("titleLine1")}</span>{" "}
            <span>{titleLine2 ?? t("titleLine2")}</span>{" "}
            <em>{titleLine3 ?? t("titleLine3")}</em>{" "}
            <span>{titleLine4 ?? t("titleLine4")}</span>
          </h1>

          <p className="hero-id-lead">{subtitle ?? t("subtitle")}</p>

          <div className="hero-id-actions">
            <Link href="/#architecture-scientifique" className="btn-primary-labo">
              {t("ctaScience")}
            </Link>
            <Link href="/#actualites" className="btn-secondary-labo">
              {t("ctaNews")}
            </Link>
          </div>
        </div>

        <div className="hero-id-side">
          <SpiralMotif className="hero-id-motif" />
          <aside className="hero-id-card" aria-label={t("nameLabel")}>
          <Image
            src="/logo/lacdia-mark.png"
            alt=""
            width={298}
            height={240}
            priority
            className="hero-id-mark"
          />
          <p className="hero-id-card-label">{t("nameLabel")}</p>
          <div className="hero-id-name" role="img" aria-label={t("labAria")}>
            {labLines.map((line, i) => (
              <div key={i} aria-hidden="true">
                {line.map((part, j) =>
                  part.hi ? (
                    <strong key={j} style={{ color: initialColor(part.t) }}>
                      {part.t}
                    </strong>
                  ) : (
                    <span key={j}>{part.t}</span>
                  ),
                )}
              </div>
            ))}
          </div>

          <dl className="hero-id-facts" aria-label={t("factsLabel")}>
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
        </div>
      </div>
    </section>
  );
}
