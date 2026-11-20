/**
 * Mise en cohérence du contenu Sanity avec le site actuel (refonte 2026-11).
 *
 *   node scripts/fix-cms-content.mjs            # simulation (n'écrit rien ; jeton facultatif)
 *   node scripts/fix-cms-content.mjs --apply    # applique en production
 *
 * Jeton requis : SANITY_API_TOKEN (droits d'écriture sur le projet fghn7rpw),
 * lu dans l'environnement ou dans .env.local. Le projet cible est FORCÉ à
 * fghn7rpw / production (l'ancien projet 3rg8hwul n'est jamais touché).
 *
 * Ce que fait le script :
 *  1. Pages légales (mentions légales, confidentialité, conditions) : e-mail
 *     unique contact.lacdia@esih.edu, retrait des mentions du formulaire de
 *     contact / collaboration (désactivés), FR + EN.
 *  2. Navigation : retire les liens vers les arborescences supprimées (/contact…).
 *  3. Page d'accueil : retire les champs « Collaborer » et les boutons pointant
 *     vers des pages supprimées.
 *  4. Supprime les documents orphelins page-contact et page-collaborer.
 */
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

const PROJECT_ID = "fghn7rpw";
const DATASET = "production";
const APPLY = process.argv.includes("--apply");
const NEW_EMAIL = "contact.lacdia@esih.edu";
const REMOVED_TREES = [
  "equipe", "a-propos", "recherche", "lacdia-tech", "formation", "projets",
  "publications", "ressources", "contact", "collaborer",
];

function loadEnvLocal() {
  const file = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
loadEnvLocal();

const token = process.env.SANITY_API_TOKEN;
if (!token && APPLY) {
  console.error("SANITY_API_TOKEN manquant : --apply exige un jeton d'écriture du projet fghn7rpw.");
  process.exit(1);
}
if (!token) console.log("(Pas de jeton : simulation en lecture publique, brouillons non visibles.)");
if (!token) console.log("");

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/* ───────────── 1. Textes légaux ───────────── */

const FR = [
  [/,? ou via le formulaire de contact du site/g, ""],
  [/ ou via le formulaire de contact/g, ""],
  [/via les formulaires du site/g, "via les services interactifs du site"],
  [/\(contact, collaboration, newsletter\)/g, "(newsletter)"],
  [
    /^Formulaire de contact : nom, e-mail, message\./,
    "Courriers électroniques adressés au laboratoire : nom, adresse e-mail et contenu du message.",
  ],
  [
    /Les données issues des formulaires de contact et de collaboration sont conservées/g,
    "Les données issues des échanges avec le laboratoire (e-mails et anciens formulaires de contact et de collaboration) sont conservées",
  ],
];
const EN = [
  [/,? or via the site's contact form/g, ""],
  [/ or via the contact form/g, ""],
  [/via the site's forms/g, "via the site's interactive services"],
  [/\(contact, collaboration, newsletter\)/g, "(newsletter)"],
  [
    /^Contact form: name, email, message\./,
    "Emails sent to the laboratory: name, email address and message content.",
  ],
  [
    /Data from contact and collaboration forms is kept/g,
    "Data from exchanges with the laboratory (emails and former contact and collaboration forms) is kept",
  ],
];
const DROP_BLOCK = [/^Formulaire de collaboration\s*:/i, /^Collaboration form\s*:/i];

const blockText = (b) => (b.children ?? []).map((c) => c.text ?? "").join("");

function transformBlocks(blocks, rules) {
  const changes = [];
  const out = [];
  for (const block of blocks ?? []) {
    const before = blockText(block);
    if (DROP_BLOCK.some((re) => re.test(before))) {
      changes.push({ before, after: "(bloc supprimé)" });
      continue;
    }
    const next = JSON.parse(JSON.stringify(block));
    for (const child of next.children ?? []) {
      if (typeof child.text !== "string") continue;
      let t = child.text.replace(/contact@lacdia\.org/g, NEW_EMAIL);
      for (const [re, rep] of rules) t = t.replace(re, rep);
      child.text = t;
    }
    // mailto éventuels
    for (const def of next.markDefs ?? []) {
      if (typeof def.href === "string") def.href = def.href.replace(/contact@lacdia\.org/g, NEW_EMAIL);
    }
    const after = blockText(next);
    if (after !== before) changes.push({ before, after });
    out.push(next);
  }
  return { blocks: out, changes };
}

const patches = []; // { id, set?, unset?, label }

async function legalPages() {
  const ids = ["page-mentions-legales", "page-confidentialite", "page-conditions-utilisation", "page-cookies"];
  const docs = await client.fetch(`*[_id in $ids || _id in $drafts]`, {
    ids,
    drafts: ids.map((i) => `drafts.${i}`),
  });
  for (const doc of docs) {
    const set = {};
    const fields = [
      ["content", FR],
      ["contentIntl.fr", FR],
      ["contentIntl.en", EN],
    ];
    for (const [field, rules] of fields) {
      const value = field.split(".").reduce((o, k) => o?.[k], doc);
      if (!Array.isArray(value)) continue;
      const { blocks, changes } = transformBlocks(value, rules);
      if (changes.length) {
        set[field] = blocks;
        for (const c of changes) console.log(`  [${doc._id}] ${field}\n     - ${c.before}\n     + ${c.after}`);
      }
    }
    if (Object.keys(set).length) patches.push({ id: doc._id, set, label: `texte légal ${doc._id}` });
  }
}

/* ───────────── 2. Navigation ───────────── */

const firstSegment = (href = "") => href.replace(/^\/+/, "").split("/")[0];
const isRemoved = (href) => REMOVED_TREES.includes(firstSegment(href));

async function navigation() {
  const docs = await client.fetch(`*[_id in ["navigation","drafts.navigation"]]`);
  for (const doc of docs) {
    const set = {};
    for (const field of ["mainNav", "footerNav"]) {
      const items = doc[field];
      if (!Array.isArray(items)) continue;
      const kept = items.filter((i) => !isRemoved(i.href));
      if (kept.length !== items.length) {
        set[field] = kept;
        for (const i of items.filter((x) => isRemoved(x.href))) console.log(`  [${doc._id}] ${field}: retire « ${i.label} » (${i.href})`);
      }
    }
    if (Object.keys(set).length) patches.push({ id: doc._id, set, label: `navigation ${doc._id}` });
  }
}

/* ───────────── 3. Page d'accueil ───────────── */

async function homePage() {
  const docs = await client.fetch(`*[_id in ["homePage","drafts.homePage"]]`);
  for (const doc of docs) {
    const set = {};
    const unset = [];
    for (const field of ["collaborateActions", "collaborateTitle", "collaborateBody"]) {
      if (doc[field] !== undefined) {
        unset.push(field);
        console.log(`  [${doc._id}] supprime le champ ${field}`);
      }
    }
    for (const field of ["heroActions", "introActions"]) {
      const items = doc[field];
      if (!Array.isArray(items)) continue;
      const kept = items.filter((i) => !isRemoved(i.href));
      if (kept.length !== items.length) {
        set[field] = kept;
        for (const i of items.filter((x) => isRemoved(x.href))) console.log(`  [${doc._id}] ${field}: retire « ${i.label} » (${i.href})`);
      }
    }
    if (doc.featuredProjectsCtaHref && isRemoved(doc.featuredProjectsCtaHref)) {
      unset.push("featuredProjectsCtaHref", "featuredProjectsCtaLabel");
      console.log(`  [${doc._id}] retire le CTA « projets » (${doc.featuredProjectsCtaHref})`);
    }
    if (Object.keys(set).length || unset.length) patches.push({ id: doc._id, set, unset, label: `accueil ${doc._id}` });
  }
}

/* ───────────── 4. Documents orphelins ───────────── */

const deletions = [];
async function orphans() {
  const ids = ["page-contact", "page-collaborer", "drafts.page-contact", "drafts.page-collaborer"];
  const found = await client.fetch(`*[_id in $ids]{_id}`, { ids });
  for (const d of found) {
    deletions.push(d._id);
    console.log(`  supprime le document ${d._id}`);
  }
}

/* ───────────── Exécution ───────────── */

console.log(`Projet ${PROJECT_ID} / ${DATASET} — mode : ${APPLY ? "APPLICATION" : "simulation (ajoutez --apply)"}\n`);
console.log("1) Pages légales");
await legalPages();
console.log("\n2) Navigation");
await navigation();
console.log("\n3) Page d'accueil");
await homePage();
console.log("\n4) Documents orphelins");
await orphans();

console.log(`\n${patches.length} document(s) à modifier, ${deletions.length} à supprimer.`);
if (!APPLY) {
  console.log("Simulation terminée — rien n'a été écrit.");
  process.exit(0);
}

for (const p of patches) {
  let tx = client.patch(p.id);
  if (p.set && Object.keys(p.set).length) tx = tx.set(p.set);
  if (p.unset?.length) tx = tx.unset(p.unset);
  await tx.commit();
  console.log(`✔ ${p.label}`);
}
for (const id of deletions) {
  await client.delete(id);
  console.log(`✔ supprimé ${id}`);
}
console.log("Terminé.");
