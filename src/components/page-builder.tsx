/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDate as formatLocalizedDate } from '@/lib/i18n-pick';
import React from 'react';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';
import { portableTextComponents } from '@/components/content/portable-text';

// Simple helper pour extraire le texte depuis l'objet {fr, en} de Sanity
function getLocalValue(field: any, locale: string) {
  if (!field) return null;
  if (typeof field === 'string') return field;
  return field[locale] || field.fr || field.en || null;
}

// Alternates the LABO "void" / "elevated" tones across blocks so a generic
// Sanity page gets the same breathing rhythm as the homepage, instead of a
// flat background from top to bottom. TECH (cream) is intentionally left out
// here — it stays reserved for the homepage Équipe signature moment.
function toneClass(index: number) {
  return index % 2 === 0 ? 'section-labo' : 'section-labo-surface';
}

function actionClass(variant: string | undefined, index: number) {
  if (variant === 'primary') return 'btn btn-primary-labo';
  if (variant === 'secondary') return 'btn btn-secondary-labo';
  return index === 0 ? 'btn btn-primary-labo' : 'btn btn-secondary-labo';
}

function newsHref(item: any, locale: string) {
  if (item.sourceUrl) return item.sourceUrl;
  const slugVal = item.slugIntl?.[locale]?.current ?? item.slug?.current;
  return `/actualites/${slugVal}`;
}

function formatNewsDate(dateStr: string | undefined, locale: string) {
  if (!dateStr) return '';
  try {
    return formatLocalizedDate(dateStr, locale === 'en' || locale === 'ht' ? locale : 'fr');
  } catch {
    return dateStr;
  }
}

export function PageBuilder({
  blocks,
  locale,
  newsItems = [],
}: {
  blocks: any[];
  locale: string;
  // Actualités pré-chargées côté serveur pour tout bloc latestNewsBlock
  // présent dans `blocks` — voir [...slug]/page.tsx (getLatestNews).
  newsItems?: any[];
}) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col w-full">
      {blocks.map((block, index) => {
        const key = block._key || `block-${index}`;

        switch (block._type) {
          case 'heroBlock': {
            const badge = getLocalValue(block.badge, locale);
            const title = getLocalValue(block.title, locale);
            const description = getLocalValue(block.description, locale);
            const actions = block.actions || [];

            return (
              <section key={key} className="section-labo" style={{ padding: 'clamp(4.5rem,9vw,7rem) 0 clamp(3rem,6vw,5rem)' }}>
                <div className="container" style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
                  {badge && (
                    <div className="badge-teal" style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--labo-accent-teal)', flexShrink: 0 }} />
                      {badge}
                    </div>
                  )}
                  {title && (
                    <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem,5vw,3.75rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--labo-text)', margin: '0 0 1.25rem' }}>
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p style={{ fontSize: '1.05rem', color: 'var(--labo-text-muted)', lineHeight: 1.75, margin: '0 auto' }}>
                      {description}
                    </p>
                  )}

                  {actions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.85rem', marginTop: '2.25rem' }}>
                      {actions.map((act: any, i: number) => {
                        const label = getLocalValue(act.labelIntl, locale) || act.label;
                        return (
                          <Link key={i} href={act.href || '#'} className={actionClass(act.variant, i)}>
                            {label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          case 'textImageBlock': {
            const title = getLocalValue(block.title, locale);
            const content = getLocalValue(block.content, locale);
            const isImageLeft = block.imagePosition === 'left';

            return (
              <section key={key} className={toneClass(index)} style={{ padding: 'clamp(4rem,7vw,6rem) 0' }}>
                <div className="container">
                  <div
                    className="text-image-grid"
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center', flexDirection: isImageLeft ? 'row-reverse' : 'row' }}
                  >
                    <div style={{ flex: '1 1 380px', minWidth: 280 }}>
                      {title && (
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: 'var(--labo-text)', letterSpacing: '-0.02em', margin: '0 0 1.25rem' }}>
                          {title}
                        </h2>
                      )}
                      {content && (
                        <div className="rich-text">
                          <PortableText value={content} components={portableTextComponents} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: '1 1 380px', minWidth: 280 }}>
                      {block.imageUrl ? (
                        <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', width: '100%', aspectRatio: '4 / 3', background: 'var(--labo-surface-2)' }}>
                          <Image
                            src={block.imageUrl}
                            alt={block.imageAlt || ''}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div style={{ borderRadius: 20, background: 'var(--labo-surface-2)', width: '100%', aspectRatio: '4 / 3' }} />
                      )}
                    </div>
                  </div>
                </div>
                <style>{`
                  @media (max-width: 768px) {
                    .text-image-grid { flex-direction: column !important; }
                  }
                `}</style>
              </section>
            );
          }

          case 'featuresBlock': {
            const title = getLocalValue(block.title, locale);
            const intro = getLocalValue(block.intro, locale);
            const features = block.features || [];

            return (
              <section key={key} className={toneClass(index)} style={{ padding: 'clamp(4rem,7vw,6rem) 0' }}>
                <div className="container">
                  <div style={{ maxWidth: 640, margin: '0 auto 3rem', textAlign: 'center' }}>
                    {title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: 'var(--labo-text)', letterSpacing: '-0.02em', margin: '0 0 1rem' }}>{title}</h2>}
                    {intro && <p style={{ fontSize: '1rem', color: 'var(--labo-text-muted)', lineHeight: 1.7, margin: 0 }}>{intro}</p>}
                  </div>

                  {features.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                      {features.map((feat: any, i: number) => {
                        const fTitle = getLocalValue(feat.titleIntl, locale) || feat.title;
                        const fDesc = getLocalValue(feat.descriptionIntl, locale) || feat.description;
                        return (
                          <div key={i} className="card-premium" style={{ padding: '2rem 1.75rem' }}>
                            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--labo-text)', margin: '0 0 0.6rem' }}>{fTitle}</h3>
                            <p style={{ color: 'var(--labo-text-muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>{fDesc}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          case 'kpisBlock': {
            const title = getLocalValue(block.title, locale);
            const intro = getLocalValue(block.intro, locale);
            const kpis = block.kpisList || [];
            const stripeColors = ['var(--haiti-blue)', 'var(--haiti-red)', 'var(--haiti-blue)', 'var(--haiti-red)'];

            return (
              <section key={key} className={toneClass(index)} style={{ padding: 'clamp(4rem,7vw,6rem) 0' }}>
                <div className="container">
                  <div style={{ maxWidth: 640, margin: '0 auto 2.5rem', textAlign: 'center' }}>
                    {title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.25rem)', fontWeight: 800, color: 'var(--labo-text)', letterSpacing: '-0.02em', margin: '0 0 1rem' }}>{title}</h2>}
                    {intro && <p style={{ fontSize: '1rem', color: 'var(--labo-text-muted)', lineHeight: 1.7, margin: 0 }}>{intro}</p>}
                  </div>

                  {kpis.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', borderRadius: 20, border: '1px solid var(--labo-border)', background: 'var(--labo-surface)', padding: '2.5rem 0' }}>
                      {kpis.map((kpi: any, i: number) => {
                        const kLabel = getLocalValue(kpi.labelIntl, locale) || kpi.label;
                        const kNote = getLocalValue(kpi.noteIntl, locale) || kpi.note;
                        const color = stripeColors[i % stripeColors.length];
                        const gradEnd = stripeColors[(i + 1) % stripeColors.length];
                        return (
                          <div key={i} style={{ flex: '1 1 0', minWidth: 180, padding: '0 1.75rem', borderLeft: i > 0 ? '1px solid var(--labo-border)' : 'none' }}>
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.25rem,3.5vw,3.25rem)', fontWeight: 900, letterSpacing: '-0.04em', backgroundImage: `linear-gradient(135deg, ${color}, ${gradEnd})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                              {kpi.value}
                            </div>
                            <span aria-hidden="true" style={{ display: 'block', width: 36, height: 3, borderRadius: 999, margin: '0.75rem 0 0.9rem', background: `linear-gradient(90deg, ${color}, ${gradEnd})` }} />
                            <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 700, color: 'var(--labo-text)', marginBottom: '0.3rem' }}>{kLabel}</div>
                            {kNote && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.06em', color: 'rgba(var(--ink-rgb),0.55)', margin: 0 }}>{kNote}</p>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          case 'ctaBlock': {
            const title = getLocalValue(block.title, locale);
            const body = getLocalValue(block.body, locale);
            const actions = block.actions || [];
            const primary = actions.find((a: any) => a.variant === 'primary') ?? actions[0];
            const secondary = actions.find((a: any) => a.variant === 'secondary') ?? actions[1];

            return (
              <section key={key} className="collab-cta section">
                <div className="section-inner" style={{ padding: 'clamp(3.5rem,6vw,5rem) 0' }}>
                  <div className="collab-cta-box">
                    <div className="collab-cta-accent" />
                    <div className="collab-cta-pattern" />
                    <div className="collab-cta-content">
                      <div className="collab-cta-text">
                        {title && <h2 className="collab-cta-title">{title}</h2>}
                        {body && <p className="collab-cta-body">{body}</p>}
                      </div>
                      <div className="collab-cta-buttons">
                        {primary && (
                          <Link href={primary.href || '#'} className="btn btn-cta-primary">
                            {getLocalValue(primary.labelIntl, locale) || primary.label}
                          </Link>
                        )}
                        {secondary && (
                          <Link href={secondary.href || '#'} className="btn btn-cta-secondary">
                            {getLocalValue(secondary.labelIntl, locale) || secondary.label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          case 'latestNewsBlock': {
            const title = getLocalValue(block.title, locale);
            const intro = getLocalValue(block.intro, locale);
            const limit = block.limit || 3;
            const items = (newsItems || []).slice(0, limit);

            return (
              <section key={key} className={toneClass(index)} style={{ padding: 'clamp(3rem,5vw,4rem) 0' }}>
                <div className="container">
                  {(title || intro) && (
                    <div style={{ borderBottom: '1px solid var(--labo-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                      {title && <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 800, color: 'var(--labo-text)', margin: intro ? '0 0 0.6rem' : 0 }}>{title}</h2>}
                      {intro && <p style={{ color: 'var(--labo-text-muted)', margin: 0 }}>{intro}</p>}
                    </div>
                  )}

                  {items.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                      {items.map((item: any) => (
                        <Link
                          key={item._id}
                          href={newsHref(item, locale)}
                          target={item.sourceUrl ? '_blank' : undefined}
                          rel={item.sourceUrl ? 'noreferrer' : undefined}
                          className="card-premium"
                          style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '1.75rem', textDecoration: 'none', color: 'inherit' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                            {(item.categoryLabel || item.category) && (
                              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--labo-accent-teal)' }}>
                                {item.categoryLabel || item.category}
                              </span>
                            )}
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--labo-text-muted)' }}>
                              {formatNewsDate(item.date, locale)}
                            </span>
                          </div>
                          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 700, color: 'var(--labo-text)', margin: 0 }}>{item.title}</h3>
                          {item.summary && (
                            <p style={{ color: 'var(--labo-text-muted)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {item.summary}
                            </p>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
