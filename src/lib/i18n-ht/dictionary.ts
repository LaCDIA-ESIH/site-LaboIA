import fr from "./fr.json";
import ht from "./ht.json";
import legalFr from "./legal-fr.json";
import legalHt from "./legal-ht.json";

/**
 * Dictionnaire français → créole du contenu éditorial Sanity.
 * Le CMS n'est saisi qu'en FR/EN : pour `ht`, tout texte français dont la
 * traduction est connue ici est remplacé à la lecture (voir sanityFetch). Un
 * texte absent du dictionnaire reste en français (repli sûr).
 * Les mêmes fichiers alimentent `npm run cms:translate-ht` (écriture dans le Studio).
 */
const dictionary = new Map<string, string>();
(fr as string[]).forEach((s, i) => dictionary.set(s, (ht as string[])[i]));
(legalFr as string[]).forEach((s, i) => dictionary.set(s, (legalHt as string[])[i]));

export function translateToHt(text: string): string {
  const exact = dictionary.get(text);
  if (exact !== undefined) return exact;
  // tolérance aux espaces de début/fin saisis dans le CMS
  const trimmed = text.trim();
  return trimmed !== text ? (dictionary.get(trimmed) ?? text) : text;
}
