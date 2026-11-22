/**
 * Garde-fou de traduction : fr.json est la référence ; en.json et ht.json doivent
 * couvrir toutes les clés réellement utilisées. Échoue (code 1) sinon.
 *
 *   npm run i18n:check
 *
 * Les espaces de noms hérités (sans aucune référence dans le code) sont listés
 * dans LEGACY : ils ne sont pas exigés, mais ne doivent plus être utilisés sans
 * être traduits d'abord.
 */
import fs from "node:fs";
import path from "node:path";

const dir = path.resolve(process.cwd(), "src/messages");
const load = (l) => JSON.parse(fs.readFileSync(path.join(dir, `${l}.json`), "utf8"));
const fr = load("fr");

const LEGACY = [
  "about", "research", "tech", "partnerships", "values", "home.collaborateTitle", "home.collaborateBody",
  "home.heroDescription", "home.heroSecondaryCta", "home.techServices", "pages.contact", "pages.collaborer",
  "pages.departementScientifique", "pages.tech",
];

function flat(o, p = "", out = {}) {
  if (Array.isArray(o)) o.forEach((v, i) => flat(v, `${p}${i}.`, out));
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) flat(v, `${p}${k}.`, out);
  else out[p.slice(0, -1)] = o;
  return out;
}
const isLegacy = (k) => LEGACY.some((n) => k === n || k.startsWith(n + "."));
// identifiants, valeurs techniques et noms propres : identiques dans toutes les langues
const TECH = /(^|\.)(_id|key|status|slug\.current|icon|value|linkHref|date|href|phonePlaceholder)$/;

const ref = flat(fr);
let failed = false;
for (const l of ["en", "ht"]) {
  const t = flat(load(l));
  const missing = Object.keys(ref).filter((k) => !isLegacy(k) && !(k in t));
  // labLines : le découpage en segments diffère selon la langue (acronyme)
  const real = missing.filter((k) => !k.startsWith("home.hero.labLines"));
  if (real.length) {
    failed = true;
    console.error(`✖ ${l}.json : ${real.length} clé(s) manquante(s)`);
    real.slice(0, 40).forEach((k) => console.error("   - " + k));
  } else {
    console.log(`✔ ${l}.json : toutes les clés utilisées sont traduites`);
  }
  if (l === "ht") {
    const same = Object.keys(ref).filter(
      (k) => !isLegacy(k) && !TECH.test(k) && typeof ref[k] === "string" && ref[k].length > 12 && t[k] === ref[k],
    );
    if (same.length) {
      failed = true;
      console.error(`✖ ht.json : ${same.length} valeur(s) identique(s) au français (non traduites ?)`);
      same.slice(0, 20).forEach((k) => console.error("   - " + k));
    }
  }
}
process.exit(failed ? 1 : 0);
