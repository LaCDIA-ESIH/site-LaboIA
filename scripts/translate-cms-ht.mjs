/**
 * Ajoute la traduction créole (champ `ht`) au contenu éditorial Sanity.
 *
 *   node scripts/translate-cms-ht.mjs            # simulation (lecture publique, n'écrit rien)
 *   node scripts/translate-cms-ht.mjs --apply    # écrit en production (jeton requis)
 *
 * Source des traductions : src/lib/i18n-ht/fr.json (textes français) et
 * src/lib/i18n-ht/ht.json (créole, même ordre). Un champ localisé {fr,en} sans
 * `ht` reçoit la traduction dont le texte français est identique. Les champs
 * sans correspondance sont listés (à traduire, puis à ajouter aux deux fichiers).
 * Pages légales : src/lib/i18n-ht/legal-*.json (traduction indicative, à faire valider).
 *
 * Jeton : SANITY_API_TOKEN (Editor sur le projet fghn7rpw), jamais écrit sur disque.
 * Projet FORCÉ à fghn7rpw / production.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const PROJECT_ID = "fghn7rpw";
const DATASET = "production";
const APPLY = process.argv.includes("--apply");
const SKIP_TYPES = new Set(["formSettings", "formSubmission", "newsletterSubscriber"]);
// Pages institutionnelles réellement affichées par le site (les autres sont des restes de l'ancienne arborescence).
const LIVE_PAGES = new Set([
  "page-mentions-legales", "page-confidentialite", "page-conditions-utilisation", "page-cookies",
  "page-newsletter", "page-axes-recherche", "page-actualites",
]);

const here = path.dirname(fileURLToPath(import.meta.url));
const fr = JSON.parse(fs.readFileSync(path.join(here, "..", "src", "lib", "i18n-ht", "fr.json"), "utf8"));
const ht = JSON.parse(fs.readFileSync(path.join(here, "..", "src", "lib", "i18n-ht", "ht.json"), "utf8"));
if (fr.length !== ht.length) {
  console.error(`fr.json (${fr.length}) et ht.json (${ht.length}) n'ont pas la même taille.`);
  process.exit(1);
}
const dict = new Map(fr.map((s, i) => [s, ht[i]]));
const legalFr = JSON.parse(fs.readFileSync(path.join(here, "..", "src", "lib", "i18n-ht", "legal-fr.json"), "utf8"));
const legalHt = JSON.parse(fs.readFileSync(path.join(here, "..", "src", "lib", "i18n-ht", "legal-ht.json"), "utf8"));
if (legalFr.length !== legalHt.length) {
  console.error(`legal-fr.json (${legalFr.length}) et legal-ht.json (${legalHt.length}) n'ont pas la même taille.`);
  process.exit(1);
}
legalFr.forEach((s, i) => dict.set(s, legalHt[i]));

const token = process.env.SANITY_API_TOKEN;
if (APPLY && !token) {
  console.error("SANITY_API_TOKEN manquant : --apply exige un jeton d'écriture du projet fghn7rpw.");
  process.exit(1);
}
const client = createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: "2024-01-01", token, useCdn: false });

const docs = await client.fetch(
  `*[!(_type match "system.*") && !(_type in $skip)]`,
  { skip: [...SKIP_TYPES] },
);

const patches = new Map(); // docId -> { [path]: ht }
const missing = [];

function walk(node, docId, type, p) {
  if (Array.isArray(node)) {
    node.forEach((v, i) => walk(v, docId, type, `${p}[${v && v._key ? `_key=="${v._key}"` : i}]`));
    return;
  }
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node.fr) && node.fr.every((b) => b && b._type === "block")) {
    // texte riche (pages légales) : on recopie la structure, seuls les textes changent
    if (node.ht?.length) return;
    let complete = true;
    const blocks = node.fr.map((b) => ({
      ...b,
      children: (b.children ?? []).map((c) => {
        if (typeof c.text !== "string" || !c.text.trim()) return c;
        const t = dict.get(c.text);
        if (!t) {
          complete = false;
          missing.push(`${type} ${docId}${p} : ${c.text.slice(0, 70)}`);
          return c;
        }
        return { ...c, text: t };
      }),
    }));
    if (complete) {
      if (!patches.has(docId)) patches.set(docId, {});
      patches.get(docId)[`${p}.ht`] = blocks;
    }
    return;
  }
  if (Array.isArray(node.fr) && node.fr.length && node.fr.every((x) => typeof x === "string")) {
    // liste de textes (ex. benefitsIntl, flowStepsIntl)
    if (node.ht?.length) return;
    const out = node.fr.map((x) => dict.get(x));
    if (out.every(Boolean)) {
      if (!patches.has(docId)) patches.set(docId, {});
      patches.get(docId)[`${p}.ht`] = out;
    } else node.fr.forEach((x, i) => !out[i] && missing.push(`${type} ${docId}${p} : ${x.slice(0, 70)}`));
    return;
  }
  if (typeof node.fr === "string" && ("en" in node || Object.keys(node).length <= 3)) {
    if (!node.ht && node.fr.trim()) {
      const t = dict.get(node.fr);
      if (t) {
        if (!patches.has(docId)) patches.set(docId, {});
        patches.get(docId)[`${p}.ht`] = t;
      } else missing.push(`${type} ${docId}${p} : ${node.fr.slice(0, 70)}`);
    }
    return;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("_") || k === "slugIntl") continue;
    walk(v, docId, type, p ? `${p}.${k}` : k);
  }
}
for (const doc of docs) {
  if (doc._type === "institutionalPage" && !LIVE_PAGES.has(doc._id.replace(/^drafts\./, ""))) continue;
  walk(doc, doc._id, doc._type, "");
}

let fields = 0;
for (const set of patches.values()) fields += Object.keys(set).length;
console.log(`Projet ${PROJECT_ID}/${DATASET} — ${APPLY ? "APPLICATION" : "simulation"}`);
console.log(`${fields} champ(s) à traduire dans ${patches.size} document(s).`);
if (missing.length) {
  console.log(`\n${missing.length} champ(s) SANS traduction disponible :`);
  missing.forEach((m) => console.log("  - " + m));
}
if (!APPLY) {
  console.log("\nSimulation terminée — rien n'a été écrit.");
  process.exit(0);
}
for (const [id, set] of patches) {
  await client.patch(id).set(set).commit();
  console.log(`✔ ${id} (${Object.keys(set).length} champs)`);
}
console.log("Terminé.");
