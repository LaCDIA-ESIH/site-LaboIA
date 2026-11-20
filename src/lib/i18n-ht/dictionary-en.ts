/**
 * Champs Sanity « texte simple » (sans variante `en` dans le CMS) qui doivent
 * tout de même s'afficher en anglais. Remplacés à la lecture (voir sanityFetch).
 */
const EN: Record<string, string> = {
  "Laboratoire Caribéen des Sciences des Données et de l'Intelligence Artificielle":
    "Caribbean Laboratory of Data Science and Artificial Intelligence",
  "Laboratoire de recherche et d'innovation en IA et science des données : projets, publications, partenariats, transfert et formation.":
    "Research and innovation laboratory in AI and data science: projects, publications, partnerships, transfer and training.",
  "Bannière du laboratoire": "Laboratory banner",
  "Logo du laboratoire": "Laboratory logo",
  "Médiation scientifique": "Science communication",
  "Partenariat éditorial": "Editorial partnership",
  "Sciences & Société": "Science & Society",
  "Agriculture numérique": "Digital agriculture",
  "Etudiant(e) stagiaire": "Intern student",
  "Développement IA": "AI development",
  "Systèmes d'aide à la décision": "Decision support systems",
  "MLOps et déploiement": "MLOps and deployment",
};

export function overlayEn<T>(value: T): T {
  if (typeof value === "string") return (EN[value] ?? value) as T;
  if (Array.isArray(value)) return value.map((v) => overlayEn(v)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, overlayEn(v)])) as T;
  }
  return value;
}
