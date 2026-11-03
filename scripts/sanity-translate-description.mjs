#!/usr/bin/env node
/**
 * Ajoute la traduction anglaise de la description du site (siteSettings.description).
 *
 * Contexte : le schéma déclare `description` en localeText ({ fr, en }), mais la
 * donnée publiée est une simple chaîne française. Le site lit désormais
 * `description[$locale]` (voir siteSettingsQuery) : tant que la valeur EN n'existe
 * pas dans le CMS, /en retombe sur le texte de src/messages/en.json.
 *
 * Usage :
 *   node scripts/sanity-translate-description.mjs            # simulation (lecture seule)
 *   SANITY_API_TOKEN=... node scripts/sanity-translate-description.mjs --apply
 *
 * Options :
 *   --apply            écrit la modification (jeton d'écriture requis)
 *   --en "<texte>"     remplace la traduction anglaise proposée
 */
import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "fghn7rpw";
const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.SANITY_API_VERSION ?? process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01";
const token = process.env.SANITY_API_TOKEN ?? process.env.SANITY_WRITE_TOKEN;

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const enIndex = args.indexOf("--en");
const DEFAULT_EN =
  "Research and innovation laboratory in AI and data science: projects, publications, partnerships, transfer and training.";
const enText = enIndex >= 0 && args[enIndex + 1] ? args[enIndex + 1] : DEFAULT_EN;

if (apply && !token) {
  console.error("SANITY_API_TOKEN (jeton d'écriture) requis avec --apply.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

// Publié + brouillon éventuel : on traite les deux pour ne pas laisser le Studio
// republier l'ancienne valeur.
const docs = await client.fetch(
  `*[_type == "siteSettings" && _id in ["siteSettings", "drafts.siteSettings"]]{_id, description}`,
);

if (docs.length === 0) {
  console.error("Aucun document siteSettings trouvé.");
  process.exit(1);
}

let pending = 0;
for (const doc of docs) {
  const current = doc.description;
  let next;
  if (typeof current === "string") {
    next = { fr: current, en: enText };
  } else if (current && typeof current === "object") {
    if (current.en) {
      console.log(`${doc._id}: traduction EN déjà présente, rien à faire.`);
      continue;
    }
    next = { ...current, en: enText };
  } else {
    console.log(`${doc._id}: pas de description FR à traduire, ignoré.`);
    continue;
  }

  pending += 1;
  console.log(`${doc._id}:`);
  console.log("  avant :", JSON.stringify(current));
  console.log("  après :", JSON.stringify(next));

  if (apply) {
    await client.patch(doc._id).set({ description: next }).commit();
    console.log("  -> écrit.");
  }
}

if (!apply && pending > 0) {
  console.log("\nSimulation uniquement. Relancez avec --apply (et SANITY_API_TOKEN) pour écrire.");
}
