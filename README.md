# LaCDIA Website

Site institutionnel bilingue (FR/EN) pour LaCDIA, construit avec Next.js App Router et un CMS headless Sanity. Le site couvre les pages de recherche, publications, projets, ressources, solutions, etc., avec formulaires et newsletter. Les actualités sont intégrées directement à la page d'accueil (pas de page listing dédiée).

## Fonctionnalités

- Routing FR (défaut) / EN / HT (créole haïtien) avec préfixe de langue et cookie de préférence. Les clés `ht` manquantes retombent sur le français ; l'ES n'est plus supporté.
- Traductions UI statiques centralisées dans `src/messages/{fr,en}.json` (next-intl, un seul système de traduction) ; le contenu éditorial (pages, axes, actualités...) reste piloté par Sanity (`localeString`/`localeText`).
- SEO complet : metadata, Open Graph, sitemap et robots.
- Contenu hybride : contenu local (`src/content`) + contenu dynamique Sanity.
- Formulaires (collaborer/contact) : code conservé mais désactivé (pages retirées, coordonnées dans le footer) tant que Sanity/Resend ne sont pas configurés.
- Newsletter (inscription/désinscription) : abonnés stockés dans Sanity (`newsletterSubscriber`), email de confirmation de désinscription via Resend. Le formulaire de désinscription est toujours affiché sur `/newsletter`, indépendamment du contenu Sanity de la page.
- Analytics Matomo ou GA4, activés après consentement cookies.

## Notes opérationnelles

- **Actualités** : pas de page listing dédiée. `/actualites` (et ses variantes localisées) redirige vers l'accueil, où les actualités sont affichées directement. Les pages de détail (`/actualites/[slug]`, `/actualites/evenements/[slug]`) restent actives et sont liées depuis la home et d'autres contenus.
- **Équipe** : la page `/equipe` est temporairement masquée (redirection dans `next.config.ts`) en attendant une consolidation du contenu. Les fiches individuelles `/equipe/[slug]` restent actives (utilisées comme liens d'attribution dans publications, projets, événements, formations).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS (config dans `src/app/globals.css`)
- Sanity (client + queries dans `src/lib/sanity`)

## Structure du projet

- `src/app/[locale]/(site)` pages du site (arborescence active, préfixée par la locale)
- `src/app/api` endpoints (forms, newsletter, preview)
- `src/components` composants UI
- `src/content` contenu local (fallback)
- `src/data` données structurées (solutions)
- `src/lib` utilitaires (i18n, SEO, Sanity)
- `src/messages` catalogues de traduction next-intl (`fr.json`, `en.json`)
- `public` assets

## Variables d'environnement

Créez un fichier `.env.local` (ou variables d'environnement sur l'hébergeur) :

```
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sanity (lecture)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
# Alternatives côté serveur (optionnelles)
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_VERSION=2024-01-01

# Sanity (écriture, formulaires)
SANITY_API_TOKEN=your_sanity_write_token

# Preview
SANITY_PREVIEW_SECRET=your_preview_secret

# Resend (email transactionnel — notifications contact + confirmation desinscription)
MESSAGING_URL_RESEND_API_KEY=re_your_resend_key
MESSAGING_URL_RESEND_EMAIL_DOMAIN=esih.edu
CONTACT_NOTIFY_EMAIL=contact.lacdia@esih.edu

# Sécurité — secret de signature des liens de désinscription (HMAC),
# requis pour que POST /api/newsletter/unsubscribe fonctionne
UNSUBSCRIBE_TOKEN_SECRET=change_me_to_a_long_random_string

# Analytics (choisir Matomo ou GA4)
NEXT_PUBLIC_MATOMO_URL=https://analytics.example.org/
NEXT_PUBLIC_MATOMO_SITE_ID=1
# ou
NEXT_PUBLIC_GA4_ID=G-XXXXXXX
```

## Scripts

```
npm run dev
npm run build
npm run start
npm run lint
npm run check:routes
npm run sanity:seed
npm run translate:en
```

`check:routes` vérifie un ensemble de routes clefs. Il utilise `SITE_URL` ou `NEXT_PUBLIC_SITE_URL` et suppose que l'app tourne déjà.

`translate:en` traduit automatiquement les clés manquantes de `src/messages/fr.json` vers `en.json` (LibreTranslate par défaut, voir `scripts/auto-translate.mjs` pour Google/DeepL). Seul l'anglais est supporté par ce script.

## Sanity Studio & migration

- Le Studio est intégré dans l'app : lancer `npm run dev` puis ouvrir `/studio`.
- La commande `npm run sanity:seed` initialise un contenu de base (navigation, home, solutions, etc.). Elle requiert `SANITY_API_TOKEN`.
- Les collections publications, axes, ressources et formations sont à compléter dans le Studio si besoin.

## Endpoints API

- `POST /api/forms/submit` : enregistre une demande dans Sanity, envoie un email via Resend si `CONTACT_NOTIFY_EMAIL`/`MESSAGING_URL_RESEND_API_KEY` sont configurés.
- `POST /api/newsletter/subscribe` : inscription newsletter (abonnés stockés dans Sanity).
- `POST /api/newsletter/unsubscribe` : désinscription newsletter avec email de confirmation via Resend.
- `GET /api/preview?secret=...` : active le mode preview (Sanity).

## Déploiement

1. Installer les dépendances : `npm install`
2. Build : `npm run build`
3. Run : `npm run start`
4. Vérifier que les variables d'environnement sont présentes.

Le domaine `cdn.sanity.io` est déjà autorisé pour `next/image`.
