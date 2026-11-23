import type { Locale } from "@/lib/i18n";
import { pick } from "@/lib/i18n-pick";

type GovernanceProps = {
  locale?: Locale;
};

const GOVERNANCE_ORGANS = [
  {
    id: "esih",
    labelFr: "ESIH",
    labelEn: "ESIH",
    titleFr: "Autorité de rattachement",
    titleEn: "Parent institution",
    descFr: "L'École Supérieure d'Infotronique d'Haïti est l'entité juridique porteuse de LaCDIA. Elle conclut les actes, conventions et engagements institutionnels.",
    descEn: "The École Supérieure d'Infotronique d'Haïti is the legal entity behind LaCDIA. It concludes institutional acts, agreements and commitments.",
    labelHt: "ESIH",
    titleHt: "Otorite rattachman",
    descHt: "École Supérieure d'Infotronique d'Haïti se antite jiridik ki pote LaCDIA. Li konkli aktè, konvansyon ak angajman enstitisyonèl yo.",
    color: "var(--ink)",
    bg: "rgba(var(--ink-rgb),0.05)",
    border: "rgba(var(--ink-rgb),0.18)",
    line: "INSTITUTIONNELLE",
  },
  {
    id: "corps",
    labelFr: "Corps exécutif",
    labelEn: "Executive body",
    titleFr: "Stratégie & coordination",
    titleEn: "Strategy & coordination",
    descFr: "Les trois cofondateurs assurent la stratégie institutionnelle, la coordination opérationnelle, le développement des programmes, les partenariats et la mobilisation des ressources.",
    descEn: "The three co-founders provide institutional strategy, operational coordination, program development, partnerships and resource mobilization.",
    labelHt: "Kò egzekitif",
    titleHt: "Estrateji ak kowòdinasyon",
    descHt: "Twa kofondatè yo asire estrateji enstitisyonèl la, kowòdinasyon operasyonèl la, devlopman pwogram yo, patenarya yo ak mobilizasyon resous yo.",
    color: "var(--ink)",
    bg: "rgba(var(--ink-rgb),0.05)",
    border: "rgba(var(--ink-rgb),0.18)",
    line: "INSTITUTIONNELLE",
  },
  {
    id: "comite",
    labelFr: "Comité de gouvernance",
    labelEn: "Governance committee",
    titleFr: "Interface & arbitrage",
    titleEn: "Interface & arbitration",
    descFr: "Arbitre les sujets à l'intersection de la science, de la stratégie, des finances, des partenariats, des ressources humaines, de la communication et de la propriété intellectuelle.",
    descEn: "Arbitrates topics at the intersection of science, strategy, finance, partnerships, human resources, communication and intellectual property.",
    labelHt: "Komite gouvènans",
    titleHt: "Entèfas ak abitraj",
    descHt: "Li abitre sijè ki nan kwazman syans, estrateji, finans, patenarya, resous imen, kominikasyon ak pwopriyete entelektyèl.",
    color: "var(--haiti-blue)",
    bg: "rgba(var(--haiti-blue-rgb),0.08)",
    border: "rgba(var(--haiti-blue-rgb),0.2)",
    line: "CONVERGENCE",
  },
  {
    id: "direction",
    labelFr: "Direction scientifique",
    labelEn: "Scientific directorate",
    titleFr: "Orientation scientifique",
    titleEn: "Scientific direction",
    descFr: "Assure l'orientation, la qualité, l'intégrité et la supervision scientifiques. Sa signature est strictement scientifique — sans pouvoir général d'engagement institutionnel.",
    descEn: "Ensures scientific orientation, quality, integrity and supervision. Its signature is strictly scientific — with no general institutional commitment power.",
    labelHt: "Direksyon syantifik",
    titleHt: "Oryantasyon syantifik",
    descHt: "Li asire oryantasyon, kalite, entegrite ak sipèvizyon syantifik. Siyati li se strikteman syantifik, san pouvwa jeneral pou angaje enstitisyon an.",
    color: "var(--haiti-red)",
    bg: "rgba(var(--haiti-red-rgb),0.08)",
    border: "rgba(var(--haiti-red-rgb),0.2)",
    line: "SCIENTIFIQUE",
  },
  {
    id: "conseil",
    labelFr: "Conseil scientifique",
    labelEn: "Scientific council",
    titleFr: "Évaluation & qualité",
    titleEn: "Assessment & quality",
    descFr: "Réunit la Direction scientifique, les Responsables scientifiques des 2 axes et les Coordonnateurs techniques. Examine la stratégie scientifique et la qualité des productions.",
    descEn: "Brings together the Scientific Directorate, the Scientific Heads of the 2 axes and the Technical Coordinators. Examines scientific strategy and production quality.",
    labelHt: "Konsèy syantifik",
    titleHt: "Evalyasyon ak kalite",
    descHt: "Li rasanble Direksyon syantifik la, Responsab syantifik 2 aks yo ak Kowòdonatè teknik yo. Li egzamine estrateji syantifik la ak kalite pwodiksyon yo.",
    color: "var(--haiti-red)",
    bg: "rgba(var(--haiti-red-rgb),0.08)",
    border: "rgba(var(--haiti-red-rgb),0.2)",
    line: "SCIENTIFIQUE",
  },
];

const LINE_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  INSTITUTIONNELLE: { color: "var(--ink)", bg: "rgba(var(--ink-rgb),0.06)", border: "rgba(var(--ink-rgb),0.2)" },
  SCIENTIFIQUE: { color: "var(--haiti-red)", bg: "rgba(var(--haiti-red-rgb),0.1)", border: "rgba(var(--haiti-red-rgb),0.25)" },
  CONVERGENCE: { color: "var(--haiti-blue)", bg: "rgba(var(--haiti-blue-rgb),0.1)", border: "rgba(var(--haiti-blue-rgb),0.25)" },
};

const PRINCIPLES = [
  {
    iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    fr: "Séparation des lignes institutionnelle et scientifique — convergentes au niveau du Comité, sans confusion de compétences.",
    en: "Separation of institutional and scientific lines — converging at the Committee level, without confusion of competencies.",
    ht: "Separasyon liy enstitisyonèl ak liy syantifik — yo konvèje nan nivo Komite a, san konfizyon konpetans.",
  },
  {
    iconPath: "M12 22V12M12 12L5 5.5M12 12l7-6.5",
    fr: "Aucun organe ne peut engager seul LaCDIA ou l'ESIH pour des actes mixtes — les cosignatures sont requises par la Charte.",
    en: "No single body can commit LaCDIA or ESIH alone for mixed acts — co-signatures are required by the Charter.",
    ht: "Okenn ògàn pa ka angaje LaCDIA oswa ESIH poukont li pou aktè mikst — Chart la egzije ko-siyati.",
  },
  {
    iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    fr: "Toute nomination, affiliation ou attribution de fonction devient effective par convention individuelle, lettre de nomination ou acte conforme à la Charte.",
    en: "Any appointment, affiliation or function assignment becomes effective through an individual agreement, letter of appointment or Charter-compliant act.",
    ht: "Tout nominasyon, afilyasyon oswa atribisyon fonksyon vin efektif atravè yon konvansyon endividyèl, yon lèt nominasyon oswa yon aktè ki konfòm ak Chart la.",
  },
  {
    iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    fr: "En présence d'un conflit d'intérêts, la personne concernée s'abstient de participer seule à la décision.",
    en: "In the presence of a conflict of interest, the person concerned refrains from participating alone in the decision.",
    ht: "Lè gen yon konflit enterè, moun ki konsène a pa patisipe poukont li nan desizyon an.",
  },
];

const LINE_LABELS: Record<string, { fr: string; en: string; ht: string }> = {
  INSTITUTIONNELLE: { fr: "INSTITUTIONNELLE", en: "INSTITUTIONAL", ht: "ENSTITISYONÈL" },
  SCIENTIFIQUE: { fr: "SCIENTIFIQUE", en: "SCIENTIFIC", ht: "SYANTIFIK" },
  CONVERGENCE: { fr: "CONVERGENCE", en: "CONVERGENCE", ht: "KONVÈJANS" },
};

export default function GovernanceEthics({ locale = "fr" }: GovernanceProps) {

  return (
    <section
      id="gouvernance"
      style={{
        padding: "clamp(4rem,7vw,7rem) 0",
        background: "var(--labo-surface)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top border */}
      <div aria-hidden="true" style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: "linear-gradient(90deg, transparent, rgba(var(--ink-rgb),0.07), transparent)",
      }} />

      {/* Ambient glows */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background:
          "radial-gradient(ellipse 40% 40% at 80% 50%, rgba(var(--haiti-red-rgb),0.06) 0%, transparent 70%)," +
          "radial-gradient(ellipse 35% 35% at 15% 30%, rgba(var(--ink-rgb),0.03) 0%, transparent 70%)",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ width: 32, height: 1, background: "rgba(var(--haiti-red-rgb),0.6)" }} />
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: "0.62rem", letterSpacing: "0.2em",
              textTransform: "uppercase", color: "var(--haiti-red)", fontWeight: 700,
            }}>
              {pick(locale, { fr: "Gouvernance", en: "Governance", ht: "Gouvènans" })}
            </span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,3.5vw,2.75rem)",
            fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.1,
            color: "var(--labo-text)", margin: "0 0 0.85rem",
          }}>
            {pick(locale, { fr: "Deux lignes, une gouvernance claire", en: "Two lines, one clear governance", ht: "De liy, yon gouvènans klè" })}
          </h2>
          <p style={{
            fontSize: "0.95rem", color: "var(--labo-text-muted)", lineHeight: 1.75,
            maxWidth: 640, margin: 0,
          }}>
            {pick(locale, {
              fr: "La gouvernance distingue la ligne institutionnelle (ESIH, Corps exécutif) de la ligne scientifique (Direction scientifique, Conseil scientifique), convergentes au niveau du Comité de gouvernance, sans confusion de compétences.",
              en: "Governance distinguishes the institutional line (ESIH, Executive body) from the scientific line (Scientific Directorate, Scientific Council), converging at the Governance Committee level, without confusion of competencies.",
              ht: "Gouvènans lan distenge liy enstitisyonèl la (ESIH, Kò egzekitif) ak liy syantifik la (Direksyon syantifik, Konsèy syantifik), ki konvèje nan nivo Komite gouvènans lan, san konfizyon konpetans.",
            })}
          </p>
        </div>

        {/* Organs grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem",
          marginBottom: "2.5rem",
        }} className="governance-organs-grid">
          {GOVERNANCE_ORGANS.map((organ) => {
            const lineStyle = LINE_COLORS[organ.line];
            return (
              <div key={organ.id} style={{
                background: "var(--labo-surface)",
                border: "1px solid " + organ.border,
                borderRadius: 16,
                padding: "1.5rem 1.25rem",
                display: "flex", flexDirection: "column", gap: "0.75rem",
                position: "relative", overflow: "hidden",
              }}>
                {/* Top line indicator */}
                <div aria-hidden="true" style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 3,
                  background: organ.color,
                }} />

                {/* Line badge */}
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.55rem", letterSpacing: "0.14em",
                  padding: "0.2rem 0.5rem", borderRadius: 999, fontWeight: 700,
                  background: lineStyle.bg, border: "1px solid " + lineStyle.border,
                  color: lineStyle.color, alignSelf: "flex-start",
                }}>
                  {pick(locale, LINE_LABELS[organ.line])}
                </span>

                {/* Organ label */}
                <div>
                  <p style={{
                    fontFamily: "var(--font-display)", fontSize: "0.82rem", fontWeight: 600,
                    color: "var(--labo-text)", margin: "0 0 0.1rem", lineHeight: 1.25,
                  }}>
                    {pick(locale, { fr: organ.labelFr, en: organ.labelEn, ht: organ.labelHt })}
                  </p>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.1em",
                    color: organ.color, margin: 0,
                  }}>
                    {pick(locale, { fr: organ.titleFr, en: organ.titleEn, ht: organ.titleHt })}
                  </p>
                </div>

                <p style={{
                  fontSize: "0.75rem", color: "rgba(var(--ink-rgb),0.66)", lineHeight: 1.6,
                  margin: 0,
                }}>
                  {pick(locale, { fr: organ.descFr, en: organ.descEn, ht: organ.descHt })}
                </p>
              </div>
            );
          })}
        </div>

        {/* Governance principles */}
        <div style={{
          background: "var(--paper-2)",
          border: "1px solid rgba(var(--ink-rgb),0.07)",
          borderRadius: 20,
          padding: "2rem 2.25rem",
        }}>
          <p style={{
            fontFamily: "var(--font-mono)", fontSize: "0.6rem", letterSpacing: "0.18em",
            textTransform: "uppercase", color: "rgba(var(--ink-rgb),0.66)",
            marginBottom: "1.25rem",
          }}>
            {pick(locale, { fr: "Principes de gouvernance", en: "Governance principles", ht: "Prensip gouvènans" })}
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.85rem",
          }} className="principles-grid">
            {PRINCIPLES.map((p, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "0.7rem",
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                  background: "rgba(var(--haiti-blue-rgb),0.08)", border: "1px solid rgba(var(--haiti-blue-rgb),0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d={p.iconPath} stroke="var(--haiti-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{
                  fontSize: "0.78rem", color: "rgba(var(--ink-rgb),0.66)", lineHeight: 1.6, margin: 0,
                }}>
                  {pick(locale, p)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          #gouvernance .governance-organs-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 700px) {
          #gouvernance .governance-organs-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          #gouvernance .principles-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          #gouvernance .governance-organs-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
