import { NextResponse } from "next/server";

import { sanityWriteClient, isSanityWriteConfigured } from "@/lib/sanity/write-client";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { escapeHtml } from "@/lib/utils";
import { sendEmail } from "@/lib/resend";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Seuls ces deux formulaires existent côté site (contact-form / collaborate-form).
const allowedFormTypes = new Set(["contact", "collaborer"]);

// Limites de taille : sans elles, n'importe qui pouvait stocker des champs
// arbitrairement gros dans Sanity et dans l'email de notification.
const maxLengths = { fullName: 120, email: 254, organization: 160, subject: 200, phone: 40, message: 5000 } as const;
const isTooLong = (value: string | undefined, max: number) => Boolean(value && value.length > max);

export async function POST(request: Request) {
  // Limitation de débit best-effort (voir src/lib/rate-limit.ts) — 5
  // soumissions / 10 min / IP (audit pré-production, SEC-2).
  const ip = getClientIp(request);
  if (isRateLimited(`forms-submit:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const formType = body?.formType?.toString();
  const fullName = body?.fullName?.toString().trim();
  const email = body?.email?.toString().trim();
  const organization = body?.organization?.toString().trim();
  const subject = body?.subject?.toString().trim();
  // Le schéma Sanity formSubmission n'a pas de champ dédié pour le
  // téléphone : plutôt que de le perdre silencieusement (comme c'était le
  // cas auparavant — la valeur n'était ni stockée ni transmise), on le
  // rattache au message et on l'affiche dans l'email de notification.
  const phone = body?.phone?.toString().trim();
  const rawMessage = body?.message?.toString().trim();
  const message = phone ? [`Téléphone : ${phone}`, rawMessage].filter(Boolean).join("\n\n") : rawMessage;
  const consent = Boolean(body?.consent);
  // Honeypot anti-bot : champ caché, jamais rempli par un humain. On
  // répond "ok" sans rien enregistrer pour ne pas signaler le piège.
  const honeypot = body?.company?.toString().trim();

  if (honeypot) {
    return NextResponse.json({ ok: true, message: "Demande enregistree." });
  }

  if (formType && !allowedFormTypes.has(formType)) {
    return NextResponse.json({ ok: false, message: "Type de formulaire invalide." }, { status: 400 });
  }

  if (
    isTooLong(fullName, maxLengths.fullName) ||
    isTooLong(email, maxLengths.email) ||
    isTooLong(organization, maxLengths.organization) ||
    isTooLong(subject, maxLengths.subject) ||
    isTooLong(phone, maxLengths.phone) ||
    isTooLong(rawMessage, maxLengths.message)
  ) {
    return NextResponse.json({ ok: false, message: "Un des champs est trop long." }, { status: 400 });
  }

  if (!formType || !fullName || !email || !consent) {
    return NextResponse.json({ ok: false, message: "Champs requis manquants." }, { status: 400 });
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ ok: false, message: "Email invalide." }, { status: 400 });
  }

  if (!isSanityWriteConfigured || !sanityWriteClient) {
    return NextResponse.json(
      { ok: false, message: "Stockage non configure." },
      { status: 503 },
    );
  }

  const createdAt = new Date().toISOString();

  await sanityWriteClient.create({
    _type: "formSubmission",
    status: "new",
    statusHistory: [
      {
        status: "new",
        note: "Soumission via le site.",
        changedAt: createdAt,
      },
    ],
    formType,
    fullName,
    email,
    organization,
    subject,
    message,
    consent,
    createdAt,
    updatedAt: createdAt,
  });

  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;

  if (notifyEmail) {
    const typeLabel = formType === "collaborer" ? "Collaboration" : "Contact";
    // Contenu utilisateur échappé avant interpolation HTML (SEC-5) :
    // sans cela, un champ contenant des balises pouvait s'injecter dans
    // l'email de notification reçu par l'équipe.
    const safeFullName = escapeHtml(fullName);
    const safeEmail = escapeHtml(email);
    const safeOrganization = organization ? escapeHtml(organization) : "";
    const safeSubject = subject ? escapeHtml(subject) : "";
    const safeMessage = rawMessage ? escapeHtml(rawMessage) : "";
    const safePhone = phone ? escapeHtml(phone) : "";

    const result = await sendEmail({
      to: notifyEmail,
      subject: `[LaCDIA] Nouvelle demande — ${typeLabel}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
          <h2 style="color:#0a0f1c;margin-bottom:16px;">Nouvelle demande de ${typeLabel.toLowerCase()}</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#555;width:140px;">Nom</td><td style="padding:8px 0;font-weight:600;">${safeFullName}</td></tr>
            <tr><td style="padding:8px 0;color:#555;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
            ${safePhone ? `<tr><td style="padding:8px 0;color:#555;">Téléphone</td><td style="padding:8px 0;"><a href="tel:${safePhone}">${safePhone}</a></td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#555;">Organisation</td><td style="padding:8px 0;">${safeOrganization || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#555;">Objet</td><td style="padding:8px 0;">${safeSubject || "—"}</td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#fff;border-radius:6px;border:1px solid #e5e5e5;">
            <p style="color:#555;margin:0;white-space:pre-wrap;">${safeMessage}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#999;">Message reçu via le formulaire du site LaCDIA.</p>
        </div>`,
    });

    if (!result.ok) {
      console.error("[resend] notification contact non envoyee:", result.error);
    }
  }

  return NextResponse.json({ ok: true, message: "Demande enregistree." });
}
