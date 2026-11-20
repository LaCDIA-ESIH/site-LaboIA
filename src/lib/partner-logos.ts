/** Logos locaux (`public/patenaires/`) utilisés quand le partenaire n'a pas encore de logo dans Sanity. */
const LOCAL_PARTNER_LOGOS: { match: RegExp; src: string }[] = [
  { match: /infos\s*-?\s*nation/i, src: "/patenaires/INfoS-Nation.png" },
];

export function localLogoFor(name: string) {
  return LOCAL_PARTNER_LOGOS.find((l) => l.match.test(name))?.src;
}
