const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const paths = [
  "/fr",
  "/fr/recherche",
  "/fr/recherche/axes",
  "/fr/recherche/explorer",
  "/fr/publications",
  "/fr/publications/axes",
  "/fr/projets",
  "/fr/equipe",
  "/fr/solutions",
  "/fr/formation",
  "/fr/actualites",
  "/fr/collaborer",
  "/fr/ressources",
  "/fr/mentions-legales",
  "/fr/confidentialite",
  "/fr/cookies",
  "/fr/newsletter",
  "/en",
  "/en/recherche",
  "/en/publications",
];

const timeoutMs = 10000;

async function fetchWithTimeout(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { signal: controller.signal, redirect: "manual" });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function run() {
  const failures = [];

  for (const path of paths) {
    const url = new URL(path, baseUrl).toString();
    try {
      const response = await fetchWithTimeout(url);
      if (response.status < 200 || response.status >= 400) {
        failures.push({ url, status: response.status });
      } else {
        process.stdout.write(`OK ${response.status} ${url}\n`);
      }
    } catch (error) {
      failures.push({ url, status: "error", error: error?.message || "fetch failed" });
    }
  }

  if (failures.length > 0) {
    process.stderr.write("Route check failed:\n");
    for (const failure of failures) {
      process.stderr.write(`- ${failure.url} (${failure.status})\n`);
    }
    process.exit(1);
  }
}

run();
