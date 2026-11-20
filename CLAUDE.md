# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Site institutionnel multilingue (FR/EN) pour LaCDIA (labo de recherche IA), construit avec Next.js App Router et le CMS headless Sanity. Le contenu est hybride : Sanity CMS en source principale avec repli sur du contenu local statique quand Sanity n'est pas configuré.

## Commands

```bash
npm run dev              # Serveur de dev (Next.js)
npm run build            # Build de prod — utilise --webpack (pas Turbopack, malgré la config turbopack.root dans next.config.ts)
npm run start             # Lance le build de prod
npm run lint              # ESLint (flat config, eslint-config-next core-web-vitals + typescript)
npm run check:routes      # Ping un ensemble de routes clefs (nécessite que le serveur tourne ; utilise SITE_URL/NEXT_PUBLIC_SITE_URL)
npm run sanity:seed       # Seed initial du contenu Sanity (nav, home, solutions...) — nécessite SANITY_API_TOKEN
npm run translate         # Traduction auto FR→EN (scripts/auto-translate.mjs) — seul EN est supporté (ES/HT retirés)
npm run translate:en      # Idem, cible explicite
npm run sanity:seed-architecture  # Pré-remplit les champs d'architecture scientifique du homePage Sanity depuis fr.json/en.json — nécessite SANITY_API_TOKEN
```

Il n'y a pas de suite de tests configurée dans ce repo.

Sanity Studio est embarqué dans l'app Next.js : `npm run dev` puis ouvrir `/studio`.

## Architecture

### i18n — attention aux pièges

- Le fichier middleware s'appelle **`src/proxy.ts`** (pas `middleware.ts`) et enregistre `next-intl`'s `createMiddleware`.
- Les locales actives sont `fr` (défaut), `en` et `ht` (créole haïtien, réintroduit sur décision produit — l'ES reste retiré), définies dans `src/lib/i18n.ts` (`locales`). `src/i18n/request.ts` fusionne les messages `ht`/`en` sur `fr.json` : toute clé manquante retombe sur le français, aucune page ne casse. Le contenu Sanity n'est saisi qu'en FR/EN : pour `ht`, les requêtes GROQ retombent sur le FR et `sanityFetch` (`src/lib/sanity/client.ts`) réduit les objets `{fr,en}` bruts. Les chaînes éditoriales inline passent par `pick()` (`src/lib/i18n-pick.ts`), les dates par `formatDate()` (mois créoles). Les traductions `ht.json` sont à faire relire par un locuteur natif avant mise en prod.
- **Garantie de traduction `ht`** : `npm run i18n:check` (échoue si une clé utilisée manque en `en`/`ht`) ; contenu Sanity en créole traduit **à la lecture** (`sanityFetch` applique le dictionnaire `src/lib/i18n-ht/` aux textes français ; textes simples anglais dans `dictionary-en.ts`), et écrivable dans le Studio via `npm run cms:translate-ht` (dictionnaires `src/lib/i18n-ht/*.json`, simulation par défaut, `--apply` + `SANITY_API_TOKEN` pour écrire). Tout nouveau texte éditorial FR doit être ajouté à ces dictionnaires ou saisi dans le champ `ht` du Studio. Les pages légales en créole sont indicatives (le français fait foi) et à faire valider.
- Toute copie UI statique sans backing CMS (labels, aria-labels, contenu de repli des composants) doit passer par `next-intl` (`src/messages/{fr,en}.json` + `useTranslations`/`getTranslations`) — un seul système de traduction, pas de dictionnaire ad-hoc par composant. Le contenu éditorial (pages, axes, actualités...) reste piloté par Sanity (`localeString`/`localeText`).
- `localePrefix: "always"` — toute URL est préfixée (`/fr/...`, `/en/...`), `/` redirige vers `/fr`.
- Helpers de routing : `src/i18n/routing.ts`, `src/i18n/navigation.ts` (Link/redirect localisés), `src/i18n/request.ts` (config next-intl). `src/lib/i18n-server.ts` expose `getServerLocale()` pour les Server Components/Route Handlers.

### Routing — `src/app/[locale]/(site)/...` est la seule arborescence active

- L'ancienne arborescence dupliquée sans `[locale]` (`src/app/(site)/...`) a été supprimée (newsletter, solutions, actualites). Il ne reste que `src/app/(site)/equipe/page.tsx`, un stub qui ne fait que `redirect("/")` — gardé volontairement comme trace du pattern de masquage temporaire (voir ci-dessous), pas du code mort à nettoyer par erreur.
- `src/app/[locale]/(site)/[...slug]/page.tsx` est le catch-all générique : il résout un `genericPage` Sanity par slug et le rend via `PageBuilder` (`src/components/page-builder.tsx`), un renderer de blocs (`heroBlock`, `textImageBlock`, `featuresBlock`, `kpisBlock`, `ctaBlock`, `latestNewsBlock`...). Ce catch-all exclut explicitement `studio` et `api` en premier segment.
- **Le site a été volontairement réduit à 4 pages de navigation** (commit `380cf9d`, « réduire le site à 4 pages ») : Accueil, Solutions (`/axes-de-recherche` — l'ancienne URL `/solutions` fait un redirect 301 permanent, `getSolutionsPageData` dans `cms.ts` garde son nom d'origine), Actualités (intégrée à la home) — plus la route utilitaire `/newsletter` (désinscription, hors menu). Toutes les autres arborescences (`equipe`, `a-propos`, `recherche`, `lacdia-tech`, `formation`, `projets`, `publications`, `ressources`, `contact`, `collaborer`) ont été **supprimées du code** (pas seulement masquées) et redirigent vers l'accueil via la liste `removedTrees` dans `next.config.ts` — cette liste, pas de simples lignes isolées, est la source de vérité sur ce qui est actif. Les pages légales (`conditions-utilisation`, `confidentialite`, `cookies`, `mentions-legales`) restent des routes dédiées sous `src/app/[locale]/(site)/`.
- **`/equipe` n'a plus de fiches individuelles** : contrairement à un état antérieur du projet, il n'existe plus de route `/equipe/[slug]` — toute la présentation de l'équipe est repliée dans une section ancre (`#notre-equipe`) sur la home (`src/components/home/team.tsx`). Ne pas supposer que des liens d'attribution vers `/equipe/[slug]` fonctionnent encore.
- **`/actualites` (listing) est retiré définitivement** : `next.config.ts` redirige `/actualites`, `/fr/actualites`, `/en/actualites` vers l'accueil, où les actualités sont affichées directement (`ActualitesSection`). Les pages de détail (`/actualites/[slug]`, `/actualites/evenements/[slug]`) restent actives.
- **`/contact` et `/collaborer` sont retirés** (formulaires pas encore configurés) : redirigés vers l'accueil, et les coordonnées (e-mail, localisation, délai de réponse) sont dans le footer (`src/components/layout/footer.tsx`). Les composants `src/components/forms/*` et `POST /api/forms/submit` sont conservés mais n'ont plus aucune UI et l'API répond 410 (`FORMS_ENABLED` dans `route.ts`) : pour réactiver, recréer une page `contact` et retirer `contact`/`collaborer` de `REMOVED_NAV_TREES` (`src/lib/nav.ts`).

### Contenu hybride (Sanity + fallback local)

- `src/lib/sanity/client.ts` expose `isSanityConfigured` (vrai seulement si `NEXT_PUBLIC_SANITY_PROJECT_ID`/`SANITY_PROJECT_ID`, dataset et version d'API sont tous présents) et `sanityFetch(query, params, fallback)` qui **retourne `fallback` silencieusement si Sanity n'est pas configuré** — l'app doit donc rester fonctionnelle sans Sanity connecté.
- `src/lib/cms.ts` est le point d'entrée principal pour les pages : agrège les requêtes GROQ (`src/lib/sanity/queries.ts`) par page (`getSiteSettings`, `getNavigation`, `getHomeData`, `getSolutionsPageData`, ...) et retourne des objets « empty » typés quand Sanity est absent, jamais `null`/`undefined`.
- `src/lib/content-loader.ts` + `src/lib/content-types.ts` fournissent un contenu **local statique** (`src/content/*`) utilisé en repli/complément. `getArticles()` et consorts sont partiellement orphelins depuis la suppression de la page listing actualités — à vérifier avant de s'appuyer dessus.
- Il existe **deux clients Sanity distincts** : `src/lib/sanity/client.ts` (lecture, utilisé par `cms.ts`/les pages) et `src/sanity/lib/client.ts` (utilisé par le Studio / live preview sous `src/sanity/`). `src/lib/sanity/write-client.ts` gère les écritures (soumissions de formulaires).
- Le schéma Sanity complet est dans un seul fichier : `src/sanity/schemaTypes/index.ts` (~47 `defineType`). Les champs multilingues utilisent des objets `localeString`/`localeText`/`localeBlockContent` avec des clés `fr`/`en`.

### API routes

- `POST /api/forms/submit` — enregistre dans Sanity, notifie par email via Resend si `CONTACT_NOTIFY_EMAIL`/`MESSAGING_URL_RESEND_API_KEY` sont configurés (`src/lib/resend.ts`).
- `POST /api/newsletter/subscribe` / `POST /api/newsletter/unsubscribe` — abonnés stockés comme documents Sanity `newsletterSubscriber` (`src/lib/newsletter-subscribers.ts`), email de confirmation de désinscription via Resend. Le formulaire de désinscription (`NewsletterUnsubscribeForm`) est rendu **inconditionnellement** sur `/newsletter` (pas seulement si un éditeur configure une section CMS `formType: "unsubscribe"`) — fonctionnalité compliance-sensible, ne doit pas dépendre d'une config Sanity oubliée. La désinscription est en 2 étapes : `/api/newsletter/unsubscribe` envoie un lien signé (HMAC + expiration, `src/lib/unsubscribe-token.ts`), et `GET /api/newsletter/unsubscribe/confirm` vérifie ce jeton avant de désabonner réellement le document Sanity (voir audit pré-production, constats SEC-1/COMP-1).
- `GET /api/preview` — active le mode preview Sanity (`secret`).

### Déploiement

- **Vercel est l'unique cible de déploiement** (Netlify a été abandonné — `netlify.toml` supprimé — décision explicite pour ne plus avoir deux datasets Sanity divergents à maintenir).
- **Statistiques (Matomo / GA4)** : `AnalyticsScripts` ne charge rien sans consentement cookie (`lacdia_cookie_consent=accepted`) ET sans `NEXT_PUBLIC_MATOMO_URL` + `NEXT_PUBLIC_MATOMO_SITE_ID` (ou `NEXT_PUBLIC_GA4_ID`). Ces variables sont inlinées **au build** : les définir dans Vercel puis redéployer. `next.config.ts` lit aussi `NEXT_PUBLIC_MATOMO_URL` au build pour ajouter l'origine à la CSP (bloquante sur tout sauf `/studio`) — un Matomo hors `*.matomo.cloud` est donc autorisé automatiquement, mais seulement après redéploiement. Constaté le 2026-11-03 : non définies en prod (aucune stat collectée).
- `description` du site (`siteSettings`) : le schéma est `localeText` ({fr,en}) mais la donnée publiée était une chaîne FR. La requête lit `description[$locale]`, avec repli sur `footer.descriptionFallback` (next-intl) ; `npm run sanity:translate-description` (jeton d'écriture requis pour `--apply`) migre la valeur.
- **Un seul projet Sanity canonique : `fghn7rpw`** (dataset `production`), configuré dans `vercel.json`, `.env.local` et le dashboard Vercel (Project Settings → Environment Variables — c'est le dashboard qui fait foi en cas de divergence avec `vercel.json`). L'ancien projet `3rg8hwul` ("LaCDIA") existe toujours dans l'organisation Sanity mais n'est plus utilisé — ne pas y écrire, son contenu a divergé (nav, etc.) et il sera supprimé/archivé séparément.
- `next.config.ts` autorise déjà `cdn.sanity.io` pour `next/image` et transpile les packages `sanity`/`@sanity/ui`/`@sanity/icons`.

### Styling

Tailwind CSS v4, configuré via `src/app/globals.css` (pas de `tailwind.config` séparé attendu — vérifier ce fichier pour les tokens/thème avant d'ajouter des classes custom).

### Identité visuelle (refonte « papier & encre »)

- Palette unique dans `src/app/globals.css` (`:root`) : fond papier `--paper`, encre `--ink`, bleu `--haiti-blue` et rouge `--haiti-red` (couleurs du logo). Les anciens noms `--labo-*` / `--tech-*` sont conservés comme alias : ne pas réintroduire de couleurs en dur (ni teal/violet) — utiliser les variables. Titres en Fraunces (`--font-heading`), corps en Inter.
- Marque : `src/components/brand/lacdia-wordmark.tsx` (spirale `public/logo/lacdia-mark.png` + nom en texte) et `esih-mark.tsx` (institution porteuse). **Déposer le logo officiel ESIH dans `public/logo/esih.svg`** : il remplace automatiquement le repli typographique « ESIH » (header, footer, bandeau institution).
- Le réseau neuronal animé et le bandeau défilant ont été supprimés volontairement (look « IA générique »).
