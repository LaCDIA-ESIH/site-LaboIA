import { NextResponse } from "next/server";

import { createUnsubscribeToken, isUnsubscribeTokenConfigured } from "@/lib/unsubscribe-token";
import { isSanityWriteConfigured } from "@/lib/newsletter-subscribers";
import { getSiteUrl } from "@/lib/site-url";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/resend";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const copyByLocale = {
  fr: {
    subject: "Confirmez votre désinscription — LaCDIA",
    cta: "Confirmer la désinscription",
    intro:
      "Une demande de désinscription de la newsletter LaCDIA a été effectuée avec cette adresse email. Cliquez sur le bouton ci-dessous pour la confirmer — ce lien expire dans 1 heure.",
    ignore: "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email : rien ne sera modifié.",
  },
  en: {
    subject: "Confirm your newsletter unsubscription — LaCDIA",
    cta: "Confirm unsubscription",
    intro:
      "A request to unsubscribe from the LaCDIA newsletter was made with this email address. Click the button below to confirm — this link expires in 1 hour.",
    ignore: "If you didn't request this, you can safely ignore this email: nothing will change.",
  },
  ht: {
    subject: "Konfime dezabònman ou — LaCDIA",
    cta: "Konfime dezabònman an",
    intro:
      "Yon demann pou dezabòne nan bilten LaCDIA fèt ak adrès imèl sa a. Klike sou bouton ki anba a pou konfime — lyen sa a ap ekspire nan 1 èdtan.",
    ignore: "Si se pa ou ki fè demann sa a, ou ka inyore imèl sa a : anyen p ap chanje.",
  },
};

export async function POST(request: Request) {
  // Limitation de débit best-effort (voir src/lib/rate-limit.ts) — 5
  // demandes / 10 min / IP (audit pré-production, SEC-2).
  const ip = getClientIp(request);
  if (isRateLimited(`newsletter-unsubscribe:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const email = body?.email?.toString().trim().toLowerCase();
  // Honeypot anti-bot : champ caché que seuls les robots remplissent.
  // On répond "ok" sans rien faire pour ne pas leur signaler le piège.
  const honeypot = body?.company?.toString().trim();
  const locale: "fr" | "en" | "ht" = body?.locale === "en" ? "en" : body?.locale === "ht" ? "ht" : "fr";

  if (honeypot) {
    return NextResponse.json({ ok: true, message: "Email de confirmation envoyé." });
  }

  if (!email || !emailRegex.test(email)) {
    return NextResponse.json({ ok: false, message: "Email invalide" }, { status: 400 });
  }

  if (
    !process.env.MESSAGING_URL_RESEND_API_KEY ||
    !process.env.MESSAGING_URL_RESEND_EMAIL_DOMAIN ||
    !isSanityWriteConfigured ||
    !isUnsubscribeTokenConfigured()
  ) {
    console.info("[newsletter] desinscription sans provider/secret configure", { email });
    return NextResponse.json(
      { ok: false, message: "Service newsletter non configuré. Veuillez réessayer plus tard." },
      { status: 503 },
    );
  }

  // On n'exécute plus la désinscription immédiatement : on envoie un lien
  // de confirmation à jeton signé. Sans cela, n'importe qui pouvait
  // désabonner n'importe quelle adresse en connaissant simplement cet
  // endpoint (voir audit pré-production, constat SEC-1).
  const token = createUnsubscribeToken(email);
  const confirmUrl = new URL("/api/newsletter/unsubscribe/confirm", getSiteUrl());
  confirmUrl.searchParams.set("email", email);
  confirmUrl.searchParams.set("token", token);
  confirmUrl.searchParams.set("locale", locale);

  const copy = copyByLocale[locale];

  const result = await sendEmail({
    to: email,
    subject: copy.subject,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
        <p style="color:#333;line-height:1.6;">${copy.intro}</p>
        <p style="margin:24px 0;">
          <a href="${confirmUrl.toString()}" style="background:#0a0f1c;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">${copy.cta}</a>
        </p>
        <p style="color:#999;font-size:12px;">${copy.ignore}</p>
      </div>`,
  });

  if (!result.ok) {
    console.error("[resend] echec envoi email de confirmation de desinscription:", result.error);
    return NextResponse.json(
      { ok: false, message: "Erreur lors de l'envoi de l'email de confirmation." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, message: "Email de confirmation envoyé." });
}
