import { AlertTriangle } from "lucide-react";
import { Disclosure, Panel, Section } from "../components/ui";
import { Link } from "../lib/router";

type LegalDoc = {
  slug: string;
  title: string;
  version: string;
  effective: string;
  intro: string;
  sections: { h: string; p: string[] }[];
  placeholder?: boolean;
};

const PLACEHOLDER =
  "This document is a working draft prepared for product development. It requires review by qualified legal counsel in each jurisdiction MYLO Edge operates in before it is relied upon. Nothing in this draft creates a binding obligation.";

export const LEGAL_DOCS: Record<string, LegalDoc> = {
  "/terms": {
    slug: "/terms",
    title: "Terms of Use",
    version: "v0.3 · DRAFT",
    effective: "Pending launch",
    placeholder: true,
    intro:
      "These terms govern access to and use of the MYLO Edge website and application.",
    sections: [
      {
        h: "1. The service",
        p: [
          "MYLO Edge is a market-intelligence, research and paper-trading platform. It is a decision-support tool. It is not a broker, exchange, investment adviser, or discretionary asset manager, and it does not execute orders in live markets on your behalf.",
        ],
      },
      {
        h: "2. Eligibility and accounts",
        p: [
          "You are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account. You must provide accurate registration information and keep it current.",
        ],
      },
      {
        h: "3. No advice",
        p: [
          "Nothing made available through MYLO Edge constitutes financial, investment, legal, accounting or tax advice, and no content takes account of your personal objectives, financial situation or needs. All trading and investment decisions are yours alone.",
        ],
      },
      {
        h: "4. Data and availability",
        p: [
          "Market data, research summaries, scores and analytics are provided on an 'as is' and 'as available' basis and may be delayed, incomplete, inaccurate or interrupted. Third-party data providers may impose their own terms.",
        ],
      },
      {
        h: "5. Acceptable use",
        p: [
          "You may not misuse the service, attempt to circumvent access controls, scrape data at scale, resell platform output, or use the platform in breach of applicable law or market regulation.",
        ],
      },
      {
        h: "6. Limitation of liability",
        p: [
          "Placeholder pending legal review. Liability provisions must be drafted to comply with the consumer protection rules of each jurisdiction served.",
        ],
      },
      {
        h: "7. Changes",
        p: [
          "Legal documents are versioned. Material changes will be published with a new version number and effective date, and prior versions will remain accessible.",
        ],
      },
    ],
  },
  "/privacy": {
    slug: "/privacy",
    title: "Privacy Policy",
    version: "v0.3 · DRAFT",
    effective: "Pending launch",
    placeholder: true,
    intro:
      "This policy explains what MYLO Edge collects, why it is collected, and the controls available to you.",
    sections: [
      {
        h: "1. What we collect and why",
        p: [
          "We store the information necessary to operate the service: to authenticate you, to secure and recover your account, to deliver the features you request (watchlists, research history, paper trading records, alerts), and to maintain service and security records.",
          "We do not claim broad ownership of your data. Content you create — watchlists, strategies, paper trading history — remains yours.",
        ],
      },
      {
        h: "2. What we avoid collecting",
        p: [
          "We aim to avoid collecting personal information that is not required to run the service. Analytics are configured to capture high-level product events rather than individual behavioural profiles.",
        ],
      },
      {
        h: "3. Sharing",
        p: [
          "We use third-party infrastructure and market-data providers to deliver the service. We do not sell personal information.",
        ],
      },
      {
        h: "4. Your controls",
        p: [
          "You can review active sessions, update account details, export the content you have created, and request deletion of your account, subject to records we are required to retain.",
        ],
      },
      {
        h: "5. Retention and security",
        p: [
          "Data is retained for as long as your account is active or as required for legitimate service and legal purposes. See the security section of the website for a description of the controls in place. We do not claim certifications we have not completed.",
        ],
      },
    ],
  },
  "/risk-disclosure": {
    slug: "/risk-disclosure",
    title: "Trading Risk Disclosure",
    version: "v0.3 · DRAFT",
    effective: "Pending launch",
    placeholder: true,
    intro:
      "Read this disclosure carefully before relying on any information provided by MYLO Edge.",
    sections: [
      {
        h: "1. Markets involve risk",
        p: [
          "Trading and investing in financial instruments involves substantial risk, including the possible loss of some or all of the amount invested. Leveraged instruments can produce losses exceeding the initial outlay. You should not trade with capital you cannot afford to lose.",
        ],
      },
      {
        h: "2. Decision support, not advice",
        p: [
          "MYLO Edge is a decision-support and market-research platform. It does not provide personal recommendations or guaranteed investment returns, and it does not predict future prices. Edge Score is a composite decision-support metric, not a probability of profit.",
        ],
      },
      {
        h: "3. Data limitations",
        p: [
          "Information displayed by MYLO may be incomplete, delayed, revised or incorrect depending on data providers, instruments and regions. Research summaries are generated from available market information and may not capture all relevant facts.",
        ],
      },
      {
        h: "4. Simulated results",
        p: [
          "Backtesting and paper trading are simulations. They cannot reproduce live execution, liquidity, funding or emotional conditions. Past performance and simulated performance do not guarantee future results.",
        ],
      },
      {
        h: "5. No automated execution",
        p: [
          "MYLO Edge does not automatically place live trades. Any decision to act in a live market is made by you, through your own broker or exchange, at your own risk.",
        ],
      },
      {
        h: "6. Your responsibility",
        p: [
          "You are solely responsible for your own trading and investment decisions and for determining whether any instrument or strategy is appropriate for your circumstances. Consider seeking advice from an independent, licensed professional.",
        ],
      },
    ],
  },
  "/cookies": {
    slug: "/cookies",
    title: "Cookie Policy",
    version: "v0.2 · DRAFT",
    effective: "Pending launch",
    placeholder: true,
    intro: "How MYLO Edge uses cookies and similar storage technologies.",
    sections: [
      {
        h: "1. Essential storage",
        p: [
          "Strictly necessary cookies and local storage are used to keep you signed in, protect sessions, and remember interface preferences. These cannot be disabled without breaking the service.",
        ],
      },
      {
        h: "2. Analytics",
        p: [
          "Where analytics are enabled, they are configured to be privacy-conscious and to record high-level product events. The analytics provider is configurable and may be disabled entirely for a deployment.",
        ],
      },
      {
        h: "3. Advertising",
        p: ["MYLO Edge does not use advertising or cross-site tracking cookies."],
      },
      {
        h: "4. Managing preferences",
        p: [
          "You can manage cookies through your browser settings. A granular in-product consent control will be provided where required by law.",
        ],
      },
    ],
  },
};

export function LegalPage({ path }: { path: string }) {
  const doc = LEGAL_DOCS[path];
  if (!doc) return null;

  return (
    <div className="pt-24">
      <Section tight>
        <div className="mx-auto max-w-3xl">
          <p className="num text-[10.5px] tracking-[0.22em] text-edge uppercase">
            Legal
          </p>
          <h1 className="mt-4 text-[32px] leading-tight font-semibold text-ink sm:text-[40px]">
            {doc.title}
          </h1>
          <div className="num mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[11px] tracking-[0.12em] text-ink-faint uppercase">
            <span>Version {doc.version}</span>
            <span>Effective · {doc.effective}</span>
          </div>
          <p className="mt-6 text-[15px] leading-relaxed text-ink-muted">{doc.intro}</p>

          {doc.placeholder && (
            <Panel className="mt-6 flex items-start gap-3 border-caution/25 bg-caution/[0.05] p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-caution" aria-hidden />
              <p className="text-[13px] leading-relaxed text-ink-muted">{PLACEHOLDER}</p>
            </Panel>
          )}

          <div className="mt-10 space-y-8">
            {doc.sections.map((s) => (
              <section key={s.h}>
                <h2 className="text-[16px] font-semibold text-ink">{s.h}</h2>
                {s.p.map((p, i) => (
                  <p key={i} className="mt-3 text-[14px] leading-relaxed text-ink-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-2 border-t border-hairline pt-6">
            {Object.values(LEGAL_DOCS)
              .filter((d) => d.slug !== doc.slug)
              .map((d) => (
                <Link
                  key={d.slug}
                  to={d.slug}
                  className="num rounded-md border border-hairline-strong px-3 py-2 text-[11.5px] text-ink-muted transition-colors hover:text-ink"
                >
                  {d.title}
                </Link>
              ))}
          </div>

          <Disclosure className="mt-6">
            Legal documents are versioned. Superseded versions remain available
            on request so you can see what applied at any point in time.
          </Disclosure>
        </div>
      </Section>
    </div>
  );
}
