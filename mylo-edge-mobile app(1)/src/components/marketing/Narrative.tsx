import { useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Activity,
  BarChart3,
  Building2,
  Droplets,
  Globe2,
  Layers,
  Newspaper,
  Search,
  ShieldAlert,
  Users,
} from "lucide-react";
import { INTEL_PANELS, LENSES } from "../../data/demo";
import { Panel, Reveal, Section, SectionHeading, Disclosure } from "../ui";
import { cn } from "../../utils/cn";

/* ---------------- Problem ---------------- */

const FRAGMENTS = [
  { label: "Price charts", icon: BarChart3 },
  { label: "News feeds", icon: Newspaper },
  { label: "Indicators", icon: Activity },
  { label: "Economic events", icon: Globe2 },
  { label: "Sentiment", icon: Users },
  { label: "Fundamentals", icon: Building2 },
];

export function ProblemSection() {
  return (
    <Section id="problem">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <SectionHeading
            eyebrow="The problem"
            title="Trading gives you more information than clarity."
            sub="Most traders are not short of data. They are short of structure. Charts live in one tab, headlines in another, economic calendars somewhere else, and sentiment wherever it happens to surface."
          />
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Fragmented inputs make it hard to answer the questions that actually
            matter: what is happening, why is it happening, what evidence
            supports the idea, what contradicts it, and what is the cost of
            being wrong?
          </p>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink">
            MYLO Edge brings the relevant information together into one
            structured research workflow — so the evidence, the counter-argument
            and the risk arrive at the same time.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
          {FRAGMENTS.map((f, i) => (
            <Reveal key={f.label} delay={i * 0.05}>
              <Panel className="h-full p-4" hover>
                <f.icon className="h-4 w-4 text-ink-faint" aria-hidden />
                <p className="mt-6 text-[13.5px] text-ink-muted">{f.label}</p>
                <p className="num mt-1 text-[10px] tracking-[0.14em] text-ink-faint uppercase">
                  Isolated source
                </p>
              </Panel>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------- Lens flow ---------------- */

export function LensFlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.35"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="lenses" className="relative">
      <SectionHeading
        align="center"
        eyebrow="The workflow"
        title="One market. Multiple lenses."
        sub="Every instrument passes through the same sequence of evidence before it becomes something you can act on."
      />

      <div ref={ref} className="relative mx-auto mt-14 max-w-3xl">
        {/* spine */}
        <div
          className="absolute top-0 bottom-0 left-[7px] w-px bg-hairline sm:left-1/2"
          aria-hidden
        />
        <motion.div
          className="absolute top-0 left-[7px] w-px bg-gradient-to-b from-edge/80 to-edge/10 sm:left-1/2"
          style={{ height: reduce ? "100%" : height }}
          aria-hidden
        />

        <ol className="space-y-3">
          {LENSES.map((l, i) => {
            const isLast = i === LENSES.length - 1;
            const isEdge = l === "EDGE SCORE";
            return (
              <Reveal key={l} as="li" delay={Math.min(i * 0.04, 0.3)}>
                <div
                  className="relative flex items-center gap-3 sm:justify-center sm:gap-0"
                >
                  <span
                    className={cn(
                      "relative z-10 grid h-[14px] w-[14px] shrink-0 place-items-center rounded-full border sm:absolute sm:left-1/2 sm:-translate-x-1/2",
                      isLast || isEdge
                        ? "border-edge bg-edge/25"
                        : "border-hairline-strong bg-charcoal",
                    )}
                    style={{ marginLeft: 0 }}
                    aria-hidden
                  >
                    <span
                      className={cn(
                        "h-1 w-1 rounded-full",
                        isLast || isEdge ? "bg-edge" : "bg-ink-faint",
                      )}
                    />
                  </span>

                  <div
                    className={cn(
                      "flex-1 sm:flex-none",
                      i % 2 === 0 ? "sm:mr-auto sm:pr-14" : "sm:ml-auto sm:pl-14",
                    )}
                  >
                    <div
                      className={cn(
                        "glass-soft flex items-center justify-between gap-6 rounded-lg px-4 py-3 transition-colors hover:bg-white/[0.05] sm:w-[300px]",
                        (isLast || isEdge) && "border-edge/25 bg-edge/[0.06]",
                      )}
                    >
                      <span
                        className={cn(
                          "num text-[12.5px] font-medium tracking-[0.14em]",
                          isLast || isEdge ? "text-edge-soft" : "text-ink",
                        )}
                      >
                        {l}
                      </span>
                      <span className="num text-[10px] text-ink-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-[14px] text-ink-muted">
        The sequence is deliberate. Risk is evaluated before an opportunity is
        presented — never after the decision has already been framed.
      </p>
    </Section>
  );
}

/* ---------------- How it works ---------------- */

const STEPS = [
  {
    n: "01",
    t: "OBSERVE",
    icon: Layers,
    d: "MYLO collects relevant market information: price and volume history, technical state, headlines, scheduled events and macro context for the instrument.",
  },
  {
    n: "02",
    t: "ANALYZE",
    icon: Search,
    d: "Technical, fundamental, sentiment, news and macro conditions are evaluated against the current market regime rather than in isolation.",
  },
  {
    n: "03",
    t: "RESEARCH",
    icon: Users,
    d: "Research agents examine the strongest bullish and bearish arguments, then reconcile them into a concise, structured consensus view.",
  },
  {
    n: "04",
    t: "ASSESS RISK",
    icon: ShieldAlert,
    d: "MYLO evaluates invalidation, volatility, exposure and position risk before an opportunity is presented to you at all.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <SectionHeading
        eyebrow="How MYLO works"
        title="Four steps between raw market noise and a decision you can defend."
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <Panel className="group h-full p-5" hover>
              <div className="flex items-center justify-between">
                <span className="num text-[11px] tracking-[0.18em] text-edge">
                  {s.n}
                </span>
                <s.icon className="h-4 w-4 text-ink-faint transition-colors group-hover:text-edge" aria-hidden />
              </div>
              <h3 className="num mt-8 text-[14px] font-semibold tracking-[0.14em] text-ink">
                {s.t}
              </h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-muted">
                {s.d}
              </p>
            </Panel>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p className="mt-10 text-center text-[19px] font-medium text-ink sm:text-[22px]">
          You decide what happens next.
        </p>
      </Reveal>
    </Section>
  );
}

/* ---------------- Market intelligence panels ---------------- */

const ICONS: Record<string, typeof Activity> = {
  technical: Activity,
  news: Newspaper,
  sentiment: Users,
  fundamentals: Building2,
  macro: Globe2,
  liquidity: Droplets,
};

export function MarketIntelligence() {
  const [active, setActive] = useState(INTEL_PANELS[0].key);
  const panel = INTEL_PANELS.find((p) => p.key === active)!;
  const Icon = ICONS[panel.key];

  const toneClass = (t?: string) =>
    t === "bull"
      ? "text-bull"
      : t === "bear"
        ? "text-bear"
        : t === "warn"
          ? "text-caution"
          : "text-ink";

  return (
    <Section id="intelligence">
      <SectionHeading
        eyebrow="Market intelligence"
        title="See the market from more than one angle."
        sub="Each lens is a distinct body of evidence. Together they describe the state of an instrument — including where the evidence disagrees."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[260px_1fr]">
        <div
          className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          role="tablist"
          aria-label="Market intelligence lenses"
        >
          {INTEL_PANELS.map((p) => {
            const I = ICONS[p.key];
            const on = p.key === active;
            return (
              <button
                key={p.key}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(p.key)}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all lg:w-full",
                  on
                    ? "border-white/15 bg-white/[0.06] text-ink"
                    : "border-hairline bg-white/[0.015] text-ink-muted hover:border-hairline-strong hover:text-ink",
                )}
              >
                <I className={cn("h-4 w-4", on ? "text-edge" : "text-ink-faint")} aria-hidden />
                <span className="text-[13.5px] font-medium">{p.title}</span>
              </button>
            );
          })}
        </div>

        <Panel className="p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-hairline-strong bg-white/[0.03]">
              <Icon className="h-4.5 w-4.5 text-edge" aria-hidden />
            </span>
            <div>
              <h3 className="text-[18px] font-semibold text-ink">{panel.title}</h3>
              <p className="mt-1 text-[13.5px] text-ink-muted">{panel.blurb}</p>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-hairline border-t border-hairline">
            {panel.rows.map((r) => (
              <div key={r.k} className="flex items-center justify-between gap-4 py-3">
                <dt className="text-[13.5px] text-ink-muted">{r.k}</dt>
                <dd className={cn("num text-[13px] font-medium", toneClass(r.tone))}>
                  {r.v}
                </dd>
              </div>
            ))}
          </dl>

          <Disclosure className="mt-5">
            Illustrative panel values. Coverage and data confidence vary by asset
            class, region and provider; MYLO shows a confidence indicator where a
            data source is limited.
          </Disclosure>
        </Panel>
      </div>
    </Section>
  );
}
