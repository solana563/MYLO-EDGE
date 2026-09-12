import {
  AlertTriangle,
  ArrowRight,
  Check,
  Fingerprint,
  KeyRound,
  Lock,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { AUDIENCES, FAQS } from "../../data/demo";
import { PRICING_STATUS, TIERS } from "../../data/pricing";
import {
  Accordion,
  Badge,
  Button,
  Disclosure,
  Panel,
  Reveal,
  Section,
  SectionHeading,
} from "../ui";
import { Link } from "../../lib/router";
import { track } from "../../lib/analytics";
import { cn } from "../../utils/cn";

/* ---------------- Audiences ---------------- */

export function Audiences() {
  return (
    <Section id="who">
      <SectionHeading
        eyebrow="Who is MYLO for?"
        title="Built for traders who want to do the work properly."
        sub="MYLO Edge is not suitable for everyone. It assumes you want to investigate an idea before acting on it."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {AUDIENCES.map((a, i) => (
          <Reveal key={a.tag} delay={i * 0.07}>
            <Panel className="h-full p-6" hover>
              <span className="num text-[10.5px] font-semibold tracking-[0.18em] text-edge uppercase">
                {a.tag}
              </span>
              <p className="mt-4 text-[14.5px] leading-relaxed text-ink">{a.desc}</p>
              <ul className="mt-5 space-y-2 border-t border-hairline pt-4">
                {a.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[13px] text-ink-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bull" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </Panel>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- Pricing ---------------- */

export function Pricing({ compact = false }: { compact?: boolean }) {
  return (
    <Section id="pricing" tight={compact}>
      <SectionHeading
        align="center"
        eyebrow="Pricing"
        title="Start free. Upgrade when the workflow earns it."
        sub={
          PRICING_STATUS === "coming-soon"
            ? "Commercial terms are still being finalised, so we are not publishing prices we might change. The plan structure below is what we are building toward."
            : undefined
        }
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.07}>
            <Panel
              className={cn(
                "relative flex h-full flex-col p-6",
                t.featured && "border-edge/25 bg-edge/[0.035]",
              )}
              hover
            >
              {t.featured && (
                <span className="absolute -top-2.5 left-6">
                  <Badge tone="info">Recommended</Badge>
                </span>
              )}
              <h3 className="num text-[13px] font-semibold tracking-[0.18em] text-ink">
                {t.name}
              </h3>
              <p className="mt-1.5 text-[13px] text-ink-muted">{t.kicker}</p>

              <div className="mt-6 border-y border-hairline py-5">
                {t.price ? (
                  <p className="num text-[34px] leading-none font-semibold text-ink">
                    {t.price}
                    <span className="text-[13px] text-ink-faint"> /{t.period}</span>
                  </p>
                ) : (
                  <p className="num text-[19px] font-medium text-ink-muted">
                    {t.id === "free" ? "No cost" : "Pricing coming soon"}
                  </p>
                )}
                <p className="num mt-2 text-[10.5px] tracking-[0.14em] text-ink-faint uppercase">
                  {t.note}
                </p>
              </div>

              <ul className="mt-5 flex-1 space-y-2.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-ink-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-edge" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button
                  to={t.cta.to}
                  variant={t.featured ? "primary" : "outline"}
                  className="w-full"
                  event={`pricing_${t.id}`}
                >
                  {t.cta.label}
                </Button>
              </div>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Disclosure className="mx-auto mt-6 max-w-2xl justify-center text-center">
        Plan contents are indicative while the product is in development and may
        change before launch. Nothing here is an offer or a contract.
      </Disclosure>
    </Section>
  );
}

export function PricingViewTracker() {
  track("pricing_viewed");
  return null;
}

/* ---------------- Security ---------------- */

const SECURITY = [
  { i: KeyRound, t: "Secure authentication", d: "Credential handling built on established authentication practice, with support for account verification and recovery flows." },
  { i: Lock, t: "Encrypted connections", d: "Traffic between your browser and MYLO services is encrypted in transit." },
  { i: UserCog, t: "Session management", d: "Active sessions can be reviewed and revoked, and sessions expire rather than persisting indefinitely." },
  { i: ShieldCheck, t: "Least-privilege architecture", d: "Services and internal components are scoped to the minimum access they need to function." },
  { i: Fingerprint, t: "Secret management", d: "Application secrets and provider keys are stored in managed secret storage, not in source control." },
  { i: AlertTriangle, t: "Account recovery", d: "Recovery is designed to restore access to you without weakening the account for everyone else." },
];

export function Security() {
  return (
    <Section id="security">
      <SectionHeading
        eyebrow="Security & privacy"
        title="Your account. Your decisions. Your data."
        sub="We describe what we actually do. We do not claim certifications we have not completed."
      />
      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECURITY.map((s, i) => (
          <Reveal key={s.t} delay={Math.min(i * 0.05, 0.25)}>
            <Panel className="h-full p-5" hover>
              <s.i className="h-4 w-4 text-edge" aria-hidden />
              <h3 className="mt-5 text-[14px] font-medium text-ink">{s.t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{s.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <Panel className="mt-4 p-6">
          <h3 className="text-[15px] font-medium text-ink">What we store, and why</h3>
          <p className="mt-2 max-w-3xl text-[13.5px] leading-relaxed text-ink-muted">
            MYLO Edge stores the information necessary to operate the service:
            to authenticate you, secure and recover your account, deliver the
            features you request, and maintain the service records we are
            required to keep. We do not claim broad ownership of your data, and
            privacy controls are part of the product rather than a settings page
            afterthought.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/privacy" className="num rounded-md border border-hairline-strong px-3 py-2 text-[11.5px] text-ink-muted transition-colors hover:text-ink">
              Privacy Policy
            </Link>
            <Link to="/terms" className="num rounded-md border border-hairline-strong px-3 py-2 text-[11.5px] text-ink-muted transition-colors hover:text-ink">
              Terms of Use
            </Link>
            <Link to="/risk-disclosure" className="num rounded-md border border-hairline-strong px-3 py-2 text-[11.5px] text-ink-muted transition-colors hover:text-ink">
              Trading Risk Disclosure
            </Link>
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}

/* ---------------- Risk disclosure ---------------- */

export function RiskDisclosureSection() {
  return (
    <Section id="risk-disclosure">
      <Reveal>
        <Panel className="border-caution/20 bg-caution/[0.03] p-6 sm:p-9">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-caution" aria-hidden />
            <h2 className="text-[24px] font-semibold text-ink sm:text-[30px]">
              Markets involve risk.
            </h2>
          </div>
          <div className="mt-5 grid gap-x-10 gap-y-3 text-[14px] leading-relaxed text-ink-muted lg:grid-cols-2">
            {[
              "MYLO Edge is a decision-support and market-research platform. It is not a broker, not an adviser, and not a discretionary manager.",
              "MYLO Edge does not provide guaranteed investment returns and does not predict future prices.",
              "Information displayed by MYLO may be incomplete, delayed or incorrect depending on data providers.",
              "Historical performance and backtesting results do not guarantee future results.",
              "Trading and investing involve substantial risk, including the possible loss of the amount invested.",
              "Users are responsible for their own trading and investment decisions.",
            ].map((t) => (
              <p key={t} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-caution" aria-hidden />
                {t}
              </p>
            ))}
          </div>
          <div className="mt-7">
            <Button to="/risk-disclosure" variant="outline" size="sm">
              Read the full Trading Risk Disclosure
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Panel>
      </Reveal>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */

export function FAQSection({ limit }: { limit?: number }) {
  return (
    <Section id="faq">
      <SectionHeading
        align="center"
        eyebrow="FAQ"
        title="Straight answers, conservatively worded."
      />
      <div className="mx-auto mt-10 max-w-3xl">
        <Accordion
          items={limit ? FAQS.slice(0, limit) : FAQS}
          onOpen={(q) => track("faq_opened", { q })}
        />
      </div>
    </Section>
  );
}

/* ---------------- Philosophy strip ---------------- */

export function Philosophy() {
  return (
    <Section tight>
      <Reveal>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["FIND THE EDGE.", "Evidence across eight lenses."],
            ["UNDERSTAND THE RISK.", "Invalidation before entry."],
            ["MAKE THE DECISION.", "The final call is always yours."],
          ].map(([t, d], i) => (
            <div
              key={t}
              className={cn(
                "rounded-panel border border-hairline bg-white/[0.015] p-6",
                i === 2 && "border-edge/25 bg-edge/[0.04]",
              )}
            >
              <p className={cn("num text-[15px] font-semibold tracking-[0.06em]", i === 2 ? "text-edge-soft" : "text-ink")}>
                {t}
              </p>
              <p className="mt-2 text-[13px] text-ink-muted">{d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------- CTA ---------------- */

export function CTA() {
  return (
    <Section id="cta">
      <Reveal>
        <div className="relative overflow-hidden rounded-panel border border-hairline bg-gradient-to-b from-white/[0.05] to-white/[0.01] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(127,168,217,0.18),transparent)]" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-[26px] leading-tight font-semibold sm:text-[40px]">
              <span className="text-gradient">
                YOUR NEXT TRADE DESERVES BETTER RESEARCH.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] text-ink-muted">
              Bring your market data, research and risk assessment into one
              workspace.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/signup" size="lg" event="cta_get_started">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/how-it-works" variant="outline" size="lg" event="cta_explore">
                Explore MYLO Edge
              </Button>
            </div>
            <p className="num mt-7 text-[10.5px] tracking-[0.2em] text-ink-faint uppercase">
              No live trading · Simulated capital · You make the decision
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
