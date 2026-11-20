import { translateToHt } from "@/lib/i18n-ht/dictionary";
import { overlayEn } from "@/lib/i18n-ht/dictionary-en";
import { createClient } from "next-sanity";

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset =
  process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? process.env.NEXT_PUBLIC_SANITY_API_VERSION;

export const sanityConfig = {
  projectId: projectId || "",
  dataset,
  apiVersion: apiVersion || "2024-01-01",
  useCdn: false,
};

export function getSanityMissingEnv() {
  const missing: string[] = [];

  const hasProjectId = Boolean(process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  if (!hasProjectId) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");

  const hasDataset = Boolean(process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET);
  if (!hasDataset) missing.push("NEXT_PUBLIC_SANITY_DATASET");

  const hasApiVersion = Boolean(process.env.SANITY_API_VERSION || process.env.NEXT_PUBLIC_SANITY_API_VERSION);
  if (!hasApiVersion) missing.push("NEXT_PUBLIC_SANITY_API_VERSION");

  return missing;
}

export const isSanityConfigured = getSanityMissingEnv().length === 0;

export const sanityClient = isSanityConfigured ? createClient(sanityConfig) : null;

const LOCALE_KEYS = new Set(["fr", "en", "ht"]);

/**
 * Une valeur « localisée » brute ({ fr, en, ht? }) dont les entrées sont des
 * chaînes ou des tableaux (texte, blocs) — par opposition à `slugIntl`, dont
 * les entrées sont des objets `{ current }` et que l'on ne doit pas toucher.
 */
function isRawLocalized(value: object): value is Record<string, unknown> {
  const entries = Object.entries(value);
  return (
    entries.length > 0 &&
    entries.every(
      ([key, v]) => LOCALE_KEYS.has(key) && (v === null || typeof v === "string" || Array.isArray(v)),
    )
  );
}

/**
 * Le contenu éditorial n'est saisi qu'en FR/EN : pour `ht`, plusieurs requêtes
 * GROQ retombent sur l'objet localisé complet quand la clé `ht` est absente.
 * On le réduit ici à la meilleure valeur disponible (ht → fr → en) pour ne
 * jamais remettre un objet à un composant qui attend du texte.
 */
function collapseLocalized<T>(value: T, locale: string): T {
  if (typeof value === "string") return (locale === "ht" ? translateToHt(value) : value) as T;
  if (Array.isArray(value)) return value.map((item) => collapseLocalized(item, locale)) as T;
  if (value && typeof value === "object") {
    if (isRawLocalized(value)) {
      const raw = value as Record<string, unknown>;
      return collapseLocalized(raw[locale] ?? raw.fr ?? raw.en ?? null, locale) as T;
    }
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, collapseLocalized(v, locale)]),
    ) as T;
  }
  return value;
}

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T,
) {
  if (!isSanityConfigured) return fallback;
  if (!sanityClient) return fallback;
  const result = await sanityClient.fetch<T>(query, params);
  if (params.locale === "ht") return collapseLocalized(result, "ht");
  if (params.locale === "en") return overlayEn(result);
  return result;
}
