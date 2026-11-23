import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import PortableTextRenderer from "@/components/content/portable-text";
import type { PortableTextBlock } from "@portabletext/types";
import { sanityFetch } from "@/lib/sanity/client";
import { initLocale } from "@/lib/i18n-server";
import { localizedPath } from "@/lib/i18n";
import { newsBySlugQuery } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

// Aucune page pré-générée : chaque article est généré à la première visite puis mis en cache.
export function generateStaticParams() {
  return [];
}

type PageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

type NewsDetail = {
  _id: string;
  title: string;
  date?: string;
  category?: string;
  categoryLabel?: string;
  summary?: string;
  content?: PortableTextBlock[];
  mainImageUrl?: string;
  mainImageAlt?: string;
  sourceUrl?: string;
  slugIntl?: { fr?: { current: string }; en?: { current: string } };
  relatedProjects?: Array<{ _id: string; title: string; slug?: { current: string } }>;
  relatedMembers?: Array<{ _id: string; fullName: string; role?: string; slug?: { current: string } }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await initLocale(params);
  const article = await sanityFetch<NewsDetail | null>(
    newsBySlugQuery,
    { slug, locale },
    null,
  );

  const frSlug = article?.slugIntl?.fr?.current ?? slug;
  const enSlug = article?.slugIntl?.en?.current ?? slug;

  return await buildMetadata({
    locale,
    title: article?.title,
    description: article?.summary,
    path: localizedPath(`/actualites/${slug}`, locale),
    alternates: {
      fr: localizedPath(`/actualites/${frSlug}`, "fr"),
      en: localizedPath(`/actualites/${enSlug}`, "en"),
      ht: localizedPath(`/actualites/${frSlug}`, "ht"),
    },
  });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const locale = await initLocale(params);
  const article = await sanityFetch<NewsDetail | null>(
    newsBySlugQuery,
    { slug, locale },
    null,
  );

  if (!article) {
    notFound();
  }

  return (
    <article className="container" style={{maxWidth:'56rem', paddingTop:'3rem', paddingBottom:'3rem'}}>
      <div className="simple-card-meta">
        {article.category ? (
          <span className="badge badge-primary">
            {article.categoryLabel ?? article.category}
          </span>
        ) : null}
        {article.date ? (
          <span>{article.date}</span>
        ) : null}
      </div>

      <h1 className="section-title" style={{marginTop:'1rem'}}>
        {article.title}
      </h1>
      {article.summary ? (
        <p className="section-subtitle" style={{fontSize:'1.125rem'}}>{article.summary}</p>
      ) : null}

      {article.mainImageUrl ? (
        <div style={{position:'relative', marginTop:'1.5rem', aspectRatio:'16/9', width:'100%', overflow:'hidden', borderRadius:'1rem'}}>
          <Image
            src={article.mainImageUrl}
            alt={article.mainImageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            style={{objectFit:'cover'}}
          />
        </div>
      ) : null}

      <div style={{marginTop:'2rem'}}>
        {article.content ? (
          <PortableTextRenderer value={article.content} />
        ) : null}
      </div>

      {article.relatedProjects?.length ? (
        <div style={{marginTop:'2.5rem'}}>
          <ul style={{marginTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.5rem', fontSize:'0.875rem', color:'#1e293b'}}>
            {article.relatedProjects.map((project) => (
              <li key={project._id}>
                <span style={{fontWeight:500}}>{project.title}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {article.relatedMembers?.length ? (
        <div style={{marginTop:'2.5rem'}}>
          <ul style={{marginTop:'0.75rem', display:'flex', flexDirection:'column', gap:'0.5rem', fontSize:'0.875rem', color:'#1e293b'}}>
            {article.relatedMembers.map((member) => (
              <li key={member._id} style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem'}}>
                <span style={{fontWeight:500}}>{member.fullName}</span>
                {member.role ? <span style={{fontSize:'0.75rem', textTransform:'uppercase', color:'var(--muted)'}}>{member.role}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {article.sourceUrl ? (
        <div style={{marginTop:'2.5rem', display:'flex', flexWrap:'wrap', gap:'0.75rem', fontSize:'0.875rem', color:'#334155'}}>
          <Link
            href={article.sourceUrl}
            className="btn-link"
            target="_blank"
            rel="noreferrer"
          >
            {article.sourceUrl}
          </Link>
        </div>
      ) : null}
    </article>
  );
}
