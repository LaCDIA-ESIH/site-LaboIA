import { defineField, defineType } from "sanity";

const blockContent = defineType({
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [{ title: "Bullet", value: "bullet" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "URL",
                validation: (Rule) =>
                  Rule.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
              defineField({ name: "blank", type: "boolean", title: "Open in new tab" }),
            ],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
  ],
});

const localeString = defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "fr", type: "string", title: "FR" }),
    defineField({ name: "en", type: "string", title: "EN" }),
    defineField({ name: "ht", type: "string", title: "HT (Kreyòl)" }),
  ],
});

const localeText = defineType({
  name: "localeText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({ name: "fr", type: "text", rows: 4, title: "FR" }),
    defineField({ name: "en", type: "text", rows: 4, title: "EN" }),
    defineField({ name: "ht", type: "text", rows: 4, title: "HT (Kreyòl)" }),
  ],
});

const localeBlockContent = defineType({
  name: "localeBlockContent",
  title: "Localized Block Content",
  type: "object",
  fields: [
    defineField({ name: "fr", type: "blockContent", title: "FR" }),
    defineField({ name: "en", type: "blockContent", title: "EN" }),
    defineField({ name: "ht", type: "blockContent", title: "HT (Kreyòl)" }),
  ],
});

const localeStringList = defineType({
  name: "localeStringList",
  title: "Localized String List",
  type: "object",
  fields: [
    defineField({ name: "fr", type: "array", of: [{ type: "string" }], title: "FR" }),
    defineField({ name: "en", type: "array", of: [{ type: "string" }], title: "EN" }),
    defineField({ name: "ht", type: "array", of: [{ type: "string" }], title: "HT (Kreyòl)" }),
  ],
});

const navItem = defineType({
  name: "navItem",
  title: "Navigation Item",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", title: "Label", validation: (Rule) => Rule.required() }),
    defineField({ name: "labelIntl", type: "localeString", title: "Label (i18n)" }),
    defineField({ name: "href", type: "string", title: "Href", validation: (Rule) => Rule.required() }),
  ],
});

const linkAction = defineType({
  name: "linkAction",
  title: "Link Action",
  type: "object",
  fields: [
    defineField({ name: "label", type: "string", title: "Label" }),
    defineField({ name: "labelIntl", type: "localeString", title: "Label (i18n)" }),
    defineField({ name: "href", type: "string", title: "Href" }),
    defineField({
      name: "variant",
      type: "string",
      title: "Variant",
      options: {
        list: [
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Tertiary", value: "tertiary" },
        ],
      },
    }),
  ],
});

const teamCategoryItem = defineType({
  name: "teamCategoryItem",
  title: "Team Category Item",
  type: "object",
  fields: [
    defineField({ name: "badge", type: "localeString", title: "Badge (ex: \"2 chercheurs · HDR\")" }),
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "description", type: "localeText", title: "Description" }),
    defineField({
      name: "linkLabel",
      type: "localeString",
      title: "Link label (optional)",
      description: "Mot ou expression exact(e), présent dans la description, à transformer en lien (ex: \"ESIH\").",
    }),
    defineField({ name: "linkHref", type: "url", title: "Link URL (optional)" }),
  ],
  preview: {
    select: { title: "title.fr", subtitle: "badge.fr" },
  },
});

const teamStatItem = defineType({
  name: "teamStatItem",
  title: "Team Stat Item",
  type: "object",
  fields: [
    defineField({ name: "value", type: "string", title: "Value (ex: \"11\")" }),
    defineField({ name: "label", type: "localeString", title: "Label" }),
  ],
  preview: {
    select: { title: "value", subtitle: "label.fr" },
  },
});

const highlightItem = defineType({
  name: "highlightItem",
  title: "Highlight Item",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "titleIntl", type: "localeString", title: "Title (i18n)" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "descriptionIntl", type: "localeText", title: "Description (i18n)" }),
  ],
});

const missionItem = defineType({
  name: "missionItem",
  title: "Mission Item",
  type: "object",
  description: "Un item de la liste des missions. Le champ icône est optionnel (laissez vide pour conserver l'icône par défaut).",
  fields: [
    defineField({
      name: "text",
      type: "localeText",
      title: "Texte de la mission",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "text.fr" },
  },
});

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Meta title",
      type: "localeString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Meta description",
      type: "localeText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "keywords", title: "Keywords", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "canonicalUrl", title: "Canonical URL", type: "url" }),
    defineField({
      name: "openGraphTitle",
      title: "Open Graph title",
      type: "localeString",
    }),
    defineField({
      name: "openGraphDescription",
      title: "Open Graph description",
      type: "localeText",
    }),
    defineField({
      name: "openGraphImage",
      title: "Open Graph image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({ name: "noIndex", title: "No index", type: "boolean", initialValue: false }),
    defineField({ name: "noFollow", title: "No follow", type: "boolean", initialValue: false }),
  ],
});

const pageCard = defineType({
  name: "pageCard",
  title: "Page Card",
  type: "object",
  fields: [
    defineField({ name: "icon", title: "Icon or short marker", type: "string" }),
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "titleIntl", type: "localeString", title: "Title (i18n)" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "descriptionIntl", type: "localeText", title: "Description (i18n)" }),
    defineField({ name: "label", type: "string", title: "Small label" }),
    defineField({ name: "labelIntl", type: "localeString", title: "Small label (i18n)" }),
    defineField({ name: "href", type: "string", title: "Link" }),
    defineField({ name: "items", type: "array", title: "List items", of: [{ type: "string" }] }),
  ],
  preview: {
    select: { title: "title", subtitle: "description", media: "icon" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Card", subtitle, media };
    },
  },
});

const tableRow = defineType({
  name: "tableRow",
  title: "Table row",
  type: "object",
  fields: [
    defineField({ name: "cells", type: "array", title: "Cells", of: [{ type: "string" }] }),
  ],
});

const pageSection = defineType({
  name: "pageSection",
  title: "Editable Page Section",
  type: "object",
  fields: [
    defineField({
      name: "variant",
      title: "Visual variant",
      type: "string",
      initialValue: "white",
      options: {
        list: [
          { title: "Hero dark", value: "heroDark" },
          { title: "White", value: "white" },
          { title: "Light", value: "light" },
          { title: "CTA dark", value: "ctaDark" },
        ],
      },
    }),
    defineField({
      name: "layout",
      title: "Layout",
      type: "string",
      initialValue: "content",
      options: {
        list: [
          { title: "Content", value: "content" },
          { title: "Card grid", value: "cards" },
          { title: "Compact pills", value: "pills" },
          { title: "Table", value: "table" },
          { title: "Form", value: "form" },
        ],
      },
    }),
    defineField({ name: "anchor", type: "string", title: "Anchor ID" }),
    defineField({ name: "eyebrow", type: "localeString", title: "Eyebrow / badge" }),
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "intro", type: "localeText", title: "Intro" }),
    defineField({ name: "body", type: "blockContent", title: "Body" }),
    defineField({ name: "bodyIntl", type: "localeBlockContent", title: "Body (i18n)" }),
    defineField({ name: "cards", type: "array", title: "Cards", of: [{ type: "pageCard" }] }),
    defineField({ name: "actions", type: "array", title: "Buttons", of: [{ type: "linkAction" }] }),
    defineField({ name: "tableHeaders", type: "array", title: "Table headers", of: [{ type: "string" }] }),
    defineField({ name: "tableRows", type: "array", title: "Table rows", of: [{ type: "tableRow" }] }),
    defineField({
      name: "formType",
      title: "Form to render",
      type: "string",
      options: {
        list: [
          { title: "Contact", value: "contact" },
          { title: "Collaboration", value: "collaborate" },
          { title: "Newsletter", value: "newsletter" },
          { title: "Newsletter unsubscribe", value: "unsubscribe" },
        ],
      },
    }),
  ],
  preview: {
    select: { title: "title.fr", subtitle: "layout" },
    prepare({ title, subtitle }) {
      return { title: title || "Editable section", subtitle };
    },
  },
});

const formCopy = defineType({
  name: "formCopy",
  title: "Form copy",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Form title" }),
    defineField({ name: "subtitle", type: "localeText", title: "Form subtitle" }),
    defineField({ name: "fullNameLabel", type: "localeString", title: "Full name label" }),
    defineField({ name: "fullNamePlaceholder", type: "localeString", title: "Full name placeholder" }),
    defineField({ name: "emailLabel", type: "localeString", title: "Email label" }),
    defineField({ name: "emailPlaceholder", type: "localeString", title: "Email placeholder" }),
    defineField({ name: "organizationLabel", type: "localeString", title: "Organization label" }),
    defineField({ name: "organizationPlaceholder", type: "localeString", title: "Organization placeholder" }),
    defineField({ name: "subjectLabel", type: "localeString", title: "Subject label" }),
    defineField({ name: "subjectPlaceholder", type: "localeString", title: "Subject placeholder" }),
    defineField({ name: "messageLabel", type: "localeString", title: "Message label" }),
    defineField({ name: "messagePlaceholder", type: "localeString", title: "Message placeholder" }),
    defineField({ name: "consentText", type: "localeText", title: "Consent text before privacy link" }),
    defineField({ name: "privacyLabel", type: "localeString", title: "Privacy link label" }),
    defineField({ name: "privacyHref", type: "string", title: "Privacy link" }),
    defineField({ name: "submitLabel", type: "localeString", title: "Submit button" }),
    defineField({ name: "loadingLabel", type: "localeString", title: "Loading button" }),
    defineField({ name: "successMessage", type: "localeText", title: "Success message" }),
    defineField({ name: "errorMessage", type: "localeText", title: "Error message" }),
  ],
});

const formSettings = defineType({
  name: "formSettings",
  title: "Form Settings",
  type: "document",
  fields: [
    defineField({ name: "contact", type: "formCopy", title: "Contact form" }),
    defineField({ name: "collaborate", type: "formCopy", title: "Collaboration form" }),
    defineField({ name: "newsletter", type: "formCopy", title: "Newsletter form" }),
    defineField({ name: "unsubscribe", type: "formCopy", title: "Newsletter unsubscribe form" }),
  ],
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", title: "Site name", validation: (Rule) => Rule.required() }),
    defineField({ name: "shortName", type: "string", title: "Short name", validation: (Rule) => Rule.required() }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "tagline", type: "string", title: "Tagline" }),
    defineField({ name: "taglineIntl", type: "localeString", title: "Tagline (i18n)" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "object",
      fields: [
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({
      name: "banner",
      title: "Banner",
      type: "object",
      fields: [
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
    defineField({ name: "footerContactTitle", type: "string", title: "Footer contact title" }),
    defineField({ name: "footerContactTitleIntl", type: "localeString", title: "Footer contact title (i18n)" }),
    defineField({ name: "footerContactText", type: "text", title: "Footer contact text" }),
    defineField({ name: "footerContactTextIntl", type: "localeText", title: "Footer contact text (i18n)" }),
    defineField({ name: "footerContactCtaLabel", type: "string", title: "Footer contact CTA label" }),
    defineField({ name: "footerContactCtaLabelIntl", type: "localeString", title: "Footer contact CTA label (i18n)" }),
    defineField({ name: "footerContactCtaHref", type: "string", title: "Footer contact CTA href" }),
    defineField({ name: "footerCopyrightText", type: "string", title: "Footer copyright text" }),
    defineField({ name: "footerCopyrightTextIntl", type: "localeString", title: "Footer copyright text (i18n)" }),
    defineField({ name: "cookieTitle", type: "string", title: "Cookie banner title" }),
    defineField({ name: "cookieTitleIntl", type: "localeString", title: "Cookie banner title (i18n)" }),
    defineField({ name: "cookieMessage", type: "text", title: "Cookie banner message" }),
    defineField({ name: "cookieMessageIntl", type: "localeText", title: "Cookie banner message (i18n)" }),
    defineField({ name: "cookiePolicyLabel", type: "string", title: "Cookie policy link label" }),
    defineField({ name: "cookiePolicyLabelIntl", type: "localeString", title: "Cookie policy link label (i18n)" }),
    defineField({ name: "cookiePolicyHref", type: "string", title: "Cookie policy link" }),
    defineField({ name: "cookieAcceptLabel", type: "string", title: "Cookie accept button" }),
    defineField({ name: "cookieAcceptLabelIntl", type: "localeString", title: "Cookie accept button (i18n)" }),
    defineField({ name: "cookieRejectLabel", type: "string", title: "Cookie reject button" }),
    defineField({ name: "cookieRejectLabelIntl", type: "localeString", title: "Cookie reject button (i18n)" }),
  ],
});

const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "mainNav", type: "array", of: [{ type: "navItem" }] }),
    defineField({ name: "footerNav", type: "array", of: [{ type: "navItem" }] }),
  ],
});

const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", type: "localeString", title: "Hero badge" }),
    defineField({
      name: "heroSubtitle",
      type: "localeText",
      title: "Hero subtitle",
      description: "Sous-titre affiché sous le titre du hero de l'accueil.",
    }),
    defineField({
      name: "heroTitleLine1",
      type: "localeString",
      title: "Titre hero — ligne 1 (override optionnel)",
      description: "Laisser vide pour garder le titre de design par défaut (4 lignes codées dans le composant Hero). Si rempli, remplace uniquement cette ligne — la ligne 3 garde son style italique/dégradé quel que soit le texte saisi.",
    }),
    defineField({ name: "heroTitleLine2", type: "localeString", title: "Titre hero — ligne 2 (override optionnel)" }),
    defineField({ name: "heroTitleLine3", type: "localeString", title: "Titre hero — ligne 3, style accent (override optionnel)" }),
    defineField({ name: "heroTitleLine4", type: "localeString", title: "Titre hero — ligne 4 (override optionnel)" }),
    defineField({ name: "heroActions", type: "array", of: [{ type: "linkAction" }] }),
    defineField({ name: "introEyebrow", type: "localeString", title: "Intro eyebrow" }),
    defineField({ name: "introTitle", type: "localeString", title: "Vision — titre (grand h2)" }),
    defineField({ name: "introBody", type: "localeText", title: "Vision — corps (paragraphe)" }),
    defineField({ name: "introActions", type: "array", of: [{ type: "linkAction" }] }),
    defineField({
      name: "missionItems",
      type: "array",
      of: [{ type: "missionItem" }],
      title: "Mission — items (6 axes de mission)",
      description: "Si vide, le contenu par défaut est utilisé. Remplis-en 6 pour remplacer intégralement la liste.",
    }),
    defineField({ name: "highlightsTitle", type: "localeString", title: "Highlights title" }),
    defineField({ name: "highlightsIntro", type: "localeText", title: "Highlights intro" }),
    defineField({ name: "highlights", type: "array", of: [{ type: "highlightItem" }] }),

    // ── Architecture scientifique — Axe 1 ──────────────────────────────
    defineField({ name: "axe1Title", type: "localeString", title: "Axe 1 — Titre" }),
    defineField({ name: "axe1Description", type: "localeText", title: "Axe 1 — Description" }),
    defineField({
      name: "axe1Keywords",
      type: "localeText",
      title: "Axe 1 — Mots-clés (séparés par ·)",
      description: "Ex: Apprentissage automatique · Robustesse · Incertitude",
    }),
    defineField({
      name: "axe1Objectives",
      type: "localeText",
      title: "Axe 1 — Objectifs (séparés par ·)",
      description: "Ex: Concevoir des modèles robustes · Formaliser l'incertitude",
    }),

    // ── Architecture scientifique — Axe 2 ──────────────────────────────
    defineField({ name: "axe2Title", type: "localeString", title: "Axe 2 — Titre" }),
    defineField({ name: "axe2Description", type: "localeText", title: "Axe 2 — Description" }),
    defineField({
      name: "axe2Keywords",
      type: "localeText",
      title: "Axe 2 — Mots-clés (séparés par ·)",
      description: "Ex: Données complexes · Systèmes réels · Haïti",
    }),
    defineField({
      name: "axe2Objectives",
      type: "localeText",
      title: "Axe 2 — Objectifs (séparés par ·)",
      description: "Ex: Développer des outils pour l'agriculture · Soutenir la santé publique",
    }),

    // ── Pôle de valorisation ────────────────────────────────────────────
    defineField({ name: "poleTitle", type: "localeString", title: "Pôle — Titre" }),
    defineField({ name: "poleDescription", type: "localeText", title: "Pôle — Description" }),
    defineField({
      name: "poleSectors",
      type: "localeText",
      title: "Pôle — Secteurs d'application (séparés par ·)",
      description: "Ex: Agriculture · Santé · Services publics · Formation",
    }),
    defineField({ name: "poleNote", type: "localeText", title: "Pôle — Note de bas de carte" }),

    // ── Éthique transversale ────────────────────────────────────────────
    defineField({ name: "ethicsTitle", type: "localeString", title: "Éthique — Titre" }),
    defineField({ name: "ethicsText", type: "localeText", title: "Éthique — Texte" }),
    defineField({ name: "kpisTitle", type: "localeString", title: "KPIs title" }),
    defineField({ name: "kpisIntro", type: "localeText", title: "KPIs intro" }),
    defineField({ name: "teamSectionLabel", type: "localeString", title: "Team section label" }),
    defineField({ name: "teamTitle", type: "localeString", title: "Team title" }),
    defineField({ name: "teamIntro", type: "localeText", title: "Team intro" }),
    defineField({ name: "teamNote", type: "localeText", title: "Team note" }),
    defineField({ name: "teamCategories", type: "array", of: [{ type: "teamCategoryItem" }], title: "Team categories" }),
    defineField({ name: "teamStats", type: "array", of: [{ type: "teamStatItem" }], title: "Team stats" }),
    defineField({ name: "publicationsTitle", type: "localeString", title: "Publications title" }),
    defineField({ name: "publicationsIntro", type: "localeText", title: "Publications intro" }),
    defineField({ name: "partnersTitle", type: "localeString", title: "Partners title" }),
    defineField({ name: "partnersIntro", type: "localeText", title: "Partners intro" }),
    defineField({ name: "partnersBadge", type: "localeString", title: "Partners badge" }),
    defineField({ name: "collaborateTitle", type: "localeString", title: "Collaborate title" }),
    defineField({ name: "collaborateBody", type: "localeText", title: "Collaborate body" }),
    defineField({ name: "collaborateActions", type: "array", of: [{ type: "linkAction" }] }),
    defineField({ name: "seo", type: "seo", title: "SEO" }),
  ],
});

const kpi = defineType({
  name: "kpi",
  title: "KPI",
  type: "document",
  description:
    "Seuls les 4 premiers KPI (ordre de publication) sont affiches sur la mise en page bento de la page d'accueil.",
  fields: [
    defineField({ name: "key", type: "string", title: "Key" }),
    defineField({ name: "label", type: "string", title: "Label" }),
    defineField({ name: "labelIntl", type: "localeString", title: "Label (i18n)" }),
    defineField({ name: "value", type: "string", title: "Value" }),
    defineField({ name: "note", type: "text", title: "Note" }),
    defineField({ name: "noteIntl", type: "localeText", title: "Note (i18n)" }),
    defineField({
      name: "status",
      type: "string",
      title: "Status",
      options: {
        list: [
          { title: "Draft", value: "draft" },
          { title: "Confirmed", value: "confirmed" },
        ],
      },
    }),
  ],
});

const kpiSettings = defineType({
  name: "kpiSettings",
  title: "KPI Settings",
  type: "document",
  fields: [
    defineField({ name: "lastUpdated", type: "string", title: "Last updated" }),
    defineField({ name: "lastUpdatedIntl", type: "localeString", title: "Last updated (i18n)" }),
    defineField({ name: "disclaimer", type: "string", title: "Disclaimer" }),
    defineField({ name: "disclaimerIntl", type: "localeString", title: "Disclaimer (i18n)" }),
  ],
});

const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "projectType", type: "string" }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "shortDescription", type: "text" }),
    defineField({ name: "shortDescriptionIntl", type: "localeText" }),
    defineField({ name: "statusLabel", type: "string", title: "Project status label" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "featured", type: "boolean" }),
    defineField({ name: "objectives", type: "blockContent" }),
    defineField({ name: "objectivesIntl", type: "localeBlockContent" }),
    defineField({ name: "methods", type: "blockContent" }),
    defineField({ name: "methodsIntl", type: "localeBlockContent" }),
    defineField({ name: "results", type: "blockContent" }),
    defineField({ name: "resultsIntl", type: "localeBlockContent" }),
    defineField({ name: "members", type: "array", of: [{ type: "reference", to: [{ type: "member" }] }] }),
    defineField({ name: "partners", type: "array", of: [{ type: "reference", to: [{ type: "partner" }] }] }),
    defineField({ name: "publications", type: "array", of: [{ type: "reference", to: [{ type: "publication" }] }] }),
  ],
});

const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "publicationType", type: "string" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "doi", type: "string" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "pdf", type: "file" }),
    defineField({ name: "bibtex", type: "text" }),
    defineField({ name: "authors", type: "array", of: [{ type: "reference", to: [{ type: "member" }] }] }),
    defineField({ name: "externalAuthors", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "axes", type: "array", of: [{ type: "reference", to: [{ type: "researchAxis" }] }] }),
    defineField({ name: "resources", type: "array", of: [{ type: "reference", to: [{ type: "resource" }] }] }),
  ],
});

const news = defineType({
  name: "news",
  title: "News",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "date", type: "date" }),
    defineField({
      name: "category",
      type: "string",
      title: "Category (clé interne)",
      description: "Clé stable utilisée pour le code couleur des badges — ne change pas selon la langue. Le libellé affiché aux visiteurs vient de categoryIntl si rempli, sinon de ce champ tel quel.",
    }),
    defineField({ name: "categoryIntl", type: "localeString", title: "Category — libellé affiché (i18n, optionnel)" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "content", type: "blockContent" }),
    defineField({ name: "contentIntl", type: "localeBlockContent" }),
    defineField({
      name: "mainImage",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string" })],
    }),
    defineField({ name: "sourceUrl", type: "url" }),
    defineField({ name: "featured", type: "boolean" }),
    defineField({ name: "relatedProjects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "relatedMembers", type: "array", of: [{ type: "reference", to: [{ type: "member" }] }] }),
  ],
});

const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "visibility", type: "string", options: { list: ["public", "internal"] } }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "eventType", type: "string" }),
    defineField({ name: "startDate", type: "datetime" }),
    defineField({ name: "endDate", type: "datetime" }),
    defineField({ name: "location", type: "string" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "content", type: "blockContent" }),
    defineField({ name: "contentIntl", type: "localeBlockContent" }),
    defineField({ name: "registrationUrl", type: "url" }),
    defineField({ name: "speakers", type: "array", of: [{ type: "reference", to: [{ type: "member" }] }] }),
  ],
});

const partner = defineType({
  name: "partner",
  title: "Partner",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "nameIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "name" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "name" } }),
        defineField({ name: "en", type: "slug", options: { source: "name" } }),
      ],
    }),
    defineField({ name: "partnerType", type: "string" }),
    defineField({ name: "shortDescription", type: "text" }),
    defineField({ name: "shortDescriptionIntl", type: "localeText" }),
    defineField({ name: "website", type: "url" }),
    defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "featured", type: "boolean" }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "object",
      fields: [
        defineField({ name: "image", type: "image", options: { hotspot: true } }),
        defineField({ name: "alt", type: "string", title: "Alt text" }),
      ],
    }),
  ],
});

const offer = defineType({
  name: "offer",
  title: "Offer",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "offerType", type: "string" }),
    defineField({ name: "openDate", type: "date" }),
    defineField({ name: "closeDate", type: "date" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
  ],
});

const program = defineType({
  name: "program",
  title: "Program",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "programType", type: "string" }),
    defineField({ name: "startDate", type: "date" }),
    defineField({ name: "endDate", type: "date" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "content", type: "blockContent" }),
    defineField({ name: "contentIntl", type: "localeBlockContent" }),
    defineField({ name: "members", type: "array", of: [{ type: "reference", to: [{ type: "member" }] }] }),
  ],
});

const researchAxis = defineType({
  name: "researchAxis",
  title: "Research Axis",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "content", type: "blockContent" }),
    defineField({ name: "contentIntl", type: "localeBlockContent" }),
    defineField({ name: "projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "publications", type: "array", of: [{ type: "reference", to: [{ type: "publication" }] }] }),
  ],
});

const resource = defineType({
  name: "resource",
  title: "Resource",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "resourceType", type: "string" }),
    defineField({ name: "date", type: "date" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "file", type: "file" }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "publications", type: "array", of: [{ type: "reference", to: [{ type: "publication" }] }] }),
    defineField({ name: "projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
  ],
});

const institutionalPage = defineType({
  name: "institutionalPage",
  title: "Institutional Page",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "heroBadge", title: "Hero badge (eyebrow au-dessus du titre)", type: "string" }),
    defineField({ name: "heroBadgeIntl", title: "Hero badge (i18n)", type: "localeString" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "content", type: "blockContent" }),
    defineField({ name: "contentIntl", type: "localeBlockContent" }),
    defineField({ name: "sections", type: "array", title: "Editable sections", of: [{ type: "pageSection" }] }),
    defineField({
      name: "ctaLabel",
      title: "CTA label (bas de page)",
      type: "string",
    }),
    defineField({ name: "ctaLabelIntl", type: "localeString" }),
    defineField({ name: "ctaHref", title: "CTA URL", type: "string" }),
    defineField({ name: "seo", type: "seo", title: "SEO" }),
  ],
});

const member = defineType({
  name: "member",
  title: "Member",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "fullName", type: "string" }),
    defineField({ name: "slug", type: "slug", options: { source: "fullName" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "fullName" } }),
        defineField({ name: "en", type: "slug", options: { source: "fullName" } }),
      ],
    }),
    defineField({ name: "role", type: "string" }),
    defineField({ name: "affiliation", type: "string" }),
    defineField({ name: "bio", type: "text" }),
    defineField({ name: "bioIntl", type: "localeText" }),
    defineField({ name: "expertise", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "links",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "scholar", type: "url" }),
        defineField({ name: "orcid", type: "url" }),
        defineField({ name: "website", type: "url" }),
      ],
    }),
    defineField({ name: "projects", type: "array", of: [{ type: "reference", to: [{ type: "project" }] }] }),
    defineField({ name: "publications", type: "array", of: [{ type: "reference", to: [{ type: "publication" }] }] }),
  ],
});

const person = defineType({
  name: "person",
  title: "Person (Team)",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "roleTitle", type: "string" }),
    defineField({ name: "roleCategory", type: "string" }),
    defineField({ name: "shortBio", type: "text" }),
    defineField({ name: "longBio", type: "text" }),
    defineField({ name: "affiliation", type: "string" }),
    defineField({
      name: "teamGroup",
      type: "string",
      options: { list: ["research", "associate"] },
    }),
    defineField({ name: "expertise", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "links",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string" }),
        defineField({ name: "linkedin", type: "url" }),
        defineField({ name: "scholar", type: "url" }),
        defineField({ name: "orcid", type: "url" }),
        defineField({ name: "website", type: "url" }),
      ],
    }),
    defineField({ name: "contribution", type: "text" }),
    defineField({ name: "order", type: "number" }),
  ],
});

const teamPage = defineType({
  name: "teamPage",
  title: "Team Page",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "intro", type: "blockContent" }),
    defineField({ name: "introIntl", type: "localeBlockContent" }),
    defineField({ name: "researchSectionTitle", type: "string" }),
    defineField({ name: "researchSectionTitleIntl", type: "localeString" }),
    defineField({ name: "associatesSectionTitle", type: "string" }),
    defineField({ name: "associatesSectionTitleIntl", type: "localeString" }),
    defineField({ name: "readMoreLabel", type: "string" }),
    defineField({ name: "readMoreLabelIntl", type: "localeString" }),
    defineField({ name: "associateBadgeLabel", type: "string" }),
    defineField({ name: "associateBadgeLabelIntl", type: "localeString" }),
    defineField({ name: "emptyResearchText", type: "string" }),
    defineField({ name: "emptyResearchTextIntl", type: "localeString" }),
    defineField({ name: "emptyAssociatesText", type: "string" }),
    defineField({ name: "emptyAssociatesTextIntl", type: "localeString" }),
  ],
});

const resourcePage = defineType({
  name: "resourcePage",
  title: "Resource Page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
  ],
});

const labReport = defineType({
  name: "labReport",
  title: "Lab Report",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string", options: { list: ["draft", "published"] } }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({ name: "year", type: "number" }),
    defineField({ name: "summary", type: "text" }),
    defineField({ name: "summaryIntl", type: "localeText" }),
    defineField({ name: "file", type: "file" }),
    defineField({ name: "url", type: "url" }),
  ],
});

const formSubmission = defineType({
  name: "formSubmission",
  title: "Form Submission",
  type: "document",
  fields: [
    defineField({ name: "status", type: "string" }),
    defineField({
      name: "statusHistory",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "status", type: "string" }),
            defineField({ name: "note", type: "string" }),
            defineField({ name: "changedAt", type: "datetime" }),
          ],
        },
      ],
    }),
    defineField({ name: "formType", type: "string" }),
    defineField({ name: "fullName", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "organization", type: "string" }),
    defineField({ name: "subject", type: "string" }),
    defineField({ name: "message", type: "text" }),
    defineField({ name: "consent", type: "boolean" }),
    defineField({ name: "createdAt", type: "datetime" }),
    defineField({ name: "updatedAt", type: "datetime" }),
  ],
});

const newsletterSubscriber = defineType({
  name: "newsletterSubscriber",
  title: "Newsletter Subscriber",
  type: "document",
  fields: [
    defineField({ name: "email", type: "string" }),
    defineField({ name: "status", type: "string" }),
    defineField({ name: "subscribedAt", type: "datetime" }),
    defineField({ name: "unsubscribedAt", type: "datetime" }),
  ],
});

const aiSolution = defineType({
  name: "aiSolution",
  title: "AI Solution",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "shortDescription", type: "text" }),
    defineField({ name: "shortDescriptionIntl", type: "localeText" }),
    defineField({ name: "benefits", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "examples", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "icon", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

const useCase = defineType({
  name: "useCase",
  title: "Use Case",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleIntl", type: "localeString" }),
    defineField({ name: "context", type: "text" }),
    defineField({ name: "contextIntl", type: "localeText" }),
    defineField({ name: "solution", type: "text" }),
    defineField({ name: "solutionIntl", type: "localeText" }),
    defineField({ name: "benefits", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "benefitsIntl", type: "localeStringList" }),
    defineField({ name: "order", type: "number" }),
  ],
});

const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "nameIntl", type: "localeString" }),
    defineField({ name: "icon", type: "string" }),
    defineField({ name: "order", type: "number" }),
  ],
});

const solutionsPage = defineType({
  name: "solutionsPage",
  title: "Solutions Page",
  type: "document",
  fields: [
    defineField({ name: "heroBadge", type: "localeString" }),
    defineField({ name: "heroTitle", type: "localeString" }),
    defineField({ name: "heroSubtitle", type: "localeText" }),
    defineField({ name: "heroDescription", type: "localeText" }),
    defineField({ name: "heroPrimaryCta", type: "linkAction" }),
    defineField({ name: "heroSecondaryCta", type: "linkAction" }),
    defineField({ name: "approachTitle", type: "localeString" }),
    defineField({ name: "approachIntro", type: "localeText" }),
    defineField({
      name: "approachSteps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", type: "string" }),
            defineField({ name: "titleIntl", type: "localeString" }),
            defineField({ name: "description", type: "text" }),
            defineField({ name: "descriptionIntl", type: "localeText" }),
          ],
        },
      ],
    }),
    defineField({ name: "solutionsTitle", type: "localeString" }),
    defineField({ name: "solutionsIntro", type: "localeText" }),
    defineField({ name: "solutions", type: "array", of: [{ type: "reference", to: [{ type: "aiSolution" }] }] }),
    defineField({ name: "useCasesTitle", type: "localeString" }),
    defineField({ name: "useCasesIntro", type: "localeText" }),
    defineField({ name: "featuredUseCase", type: "reference", to: [{ type: "useCase" }] }),
    defineField({ name: "flowTitle", type: "localeString" }),
    defineField({ name: "flowDescription", type: "localeText" }),
    defineField({ name: "flowSteps", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "flowStepsIntl", type: "localeStringList" }),
    defineField({ name: "servicesTitle", type: "localeString" }),
    defineField({ name: "servicesIntro", type: "localeText" }),
    defineField({ name: "services", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "sectorsTitle", type: "localeString" }),
    defineField({ name: "sectorsIntro", type: "localeText" }),
    defineField({ name: "sectors", type: "array", of: [{ type: "reference", to: [{ type: "sector" }] }] }),
    defineField({ name: "projectsTitle", type: "localeString" }),
    defineField({ name: "projectsIntro", type: "localeText" }),
    defineField({ name: "seo", type: "seo", title: "SEO" }),
  ],
});

const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero Block",
  type: "object",
  fields: [
    defineField({ name: "badge", type: "localeString", title: "Badge (Eyebrow)" }),
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "description", type: "localeText", title: "Description" }),
    defineField({ name: "actions", type: "array", of: [{ type: "linkAction" }], title: "Actions" }),
  ],
});

const textImageBlock = defineType({
  name: "textImageBlock",
  title: "Text & Image Block",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "content", type: "localeBlockContent", title: "Content" }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string" })],
      title: "Image",
    }),
    defineField({
      name: "imagePosition",
      type: "string",
      title: "Image Position",
      options: { list: ["left", "right"] },
      initialValue: "right",
    }),
  ],
});

const featuresBlock = defineType({
  name: "featuresBlock",
  title: "Features / Highlights Block",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "intro", type: "localeText", title: "Introduction" }),
    defineField({ name: "features", type: "array", of: [{ type: "highlightItem" }], title: "Features" }),
  ],
});

const kpisBlock = defineType({
  name: "kpisBlock",
  title: "KPIs Block",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "intro", type: "localeText", title: "Introduction" }),
    defineField({ name: "kpis", type: "array", of: [{ type: "reference", to: [{ type: "kpi" }] }], title: "KPIs to display" }),
  ],
});

const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to Action Block",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "body", type: "localeText", title: "Body" }),
    defineField({ name: "actions", type: "array", of: [{ type: "linkAction" }], title: "Actions" }),
  ],
});

const latestNewsBlock = defineType({
  name: "latestNewsBlock",
  title: "Latest News Block",
  type: "object",
  fields: [
    defineField({ name: "title", type: "localeString", title: "Title" }),
    defineField({ name: "intro", type: "localeText", title: "Introduction" }),
    defineField({
      name: "limit",
      type: "number",
      title: "Number of articles to show",
      initialValue: 3,
      validation: (Rule) => Rule.min(1).max(12),
    }),
  ],
});

const genericPage = defineType({
  name: "genericPage",
  title: "Page (Constructeur de blocs)",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", title: "Internal Title (For Admin)" }),
    defineField({ name: "titleIntl", type: "localeString", title: "Public Title" }),
    defineField({ name: "slug", type: "slug", title: "Slug", options: { source: "title" } }),
    defineField({
      name: "slugIntl",
      title: "Localized Slugs",
      type: "object",
      fields: [
        defineField({ name: "fr", type: "slug", options: { source: "title" } }),
        defineField({ name: "en", type: "slug", options: { source: "title" } }),
      ],
    }),
    defineField({
      name: "blocks",
      title: "Page Blocks",
      type: "array",
      of: [
        { type: "heroBlock" },
        { type: "textImageBlock" },
        { type: "featuresBlock" },
        { type: "kpisBlock" },
        { type: "ctaBlock" },
        { type: "latestNewsBlock" },
      ],
    }),
    defineField({ name: "seo", type: "seo", title: "SEO" }),
  ],
});

export const schemaTypes = [
  blockContent,
  localeString,
  localeText,
  localeBlockContent,
  localeStringList,
  navItem,
  linkAction,
  highlightItem,
  missionItem,
  teamCategoryItem,
  teamStatItem,
  seo,
  pageCard,
  tableRow,
  pageSection,
  formCopy,
  heroBlock,
  textImageBlock,
  featuresBlock,
  kpisBlock,
  ctaBlock,
  latestNewsBlock,
  genericPage,
  siteSettings,
  navigation,
  homePage,
  kpi,
  kpiSettings,
  project,
  publication,
  news,
  event,
  partner,
  offer,
  program,
  researchAxis,
  resource,
  institutionalPage,
  member,
  person,
  teamPage,
  resourcePage,
  labReport,
  formSubmission,
  newsletterSubscriber,
  formSettings,
  aiSolution,
  useCase,
  sector,
  solutionsPage,
];

// Wrapper expected by Sanity CLI scaffolding (sanity.config imports { schema })
export const schema = { types: schemaTypes };
