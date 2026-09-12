import {
  AlertTriangle,
  ArrowDown,
  CalendarClock,
  Scale,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { EDGE_BREAKDOWN, ASSETS } from "../../data/demo";
import {
  Badge,
  CountUp,
  DemoTag,
  Disclosure,
  Meter,
  Panel,
  Reveal,
  Section,
  SectionHeading,
} from "../ui";
import { cn } from "../../utils/cn";

/* ---------------- Research consensus report ---------------- */

const REPORT: { key: string; body: string; tone?: "bull" | "bear" | "warn" }[] = [
  {
    key: "MARKET OUTLOOK",
    body: "Constructive over the current horizon while price holds above the reclaimed structural level. The regime is trending with expanding volatility, which raises both opportunity and dispersion.",
  },
  {
    key: "TECHNICAL",
    body: "Trend aligned across 50/200 EMA. Higher-low sequence intact. Nearest overhead supply is close enough to matter for position sizing.",
    tone: "bull",
  },
  {
    key: "NEWS",
    body: "Headline flow is clustered and net constructive, with one unresolved narrative that could re-price quickly if it develops.",
  },
  {
    key: "SENTIMENT",
    body: "Positioning has become one-sided over the short term. No sentiment/price divergence detected, but crowding reduces the margin for error.",
    tone: "warn",
  },
  {
    key: "FUNDAMENTALS",
    body: "Where the asset class supports it, valuation is in-line with peers and the earnings trajectory is improving; estimate revisions remain mixed.",
  },
  {
    key: "MACRO",
    body: "Policy path is data dependent. Real yields drifting lower is supportive; two high-importance events fall inside the horizon.",
    tone: "warn",
  },
  {
    key: "BULL CASE",
    body: "Trend, momentum and volume confirmation align, and a supportive catalyst sits inside the window. Continuation toward the first target is the base case if support holds.",
    tone: "bull",
  },
  {
    key: "BEAR CASE",
    body: "Volatility is above its 30-day average, resistance is near, macro uncertainty is unresolved and short-term sentiment is stretched. A failed retest invalidates the structure.",
    tone: "bear",
  },
  {
    key: "CONSENSUS",
    body: "Conditions currently favor the bullish case, but risk remains elevated. Position size should reflect the distance to invalidation rather than conviction in the thesis.",
  },
  {
    key: "RISKS",
    body: "Volatility expansion, event-driven gaps, liquidity thinning in off-hours sessions, and correlation risk against existing portfolio exposure.",
    tone: "bear",
  },
  {
    key: "CATALYSTS",
    body: "Scheduled macro release, a central bank event and a sector-relevant earnings print — all inside the next two sessions.",
  },
];

export function ResearchConsensus() {
  return (
    <Section id="research">
      <SectionHeading
        eyebrow="Research consensus"
        title="Don't just get a signal. Understand the case."
        sub="Every opportunity is accompanied by a structured research report. Findings are concise and evidence-led — including the arguments against the trade."
      />

      <Reveal className="mt-10">
        <Panel className="overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline bg-white/[0.02] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-3">
              <span className="num text-[13px] font-semibold tracking-wide text-ink">
                RESEARCH REPORT · {ASSETS[0].symbol}
              </span>
              <Badge tone="bull">BULLISH</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="neutral">EDGE 76</Badge>
              <DemoTag label="EXAMPLE REPORT" />
            </div>
          </div>

          <div className="grid divide-y divide-hairline lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
            {[REPORT.slice(0, 6), REPORT.slice(6)].map((col, ci) => (
              <div key={ci} className="divide-y divide-hairline">
                {col.map((r) => (
                  <div key={r.key} className="px-4 py-4 sm:px-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "num text-[10.5px] font-semibold tracking-[0.18em] uppercase",
                          r.tone === "bull"
                            ? "text-bull"
                            : r.tone === "bear"
                              ? "text-bear"
                              : r.tone === "warn"
                                ? "text-caution"
                                : "text-edge",
                        )}
                      >
                        {r.key}
                      </span>
                      <span className="h-px flex-1 bg-hairline" aria-hidden />
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-muted">
                      {r.body}
                    </p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Panel>
      </Reveal>

      <Disclosure className="mt-5">
        Research summaries are generated from available market information and
        are not guarantees of future performance. Underlying model reasoning is
        not exposed — only the structured findings above.
      </Disclosure>
    </Section>
  );
}

/* ---------------- Bull vs bear ---------------- */

const BULL = [
  "Trend alignment across timeframes",
  "Positive momentum confirmation",
  "Volume confirmation on advances",
  "Supportive catalyst inside the window",
];
const BEAR = [
  "Elevated realized volatility",
  "Resistance nearby overhead",
  "Macro uncertainty unresolved",
  "Contradictory positioning sentiment",
];

export function BullBearPanel() {
  return (
    <Section id="bull-bear">
      <SectionHeading
        align="center"
        eyebrow="Both sides"
        title="The case for. The case against. Every time."
        sub="A thesis you cannot argue against is not a thesis. MYLO builds and scores both sides before reaching a consensus view."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <Panel className="relative h-full overflow-hidden p-6" hover>
            <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(63,191,127,0.14),transparent)]" aria-hidden />
            <div className="relative flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-bull" aria-hidden />
              <h3 className="num text-[14px] font-semibold tracking-[0.18em] text-bull">
                BULL CASE
              </h3>
            </div>
            <ul className="relative mt-6 space-y-3">
              {BULL.map((b, i) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-lg border border-bull/12 bg-bull/[0.05] px-3.5 py-3"
                >
                  <span className="num mt-0.5 text-[10px] text-bull/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13.5px] text-ink">{b}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <Panel className="relative h-full overflow-hidden p-6" hover>
            <div className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-[radial-gradient(closest-side,rgba(224,87,77,0.14),transparent)]" aria-hidden />
            <div className="relative flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-bear" aria-hidden />
              <h3 className="num text-[14px] font-semibold tracking-[0.18em] text-bear">
                BEAR CASE
              </h3>
            </div>
            <ul className="relative mt-6 space-y-3">
              {BEAR.map((b, i) => (
                <li
                  key={b}
                  className="flex items-start gap-3 rounded-lg border border-bear/12 bg-bear/[0.05] px-3.5 py-3"
                >
                  <span className="num mt-0.5 text-[10px] text-bear/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[13.5px] text-ink">{b}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </Reveal>
      </div>

      <Reveal delay={0.12}>
        <div className="mx-auto mt-4 max-w-3xl">
          <Panel className="flex flex-col items-center gap-3 p-6 text-center">
            <Scale className="h-5 w-5 text-edge" aria-hidden />
            <p className="num text-[11px] tracking-[0.2em] text-edge uppercase">
              Research consensus
            </p>
            <p className="max-w-xl text-[15.5px] leading-relaxed text-ink">
              “Conditions currently favor the bullish case, but risk remains
              elevated.”
            </p>
            <DemoTag label="EXAMPLE OUTPUT" />
          </Panel>
        </div>
      </Reveal>
    </Section>
  );
}

/* ---------------- Edge score ---------------- */

export function EdgeScoreSection() {
  return (
    <Section id="edge-score">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Edge Score"
            title="Turn complexity into a clearer signal."
            sub="Edge Score condenses eight categories of evidence into a single number so you can triage quickly — then expand the breakdown to see exactly which components are carrying it."
          />
          <ul className="mt-6 space-y-3 text-[14px] text-ink-muted">
            {[
              "Composite of technical, momentum, news, sentiment, fundamental, macro, liquidity and risk inputs.",
              "Weighted by data availability and confidence — thin data lowers the contribution rather than being assumed away.",
              "Always paired with a risk assessment, never presented alone.",
            ].map((p) => (
              <li key={p} className="flex gap-3">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-edge" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <Disclosure className="mt-6">
            Edge Score is a composite decision-support metric. It is not a
            guarantee of future returns and is not a probability of profit.
          </Disclosure>
        </div>

        <Reveal>
          <Panel className="p-6 sm:p-8">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="flex items-baseline gap-3">
                  <CountUp to={76} className="text-[68px] leading-none font-semibold text-ink sm:text-[84px]" />
                  <span className="num text-[13px] text-ink-faint">/100</span>
                </div>
                <p className="num mt-2 text-[10.5px] tracking-[0.22em] text-edge uppercase">
                  Edge Score
                </p>
              </div>
              <div className="text-right">
                <Badge tone="bull">BULLISH</Badge>
                <p className="num mt-2 text-[10px] tracking-[0.14em] text-ink-faint uppercase">
                  Risk · moderate
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {EDGE_BREAKDOWN.map((f) => (
                <Meter
                  key={f.label}
                  label={f.label}
                  value={f.value}
                  tone={f.label === "RISK" ? "warn" : f.value >= 75 ? "bull" : "edge"}
                />
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-hairline pt-4">
              <span className="num text-[10px] tracking-[0.14em] text-ink-faint uppercase">
                Composite · demonstration
              </span>
              <DemoTag />
            </div>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------- Risk ---------------- */

const RISK_ROWS: { k: string; v: string; tone?: string }[] = [
  { k: "ENTRY", v: "64,050", tone: "text-ink" },
  { k: "INVALIDATION", v: "62,380", tone: "text-bear" },
  { k: "TARGET 1", v: "66,400", tone: "text-bull" },
  { k: "TARGET 2", v: "68,900", tone: "text-bull" },
  { k: "R:R", v: "2.1 : 1", tone: "text-ink" },
  { k: "VOLATILITY (ATR%)", v: "1.42%", tone: "text-caution" },
  { k: "POSITION RISK", v: "0.75% of account", tone: "text-ink" },
  { k: "MAX EXPOSURE", v: "12% of account", tone: "text-caution" },
];

const CHAIN = [
  { t: "Research", i: Scale },
  { t: "Signal", i: TrendingUp },
  { t: "Risk Engine", i: ShieldCheck },
  { t: "User Decision", i: CalendarClock },
];

export function RiskSection() {
  return (
    <Section id="risk">
      <SectionHeading
        eyebrow="Risk engine"
        title="Every opportunity has a risk profile."
        sub="Opportunity analysis and risk management are deliberately separated. The downside is defined before the upside is presented."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <Panel className="h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02] px-5 py-3">
              <span className="num text-[11px] tracking-[0.18em] text-ink uppercase">
                Risk assessment
              </span>
              <DemoTag label="SIMULATED" />
            </div>
            <dl className="grid grid-cols-1 divide-y divide-hairline sm:grid-cols-2 sm:divide-y-0">
              {RISK_ROWS.map((r) => (
                <div key={r.k} className="px-5 py-4 sm:odd:border-r sm:odd:border-hairline">
                  <dt className="num text-[9.5px] tracking-[0.16em] text-ink-faint uppercase">
                    {r.k}
                  </dt>
                  <dd className={cn("num mt-1.5 text-[16px] font-semibold", r.tone)}>
                    {r.v}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex items-start gap-2.5 border-t border-hairline bg-caution/[0.05] px-5 py-3.5">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caution" aria-hidden />
              <p className="text-[12.5px] leading-relaxed text-ink-muted">
                Invalidation is the level at which the thesis is considered
                wrong — not a stop-loss recommendation. Sizing and execution
                remain entirely your decision.
              </p>
            </div>
          </Panel>
        </Reveal>

        <div className="flex flex-col gap-4">
          <Reveal delay={0.06}>
            <Panel className="p-6">
              <p className="num text-[10px] tracking-[0.18em] text-ink-faint uppercase">
                Decision chain
              </p>
              <ol className="mt-5 space-y-2">
                {CHAIN.map((c, i) => (
                  <li key={c.t}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-4 py-3",
                        i === CHAIN.length - 1
                          ? "border-edge/30 bg-edge/[0.07]"
                          : "border-hairline bg-white/[0.02]",
                      )}
                    >
                      <c.i
                        className={cn(
                          "h-4 w-4",
                          i === CHAIN.length - 1 ? "text-edge" : "text-ink-faint",
                        )}
                        aria-hidden
                      />
                      <span
                        className={cn(
                          "num text-[12.5px] tracking-[0.12em] uppercase",
                          i === CHAIN.length - 1 ? "text-edge-soft" : "text-ink",
                        )}
                      >
                        {c.t}
                      </span>
                    </div>
                    {i < CHAIN.length - 1 && (
                      <div className="flex justify-center py-1" aria-hidden>
                        <ArrowDown className="h-3.5 w-3.5 text-ink-faint" />
                      </div>
                    )}
                  </li>
                ))}
              </ol>
            </Panel>
          </Reveal>

          <Reveal delay={0.12}>
            <Panel className="flex items-start gap-3 border-bear/20 bg-bear/[0.04] p-5">
              <ShieldCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-bear" aria-hidden />
              <p className="text-[14px] leading-relaxed text-ink">
                <strong className="font-semibold">
                  MYLO does not automatically place live trades.
                </strong>{" "}
                MYLO separates opportunity analysis from risk management, and
                leaves execution with you.
              </p>
            </Panel>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
