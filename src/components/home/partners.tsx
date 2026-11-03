"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { MouseEvent } from "react";

type PartnerPreview = {
  _id: string;
  name: string;
  type?: string;
  shortDescription?: string;
  website?: string;
  tags?: string[];
  logo?: { url: string | null; alt?: string; width?: number; height?: number } | null;
};

type PartnersProps = {
  title?: string;
  intro?: string;
  badge?: string;
  items: PartnerPreview[];
};

function handleSpotlightMove(e: MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function PartnerTile({ partner }: { partner: PartnerPreview }) {
  const content = partner.logo?.url ? (
    <Image
      src={partner.logo.url}
      alt={partner.logo.alt || partner.name}
      width={partner.logo.width ?? 140}
      height={partner.logo.height ?? 70}
      className="partner-tile-logo"
    />
  ) : (
    <span className="partner-tile-wordmark">{partner.name}</span>
  );

  const className = "partner-tile card-premium card-spotlight";

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noreferrer"
        aria-label={partner.name}
        className={className}
        onMouseMove={handleSpotlightMove}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={className} aria-label={partner.name} onMouseMove={handleSpotlightMove}>
      {content}
    </div>
  );
}

export default function Partners({ title, intro, badge, items }: PartnersProps) {
  const t = useTranslations("home.partners");
  if (!title && !intro && !badge && items.length === 0) return null;

  return (
    <section className="section-labo-surface" style={{ padding: "clamp(5rem,9vw,8rem) 0" }}>
      <div className="container">
        <div className="section-header-row">
          <div>
            {title ? <h2 className="section-title">{title}</h2> : null}
            {intro ? <p className="section-subtitle">{intro}</p> : null}
          </div>
          {badge ? <div className="badge-teal-box">{badge}</div> : null}
        </div>

        <div className="partner-tile-grid partner-tile-grid-flow" style={{ marginTop: "3rem" }}>
          {items.map((partner) => (
            <PartnerTile key={partner._id} partner={partner} />
          ))}
          <Link
            href="/contact"
            aria-label={t("becomePartnerAria")}
            className="partner-tile partner-tile-ghost"
          >
            <span>{t("becomePartner")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
