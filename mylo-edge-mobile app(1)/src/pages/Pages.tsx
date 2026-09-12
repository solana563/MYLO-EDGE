import { useEffect, type ReactNode } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  LineChart,
  ListChecks,
  Mail,
  ShieldQuestion,
} from "lucide-react";
import {
  Badge,
  Button,
  Disclosure,
  Panel,
  Reveal,
  Section,
} from "../components/ui";
import { Link } from "../lib/router";
import {
  HowItWorks,
  LensFlow,
  MarketIntelligence,
  ProblemSection,
} from "../components/marketing/Narrative";
import {
  BullBearPanel,
  EdgeScoreSection,
  ResearchConsensus,
  RiskSection,
} from "../components/marketing/Evidence";
import {
  BacktestingSection,
  EventRadar,
  ModulesSection,
  OpportunityMap,
  PaperTradingSection,
  ScannerPreview,
  SignalForensics,
} from "../components/marketing/Products";
import {
  Audiences,
  CTA,
  FAQSection,
  Philosophy,
  Pricing,
  RiskDisclosureSection,
  Security,
} from "../components/marketing/Company";
import { TerminalPreview } from "../components/product-demos/Terminal";
import { ASSETS } from "../data/demo";
import { track } from "../lib/analytics";

/* ---------------- shared page hero ---------------- */

export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  children?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-hairline">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="grid-bg absolute inset-0 opacity-60" />
        <div className="absolute -top-32 left-1/3 h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(91,143,217,0.13),transparent)]" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-5 pt-28 pb-14 sm:px-7 sm:pt-36 sm:pb-16">
        <p className="num text-[10.5px] tracking-[0.22em] text-edge uppercase">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-[32px] leading-[1.08] font-semibold sm:text-[46px]">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[15.5px] leading-relaxed text-ink-muted">
          {sub}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}

/* ---------------- How it works ---------------- */

export function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="Intelligence"
        title="From market noise to a decision you can defend."
        sub="MYLO Edge runs every instrument through the same structured sequence: observe, analyze, research, assess risk. Then it hands the decision back to you."
      >
        <Button to="/signup" event="how_it_works_cta">
          Get Started
          <ArrowRight className="h-4 w-4" />
        </Button>
      </PageHero>
      <ProblemSection />
      <LensFlow />
      <HowItWorks />
      <MarketIntelligence />
      <RiskSection />
      <Philosophy />
      <CTA />
    </>
  );
}

/* ---------------- Markets ---------------- */

const CLASSES = [
  { k: "Equities", d: "Single stocks and ETFs with fundamental context where the data supports it." },
  { k: "Crypto", d: "Major digital assets with 24/7 session and liquidity considerations." },
  { k: "Forex", d: "Major and cross pairs, framed against rate differentials and macro." },
  { k: "Commodities", d: "Metals and energy, with volatility and session-gap context." },
  { k: "Indices", d: "Broad benchmarks used for regime and correlation context." },
];

export function MarketsPage() {
  return (
    <>
      <PageHero
        eyebrow="Markets & charts"
        title="Explore markets with the context already attached."
        sub="Instruments are never shown as a bare price. Trend state, volatility, liquidity quality and the relevant catalysts travel with the chart."
      />
      <Section>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <TerminalPreview asset={ASSETS[3]} label="MYLO CHARTS · SIMULATED" />
          </Reveal>
          <div className="grid gap-3">
            {CLASSES.map((c, i) => (
              <Reveal key={c.k} delay={i * 0.05}>
                <Panel className="p-4" hover>
                  <div className="flex items-center justify-between">
                    <h2 className="num text-[12.5px] font-semibold tracking-[0.14em] text-ink uppercase">
                      {c.k}
                    </h2>
                    <Badge tone="neutral">Coverage varies</Badge>
                  </div>
                  <p className="mt-2 text-[13px] text-ink-muted">{c.d}</p>
                </Panel>
              </Reveal>
            ))}
          </div>
        </div>
        <Disclosure className="mt-5">
          Available instruments, historical depth and data granularity depend on
          the data providers connected to your plan and region. Data may be
          delayed or revised.
        </Disclosure>
      </Section>
      <OpportunityMap />
      <EventRadar />
      <CTA />
    </>
  );
}

/* ---------------- Signals ---------------- */

export function SignalsPage() {
  return (
    <>
      <PageHero
        eyebrow="Signals & scanner"
        title="Structured signals, and the evidence behind each one."
        sub="A signal in MYLO is not a instruction. It is a structured statement of what the evidence currently supports, what would invalidate it, and how much it could cost you to be wrong."
      />
      <Section>
        <Reveal>
          <ScannerPreview />
        </Reveal>
        <Disclosure className="mt-5">
          Scanner rows above are demonstration data. Signals in the application
          are generated from live provider data and always include an
          invalidation level and risk assessment.
        </Disclosure>
      </Section>
      <SignalForensics />
      <OpportunityMap />
      <EdgeScoreSection />
      <CTA />
    </>
  );
}

/* ---------------- Research ---------------- */

export function ResearchPage() {
  return (
    <>
      <PageHero
        eyebrow="Research"
        title="Understand the case, not just the conclusion."
        sub="MYLO uses advanced research models and the TradingAgents research framework internally to assemble structured arguments. What you see is the finding — concise, sourced in evidence, and paired with its counter-argument."
      />
      <ResearchConsensus />
      <BullBearPanel />
      <MarketIntelligence />
      <EdgeScoreSection />
      <CTA />
    </>
  );
}

/* ---------------- Backtesting ---------------- */

export function BacktestingPage() {
  return (
    <>
      <PageHero
        eyebrow="Backtesting"
        title="Put strategies through history — carefully."
        sub="A backtest is only useful if it is honest. MYLO's engine is designed around point-in-time evaluation, modelled costs and regime segmentation."
      />
      <BacktestingSection />
      <SignalForensics />
      <RiskDisclosureSection />
      <CTA />
    </>
  );
}

/* ---------------- Paper trading ---------------- */

export function PaperTradingPage() {
  return (
    <>
      <PageHero
        eyebrow="Paper trading"
        title="Practise the whole workflow with simulated capital."
        sub="Research an idea, place a simulated order, manage the position against its invalidation level, and review the outcome. No real money, no routed orders."
      />
      <PaperTradingSection />
      <RiskSection />
      <CTA />
    </>
  );
}

/* ---------------- Pricing ---------------- */

export function PricingPage() {
  useEffect(() => {
    track("pricing_viewed");
  }, []);
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Plans built around how much research you need."
        sub="Start with a free account and paper trading. Upgrade only when the deeper research, scanner and backtesting workflow is worth it to you."
      />
      <Pricing compact />
      <Audiences />
      <FAQSection limit={6} />
      <CTA />
    </>
  );
}

/* ---------------- About ---------------- */

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="MYLO Edge exists to make market research more structured, transparent and accessible."
        sub="Most traders do not fail because they lack information. They fail because the information they have is fragmented, one-sided, and arrives without its risk attached."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <div>
            <h2 className="text-[22px] font-semibold text-ink">What we build</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              MYLO Edge combines market data, technical analysis, research
              intelligence, risk assessment, backtesting and paper trading into
              one workflow. Each part is useful alone; the value is in the order
              they arrive in.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
              The goal is not to tell users what to trade. The goal is to help
              them understand the decision — what the evidence supports, what
              contradicts it, and what the downside looks like if the thesis
              fails.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink">
              We do not sell certainty. We do not promise profits. We do not
              claim to predict markets.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Market data", "Provider-sourced price, volume and event data with visible limitations."],
              ["Technical analysis", "Trend, momentum, volatility and structure, evaluated against regime."],
              ["Research intelligence", "Structured bull and bear cases reconciled into a consensus view."],
              ["Risk assessment", "Invalidation, volatility, position risk and exposure — before the idea."],
              ["Backtesting", "Historical strategy evaluation designed to limit look-ahead bias."],
              ["Paper trading", "A full simulated account to practise the workflow safely."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <Panel className="h-full p-5" hover>
                  <h3 className="text-[14px] font-medium text-ink">{t}</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{d}</p>
                </Panel>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>
      <Philosophy />
      <ModulesSection />
      <Security />
      <CTA />
    </>
  );
}

/* ---------------- Resources ---------------- */

const RESOURCES = [
  { i: Compass, t: "Market Guides", d: "How each asset class behaves, and what changes between them.", tag: "Guide" },
  { i: GraduationCap, t: "Trading Concepts", d: "Trend, momentum, volatility, liquidity and market structure explained plainly.", tag: "Guide" },
  { i: Microscope2, t: "Research Methodology", d: "How MYLO assembles a research consensus and where its limits are.", tag: "Methodology" },
  { i: LineChart, t: "Backtesting Guide", d: "Designing a test that tells you something true about a strategy.", tag: "Guide" },
  { i: ShieldQuestion, t: "Risk Management Guide", d: "Invalidation, position sizing, exposure and correlation in practice.", tag: "Guide" },
  { i: BookOpen, t: "Glossary", d: "Plain-language definitions for the terminology used across MYLO Edge.", tag: "Reference" },
];

function Microscope2(props: { className?: string }) {
  return <ListChecks {...props} />;
}

export function ResourcesPage() {
  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Learn the method, not just the buttons."
        sub="Guides, methodology notes and reference material. Content is authored in markdown and structured so a full documentation site and research blog can be added without re-architecting."
      />
      <Section>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r, i) => (
            <Reveal key={r.t} as="li" delay={i * 0.05}>
              <Panel className="group h-full p-5" hover>
                <div className="flex items-start justify-between">
                  <r.i className="h-4 w-4 text-edge" aria-hidden />
                  <Badge tone="neutral">{r.tag}</Badge>
                </div>
                <h2 className="mt-6 text-[15px] font-medium text-ink">{r.t}</h2>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{r.d}</p>
                <p className="num mt-4 text-[10.5px] tracking-[0.14em] text-ink-faint uppercase">
                  Coming with launch
                </p>
              </Panel>
            </Reveal>
          ))}
        </ul>
      </Section>
      <FAQSection />
      <CTA />
    </>
  );
}

/* ---------------- Contact ---------------- */

const CATEGORIES = ["General", "Support", "Partnerships", "Press", "Feedback"];

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the MYLO Edge team."
        sub="Product questions, partnership enquiries, press requests or feedback on the research workflow — pick a category and we will route it to the right place."
      />
      <Section>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel className="p-6 sm:p-8">
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              aria-describedby="contact-note"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className="num text-[10.5px] tracking-[0.16em] text-ink-faint uppercase">
                    Name
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="mt-2 h-11 w-full rounded-lg border border-hairline-strong bg-white/[0.02] px-3.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-edge/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className="num text-[10.5px] tracking-[0.16em] text-ink-faint uppercase">
                    Email
                  </label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="mt-2 h-11 w-full rounded-lg border border-hairline-strong bg-white/[0.02] px-3.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-edge/50"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="c-cat" className="num text-[10.5px] tracking-[0.16em] text-ink-faint uppercase">
                  Category
                </label>
                <select
                  id="c-cat"
                  name="category"
                  className="mt-2 h-11 w-full rounded-lg border border-hairline-strong bg-white/[0.02] px-3 text-[14px] text-ink focus:border-edge/50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-charcoal">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="c-msg" className="num text-[10.5px] tracking-[0.16em] text-ink-faint uppercase">
                  Message
                </label>
                <textarea
                  id="c-msg"
                  name="message"
                  rows={5}
                  className="mt-2 w-full rounded-lg border border-hairline-strong bg-white/[0.02] p-3.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-edge/50"
                  placeholder="How can we help?"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Mail className="h-4 w-4" />
                Send message
              </Button>
              <p id="contact-note" className="text-[12px] text-ink-faint">
                Development state: this form is not yet connected to a backend.
                Submissions are not sent or stored.
              </p>
            </form>
          </Panel>

          <div className="grid gap-3 self-start">
            {[
              ["Support", "Account, billing and product issues."],
              ["Partnerships", "Data providers, integrations and distribution."],
              ["Press", "Company information and media enquiries."],
              ["Feedback", "Tell us where the research workflow falls short."],
            ].map(([t, d]) => (
              <Panel key={t} className="p-5" hover>
                <h2 className="num text-[11.5px] font-semibold tracking-[0.16em] text-ink uppercase">
                  {t}
                </h2>
                <p className="mt-2 text-[13px] text-ink-muted">{d}</p>
              </Panel>
            ))}
            <Panel className="p-5">
              <p className="text-[13px] text-ink-muted">
                Looking for answers first?{" "}
                <Link to="/resources" className="text-edge underline underline-offset-2">
                  Read the FAQ
                </Link>
                .
              </p>
            </Panel>
          </div>
        </div>
      </Section>
    </>
  );
}


