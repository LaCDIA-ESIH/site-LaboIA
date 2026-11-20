"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import ContactForm from "@/components/forms/contact-form";
import CollaborateForm from "@/components/forms/collaborate-form";
import type { FormSettings } from "@/lib/sanity/types";
import type { Locale } from "@/lib/i18n";

type Tab = "contact" | "collaborate";

function Tabs({ forms, locale }: { forms?: FormSettings | null; locale: Locale }) {
  const searchParams = useSearchParams();
  // Derived directly from the URL at init instead of defaulting to "contact"
  // and correcting via an effect — avoids both a render flash and a
  // setState-in-effect (the tab is right on the very first paint).
  const [active, setActive] = useState<Tab>(() =>
    searchParams.get("tab") === "collaborate" ? "collaborate" : "contact",
  );

  const labels = useTranslations("pages.contactTabs");

  return (
    <div>
      {/* Tab bar */}
      <div
        role="tablist"
        style={{
          display: "flex",
          gap: "0.5rem",
          borderBottom: "1px solid rgba(var(--ink-rgb),0.08)",
          marginBottom: "2.5rem",
        }}
      >
        {(["contact", "collaborate"] as Tab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={active === tab}
            onClick={() => setActive(tab)}
            style={{
              padding: "0.65rem 1.25rem",
              fontSize: "0.9rem",
              fontWeight: 600,
              border: "none",
              background: "transparent",
              color: active === tab ? "var(--labo-accent-teal, var(--haiti-blue))" : "var(--labo-text-muted, var(--labo-text-muted))",
              borderBottom: active === tab ? "2px solid var(--labo-accent-teal, var(--haiti-blue))" : "2px solid transparent",
              cursor: "pointer",
              marginBottom: "-1px",
              transition: "color 0.2s, border-color 0.2s",
              fontFamily: "var(--font-body)",
            }}
          >
            {tab === "contact" ? labels("contact") : labels("collaborate")}
          </button>
        ))}
      </div>

      {/* Panel */}
      {active === "contact" ? (
        <ContactForm copy={forms?.contact} locale={locale} />
      ) : (
        <CollaborateForm copy={forms?.collaborate} locale={locale} />
      )}
    </div>
  );
}

export default function ContactCollaborateTabs({ forms, locale }: { forms?: FormSettings | null; locale: Locale }) {
  return (
    <Suspense fallback={<ContactForm locale={locale} />}>
      <Tabs forms={forms} locale={locale} />
    </Suspense>
  );
}
