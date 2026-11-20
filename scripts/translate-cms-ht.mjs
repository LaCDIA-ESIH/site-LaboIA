/**
 * Ajoute la traduction créole (champ `ht`) au contenu éditorial Sanity.
 *
 *   node scripts/translate-cms-ht.mjs            # simulation (lecture publique, n'écrit rien)
 *   node scripts/translate-cms-ht.mjs --apply    # écrit en production (jeton requis)
 *
 * Source des traductions : scripts/cms-ht/fr.json (textes français) et
 * scripts/cms-ht/ht.json (créole, même ordre). Un champ localisé {fr,en} sans
 * `ht` reçoit la traduction dont le texte français est identique. Les champs
 * sans correspondance sont listés (à traduire, puis à ajouter aux deux fichiers).
 * Les pages légales (institutionalPage) sont exclues : traduction juridique à
 * faire valider avant publication.
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
const SKIP_TYPES = new Set(["institutionalPage", "formSettings", "formSubmission", "newsletterSubscriber"]);

const here = path.dirname(fileURLToPath(import.meta.url));
const fr = JSON.parse(fs.readFileSync(path.join(here, "cms-ht", "fr.json"), "utf8"));
const ht = JSON.parse(fs.readFileSync(path.join(here, "cms-ht", "ht.json"), "utf8"));
if (fr.length !== ht.length) {
  console.error(`fr.json (${fr.length}) et ht.json (${ht.length}) n'ont pas la même taille.`);
  process.exit(1);
}
const dict = new Map(fr.map((s, i) => [s, ht[i]]));

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
    if (k.startsWith("_")) continue;
    walk(v, docId, type, p ? `${p}.${k}` : k);
  }
}
for (const doc of docs) walk(doc, doc._id, doc._type, "");

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
