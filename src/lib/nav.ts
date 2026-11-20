/**
 * Source de vérité unique pour ce qui, dans la navigation Sanity
 * (`navigation.mainNav`/`footerNav`), pointe vers une arborescence
 * définitivement retirée du site plutôt que vers une page active.
 *
 * Utilisé à la fois par `next.config.ts` (redirections serveur) et par
 * `Header`/`Footer` (filtrage de l'affichage) — un item de nav pointant
 * vers une page encore active (y compris une nouvelle `genericPage` créée
 * dans le Studio) n'est jamais filtré ici, il s'affiche automatiquement.
 */
export const REMOVED_NAV_TREES = [
  "equipe",
  "a-propos",
  "recherche",
  "lacdia-tech",
  "formation",
  "projets",
  "publications",
  "ressources",
  "contact",
  "collaborer",
] as const;

/**
 * Anciennes URLs qui redirigent encore vers une page active (renommage,
 * pas suppression) — remappées vers leur destination réelle plutôt que
 * filtrées, pour que le lien de nav pointe directement au bon endroit
 * au lieu de faire perdre un aller-retour de redirection à l'utilisateur.
 */
const LEGACY_HREF_REMAP: Record<string, string> = {
  "/solutions": "/axes-de-recherche",
  "/actualites": "/#actualites",
};

function firstSegment(href: string) {
  return href.replace(/^\/+/, "").split("/")[0] ?? "";
}

export function isRemovedNavHref(href: string) {
  return (REMOVED_NAV_TREES as readonly string[]).includes(firstSegment(href));
}

export function resolveNavHref(href: string) {
  return LEGACY_HREF_REMAP[href] ?? href;
}

export function resolveNavItems<T extends { href: string }>(items: T[]): (T & { href: string })[] {
  return items
    .filter((item) => !isRemovedNavHref(item.href))
    .map((item) => ({ ...item, href: resolveNavHref(item.href) }));
}

/**
 * Le menu Sanity peut manquer de libellés EN/HT (repli sur le français) : hors FR, les liens connus sont
 * relibellés depuis next-intl (`nav.*`) ; tout autre lien garde son libellé CMS.
 */
export function localizeNavLabel(
  href: string,
  label: string,
  locale: string,
  t: (key: "home" | "solutions" | "news") => string,
) {
  if (locale !== "ht") return label;
  if (href === "/") return t("home");
  if (href === "/axes-de-recherche") return t("solutions");
  if (href === "/#actualites") return t("news");
  return label;
}
