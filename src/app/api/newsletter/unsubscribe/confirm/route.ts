import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { isSanityWriteConfigured, unsubscribeByEmail } from "@/lib/newsletter-subscribers";

// Etape 2 de la désinscription : le lien signé envoyé par
// /api/newsletter/unsubscribe (voir ce fichier) pointe ici. Le jeton est
// vérifié (signature HMAC + expiration) avant toute désinscription réelle
// du document Sanity — voir audit pré-production, constat SEC-1 / COMP-1.

function htmlPage(locale: "fr" | "en" | "ht", title: string, body: string) {
  return new Response(
    `<!doctype html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${title} — LaCDIA</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0a0f1c; color: #f0f4ff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 2rem; text-align: center; }
    .card { max-width: 28rem; }
    h1 { font-size: 1.5rem; margin-bottom: 0.75rem; }
    p { color: #8892b0; line-height: 1.6; }
    a { color: #00d4aa; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${body}</p>
  </div>
</body>
</html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

const copyByLocale = {
  fr: {
    invalidTitle: "Lien expiré ou invalide",
    invalidBody: "Ce lien de désinscription n'est plus valide. Merci de refaire une demande depuis la page newsletter.",
    errorTitle: "Une erreur est survenue",
    errorBody: "Nous n'avons pas pu traiter votre désinscription. Réessayez plus tard ou contactez-nous directement.",
    okTitle: "Désinscription confirmée",
    okBody: "Vous ne recevrez plus la newsletter LaCDIA.",
  },
  en: {
    invalidTitle: "Link expired or invalid",
    invalidBody: "This unsubscribe link is no longer valid. Please request a new one from the newsletter page.",
    errorTitle: "Something went wrong",
    errorBody: "We couldn't process your unsubscription. Please try again later or contact us directly.",
    okTitle: "You're unsubscribed",
    okBody: "You will no longer receive the LaCDIA newsletter.",
  },
  ht: {
    invalidTitle: "Lyen an ekspire oswa li pa valid",
    invalidBody: "Lyen dezabònman sa a pa valid ankò. Tanpri refè yon demann depi paj bilten an.",
    errorTitle: "Yon erè fèt",
    errorBody: "Nou pa t ka trete dezabònman ou an. Eseye ankò pita oswa kontakte nou dirèkteman.",
    okTitle: "Dezabònman konfime",
    okBody: "Ou p ap resevwa bilten LaCDIA ankò.",
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email")?.trim().toLowerCase();
  const token = searchParams.get("token");
  const localeParam = searchParams.get("locale");
  const locale: "fr" | "en" | "ht" = localeParam === "en" ? "en" : localeParam === "ht" ? "ht" : "fr";
  const copy = copyByLocale[locale];

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return htmlPage(locale, copy.invalidTitle, copy.invalidBody);
  }

  if (!isSanityWriteConfigured) {
    return htmlPage(locale, copy.errorTitle, copy.errorBody);
  }

  // Email jamais abonne = deja desabonne : traite comme un succes
  // idempotent (voir unsubscribeByEmail), pas d'erreur affichee.
  try {
    await unsubscribeByEmail(email);
  } catch (error) {
    console.error("[newsletter] echec desinscription:", error);
    return htmlPage(locale, copy.errorTitle, copy.errorBody);
  }

  return htmlPage(locale, copy.okTitle, copy.okBody);
}
