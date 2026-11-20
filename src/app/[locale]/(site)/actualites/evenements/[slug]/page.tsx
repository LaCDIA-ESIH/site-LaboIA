import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import PortableTextRenderer from "@/components/content/portable-text";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch } from "@/lib/sanity/client";
import { getServerLocale } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { eventBySlugQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ slug: string }> };

type EventDetail = {
  _id: string;
  title: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  summary?: string;
  content?: PortableTextBlock[];
  registrationUrl?: string;
  slugIntl?: { fr?: { current: string }; en?: { current: string } };
  speakers?: Array<{ _id: string; fullName: string; role?: string; slug?: { current: string } }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getServerLocale();
  const event = await sanityFetch<EventDetail | null>(
    eventBySlugQuery,
    { slug, locale },
    null,
  );

  const frSlug = event?.slugIntl?.fr?.current ?? slug;
  const enSlug = event?.slugIntl?.en?.current ?? slug;

  return await buildMetadata({
    locale,
    title: event?.title,
    description: event?.summary,
    path: localizedPath(`/actualites/evenements/${slug}`, locale),
    alternates: {
      fr: localizedPath(`/actualites/evenements/${frSlug}`, "fr"),
      en: localizedPath(`/actualites/evenements/${enSlug}`, "en"),
      ht: localizedPath(`/actualites/evenements/${frSlug}`, "ht"),
    },
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getServerLocale();
  const t = await getTranslations({ locale, namespace: "common" });
  const event = await sanityFetch<EventDetail | null>(
    eventBySlugQuery,
    { slug, locale },
    null,
  );

  if (!event) {
    notFound();
  }

  return (
    <article className="container" style={{maxWidth:'56rem', paddingTop:'3rem', paddingBottom:'3rem'}}>
      {/* The dedicated /actualites listing page was removed; news now lives
          in the "actualites" section on the home page. */}
      <Link
        href="/#actualites"
        className="btn-link"
        aria-label={t("backToNews")}
      >
        {"<"}
      </Link>

      <div className="simple-card-meta" style={{marginTop:'1rem'}}>
        {event.eventType ? (
          <span className="tag-small">
            {event.eventType}
          </span>
        ) : null}
        {event.startDate ? <span>{event.startDate}</span> : null}
        {event.location ? <span>{event.location}</span> : null}
      </div>

      <h1 className="section-title" style={{marginTop:'1rem'}}>{event.title}</h1>
      {event.summary ? <p className="section-subtitle" style={{fontSize:'1.125rem'}}>{event.summary}</p> : null}

      <div style={{marginTop:'2rem'}}>
        <PortableTextRenderer value={event.content} />
      </div>

      {event.speakers?.length ? (
        <div style={{marginTop:'2.5rem'}}>
          <ul style={{marginTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.5rem', fontSize:'0.875rem', color:'#1e293b'}}>
            {event.speakers.map((speaker) => (
              <li key={speaker._id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem'}}>
                <span style={{fontWeight:500}}>{speaker.fullName}</span>
                {speaker.role ? (
                  <span style={{fontSize:'0.75rem', textTransform:'uppercase', color:'var(--muted)'}}>{speaker.role}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {event.registrationUrl ? (
        <div style={{marginTop:'2rem'}}>
          <Link
            href={event.registrationUrl}
            className="btn-link"
            target="_blank"
            rel="noreferrer"
          >
            {event.registrationUrl}
          </Link>
        </div>
      ) : null}
    </article>
  );
}
