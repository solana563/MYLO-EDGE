import { useState } from "react";
import {
  Activity,
  ArrowRight,
  Bell,
  CandlestickChart,
  Globe,
  History,
  Microscope,
  ScanLine,
  Shield,
  Wallet,
} from "lucide-react";
import { EVENTS, FORENSICS, MODULES, OPPORTUNITIES } from "../../data/demo";
import { EquityCurve, Sparkline } from "../charts/CandleChart";
import {
  Badge,
  Button,
  DemoTag,
  Disclosure,
  Panel,
  Reveal,
  Section,
  SectionHeading,
} from "../ui";
import { Link } from "../../lib/router";
import { cn } from "../../utils/cn";

/* ---------------- Paper trading ---------------- */

const POSITIONS = [
  { s: "BTC/USD", side: "LONG", qty: "0.4200", entry: "62,180", mark: "64,182", pnl: 840.8, pct: 3.22 },
  { s: "AAPL", side: "LONG", qty: "120", entry: "228.40", mark: "231.68", pnl: 393.6, pct: 1.44 },
  { s: "EUR/USD", side: "SHORT", qty: "50,000", entry: "1.0905", mark: "1.0847", pnl: 290.0, pct: 0.53 },
  { s: "WTI", side: "LONG", qty: "18", entry: "78.90", mark: "77.15", pnl: -315.0, pct: -2.22 },
];

export function PaperTradingSection() {
  return (
    <Section id="paper-trading">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Paper trading"
            title="Test the idea before risking capital."
            sub="A full simulated account so you can practise the workflow end to end — from research, to order, to position management, to reviewing what actually happened."
          />
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {[
              "Simulated account",
              "Simulated orders",
              "Positions",
              "P&L tracking",
              "Portfolio view",
              "Risk controls",
              "Trade history",
              "Post-trade review",
            ].map((f) => (
              <li
                key={f}
                className="flex items-center gap-2.5 rounded-lg border border-hairline bg-white/[0.015] px-3.5 py-2.5 text-[13.5px] text-ink-muted"
              >
                <span className="h-1 w-1 rounded-full bg-edge" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-7">
            <Button to="/paper-trading" variant="outline" event="explore_paper_trading">
              Explore Paper Trading
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Reveal>
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02] px-4 py-3">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-edge" aria-hidden />
                <span className="num text-[11px] font-semibold tracking-[0.18em] text-ink uppercase">
                  Paper Trading
                </span>
              </div>
              <DemoTag label="SIMULATED ACCOUNT" />
            </div>

            <div className="grid grid-cols-1 divide-y divide-hairline sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              {[
                ["Equity", "104,209.40", "text-ink"],
                ["Open P&L", "+1,209.40", "text-bull"],
                ["Exposure", "38.4%", "text-caution"],
                ["Positions", "4", "text-ink"],
              ].map(([k, v, c]) => (
                <div key={k} className="px-4 py-3.5">
                  <p className="num text-[9.5px] tracking-[0.14em] text-ink-faint uppercase">{k}</p>
                  <p className={cn("num mt-1 text-[15px] font-semibold", c)}>{v}</p>
                </div>
              ))}
            </div>

            <div className="scroll-x">
              <span className="num flex items-center justify-end gap-1 px-4 pt-2 text-[10px] text-caution/70 sm:hidden">
                Scroll table →
              </span>
              <table className="w-full min-w-[520px] text-left">
                <caption className="sr-only">
                  Simulated paper trading positions — demonstration data
                </caption>
                <thead>
                  <tr className="border-y border-hairline bg-white/[0.015]">
                    {["Symbol", "Side", "Qty", "Entry", "Mark", "P&L"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="num px-4 py-2.5 text-[9.5px] font-medium tracking-[0.14em] text-ink-faint uppercase"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline">
                  {POSITIONS.map((p) => (
                    <tr key={p.s} className="transition-colors hover:bg-white/[0.02]">
                      <td className="num px-4 py-3 text-[12.5px] font-medium text-ink">{p.s}</td>
                      <td className="px-4 py-3">
                        <Badge tone={p.side === "LONG" ? "bull" : "bear"}>{p.side}</Badge>
                      </td>
                      <td className="num px-4 py-3 text-[12.5px] text-ink-muted">{p.qty}</td>
                      <td className="num px-4 py-3 text-[12.5px] text-ink-muted">{p.entry}</td>
                      <td className="num px-4 py-3 text-[12.5px] text-ink-muted">{p.mark}</td>
                      <td
                        className={cn(
                          "num px-4 py-3 text-[12.5px] font-medium",
                          p.pnl >= 0 ? "text-bull" : "text-bear",
                        )}
                      >
                        {p.pnl >= 0 ? "+" : ""}
                        {p.pnl.toFixed(2)}{" "}
                        <span className="text-[10.5px] opacity-70">
                          ({p.pct >= 0 ? "+" : ""}
                          {p.pct}%)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="border-t border-hairline bg-white/[0.015] px-4 py-2.5 text-[11px] text-ink-faint">
              Simulated capital only. No real orders are routed to any broker or
              exchange from MYLO Edge.
            </p>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------- Backtesting ---------------- */

export function BacktestingSection() {
  return (
    <Section id="backtesting">
      <SectionHeading
        eyebrow="Backtesting"
        title="Put strategies through history."
        sub="Test a rule set against historical market data, then examine the distribution of outcomes rather than a single headline number."
      />

      <div className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <Panel className="h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02] px-4 py-3">
              <span className="num text-[11px] tracking-[0.18em] text-ink uppercase">
                Equity curve
              </span>
              <DemoTag label="DEMO DATA · ILLUSTRATION" />
            </div>
            <div className="px-3 py-4">
              <EquityCurve />
              <div className="mt-2 flex items-center justify-between px-2 text-[10px] text-ink-faint">
                <span className="num">Shaded band · largest peak-to-trough decline</span>
                <span className="num">Illustrative shape only</span>
              </div>
            </div>
          </Panel>
        </Reveal>

        <Reveal delay={0.08}>
          <Panel className="h-full">
            <div className="grid grid-cols-1 divide-y divide-hairline sm:grid-cols-2 sm:divide-y-0">
              {[
                ["NET RETURN", "—"],
                ["WIN RATE", "—"],
                ["PROFIT FACTOR", "—"],
                ["MAX DRAWDOWN", "—"],
                ["SHARPE", "—"],
                ["TRADES", "—"],
              ].map(([k, v]) => (
                <div key={k} className="px-5 py-4 sm:odd:border-r sm:odd:border-hairline">
                  <p className="num text-[9.5px] tracking-[0.16em] text-ink-faint uppercase">{k}</p>
                  <p className="num mt-1.5 text-[22px] font-semibold text-ink-muted">{v}</p>
                </div>
              ))}
            </div>
            <p className="border-t border-hairline px-5 py-4 text-[12.5px] leading-relaxed text-ink-muted">
              Metrics are intentionally left blank in marketing material. MYLO
              does not publish invented performance statistics — your numbers
              come from your own strategy runs.
            </p>
          </Panel>
        </Reveal>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[
          {
            t: "Point-in-time data",
            d: "The engine is designed to evaluate rules using only information that was available at each bar, to limit look-ahead bias.",
          },
          {
            t: "Costs modelled",
            d: "Fees, spread and slippage assumptions are applied where the data and instrument support it, and are shown alongside results.",
          },
          {
            t: "Regime breakdowns",
            d: "Results can be segmented by market regime and volatility so a single favourable period doesn't define the strategy.",
          },
        ].map((c, i) => (
          <Reveal key={c.t} delay={i * 0.06}>
            <Panel className="h-full p-5" hover>
              <h3 className="text-[14.5px] font-medium text-ink">{c.t}</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{c.d}</p>
            </Panel>
          </Reveal>
        ))}
      </div>

      <Disclosure className="mt-5">
        Past performance does not guarantee future results. Backtests are
        historical simulations and cannot reproduce live execution conditions.
      </Disclosure>
    </Section>
  );
}

/* ---------------- Signal forensics ---------------- */

export function SignalForensics() {
  return (
    <Section id="forensics">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <SectionHeading
            eyebrow="Signal forensics"
            title="Every signal leaves a trail."
            sub="MYLO records the signals it produces and analyses what happened afterwards. The point is not to produce more signals — it is to understand which conditions produced useful ones."
          />
          <p className="mt-5 text-[14px] leading-relaxed text-ink-muted">
            Outcomes can be grouped by asset, timeframe, market regime, Edge
            Score band, signal type, volatility bucket and strategy — so the
            evidence about the system is held to the same standard as the
            evidence about the market.
          </p>
        </div>

        <Reveal>
          <Panel className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02] px-4 py-3">
              <span className="num text-[11px] tracking-[0.18em] text-ink uppercase">
                Outcome dimensions
              </span>
              <DemoTag label="STRUCTURE PREVIEW" />
            </div>
            <ul className="divide-y divide-hairline">
              {FORENSICS.map((f) => (
                <li key={f.dim} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <span className="text-[13.5px] text-ink">{f.dim}</span>
                  <span className="flex flex-wrap justify-end gap-1.5">
                    {[f.a, f.b, f.c].map((v) => (
                      <span
                        key={v}
                        className="num rounded border border-hairline-strong bg-white/[0.03] px-2 py-0.5 text-[10.5px] text-ink-muted"
                      >
                        {v}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className="border-t border-hairline bg-white/[0.015] px-4 py-2.5 text-[11px] text-ink-faint">
              Dimensions shown for structure. No outcome statistics are
              published here.
            </p>
          </Panel>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------- Opportunity map ---------------- */

const FILTERS = ["All", "Stocks", "Crypto", "Forex", "Commodities", "Indices"] as const;

export function OpportunityMap() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [hover, setHover] = useState<string | null>(null);
  const data = OPPORTUNITIES.filter((o) => filter === "All" || o.k === filter);

  return (
    <Section id="opportunity-map">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Opportunity map"
          title="Where the evidence and the risk actually sit."
          sub="Plot candidate instruments by Edge Score against assessed risk. Bubble size reflects momentum."
        />
        <div className="flex flex-wrap gap-2" role="group" aria-label="Asset class filter">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={cn(
                "num rounded-lg border px-3 py-1.5 text-[11.5px] tracking-[0.08em] transition-all",
                filter === f
                  ? "border-white/20 bg-white/[0.08] text-ink"
                  : "border-hairline-strong text-ink-muted hover:text-ink",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <Reveal className="mt-8">
        <Panel className="overflow-hidden p-4 sm:p-6">
          {/* Taller canvas on phones so the bubbles have room to separate. */}
          <div className="relative aspect-[4/5] w-full min-w-0 sm:aspect-[16/9]">
            {/* axes */}
            <div className="absolute inset-0 rounded-lg border border-hairline bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10%_20%]" aria-hidden />
            <span className="num absolute -top-0.5 left-3 z-10 text-[9.5px] tracking-[0.16em] text-ink-faint uppercase">
              High edge
            </span>
            <span className="num absolute bottom-1 left-3 z-10 text-[9.5px] tracking-[0.16em] text-ink-faint uppercase">
              Low edge
            </span>
            <span className="num absolute right-3 bottom-1 z-10 text-[9.5px] tracking-[0.16em] text-ink-faint uppercase">
              High risk →
            </span>

            {data.map((o) => {
              const size = 18 + (o.mom / 100) * 30;
              const tone =
                o.bias === "BULLISH" ? "#3fbf7f" : o.bias === "BEARISH" ? "#e0574d" : "#7fa8d9";
              const on = hover === o.s;
              return (
                <button
                  key={o.s}
                  type="button"
                  onMouseEnter={() => setHover(o.s)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(o.s)}
                  onBlur={() => setHover(null)}
                  aria-label={`${o.s}: Edge score ${o.edge}, risk ${o.risk}, momentum ${o.mom}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 hover:scale-110"
                  style={{
                    left: `${6 + o.risk * 0.86}%`,
                    top: `${96 - o.edge * 0.88}%`,
                    width: size,
                    height: size,
                    background: `${tone}22`,
                    border: `1px solid ${tone}${on ? "cc" : "66"}`,
                    boxShadow: on ? `0 0 0 6px ${tone}12` : undefined,
                  }}
                >
                  <span className="sr-only">{o.s}</span>
                  <span
                    className="num absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-medium"
                    style={{ color: tone }}
                    aria-hidden
                  >
                    {o.s.split("/")[0].slice(0, 4)}
                  </span>
                </button>
              );
            })}

            {hover && (
              <div className="pointer-events-none absolute top-3 right-3 z-20 rounded-lg border border-hairline-strong bg-charcoal/95 px-3 py-2 backdrop-blur">
                {(() => {
                  const o = data.find((d) => d.s === hover)!;
                  return (
                    <div className="num text-[11px]">
                      <p className="font-semibold text-ink">{o.s}</p>
                      <p className="mt-1 text-ink-muted">Edge {o.edge} · Risk {o.risk}</p>
                      <p className="text-ink-muted">Momentum {o.mom}</p>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-hairline pt-4">
            <div className="flex flex-wrap gap-4 text-[10.5px]">
              {[
                ["Bullish", "#3fbf7f"],
                ["Neutral", "#7fa8d9"],
                ["Bearish", "#e0574d"],
              ].map(([l, c]) => (
                <span key={l} className="num flex items-center gap-1.5 text-ink-faint">
                  <span className="h-2 w-2 rounded-full" style={{ background: c }} aria-hidden />
                  {l}
                </span>
              ))}
              <span className="num text-ink-faint">Bubble size = momentum</span>
            </div>
            <DemoTag label="DEMO · SIMULATED" />
          </div>

          {/* Mobile: the plotted canvas is too tight for in-bubble labels, so
              expose the same data as a ranked, tappable list. */}
          <ul className="mt-4 grid grid-cols-2 gap-2 border-t border-hairline pt-4 sm:hidden">
            {[...data]
              .sort((a, b) => b.edge - a.edge)
              .slice(0, 6)
              .map((o) => (
                <li key={o.s}>
                  <button
                    type="button"
                    onClick={() => setHover(hover === o.s ? null : o.s)}
                    aria-label={`Show ${o.s} on the opportunity map`}
                    className={cn(
                      "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                      hover === o.s
                        ? "border-edge/40 bg-edge/[0.08]"
                        : "border-hairline bg-white/[0.02]",
                    )}
                  >
                    <span className="num block text-[12px] font-semibold text-ink">{o.s}</span>
                    <span className="num mt-1 block text-[10.5px] text-ink-muted">
                      Edge {o.edge} · Risk {o.risk}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        </Panel>
      </Reveal>
    </Section>
  );
}

/* ---------------- Event radar ---------------- */

export function EventRadar() {
  return (
    <Section id="events">
      <SectionHeading
        eyebrow="Event radar"
        title="Know what is scheduled before you size the position."
        sub="Catalysts are part of the risk profile. The radar maps upcoming events to the markets they typically move."
      />

      <Reveal className="mt-10">
        <Panel className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02] px-4 py-3">
            <span className="num text-[11px] tracking-[0.18em] text-ink uppercase">
              Session timeline
            </span>
            <DemoTag label="DEMONSTRATION EVENTS" />
          </div>
          <ol className="relative">
            {EVENTS.map((e, i) => (
              <li
                key={e.time}
                className="group relative flex flex-col gap-3 border-b border-hairline px-4 py-4 transition-colors last:border-b-0 hover:bg-white/[0.02] sm:flex-row sm:items-center sm:gap-6 sm:px-5"
              >
                <div className="flex items-center gap-3 sm:w-32">
                  <span className="num text-[15px] font-semibold text-ink">{e.time}</span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      e.importance === "HIGH" ? "bg-bear" : "bg-caution",
                    )}
                    aria-hidden
                  />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-ink">{e.title}</p>
                  <p className="num mt-0.5 text-[11.5px] text-ink-faint">{e.markets}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone={e.importance === "HIGH" ? "bear" : "warn"}>
                    {e.importance} IMPORTANCE
                  </Badge>
                  <Badge tone="neutral">VOL · {e.vol}</Badge>
                </div>
                <span className="num hidden w-20 text-right text-[10px] text-ink-faint lg:block">
                  {String(i + 1).padStart(2, "0")}/{EVENTS.length}
                </span>
              </li>
            ))}
          </ol>
        </Panel>
      </Reveal>

      <Disclosure className="mt-5">
        The timeline above uses clearly marked demonstration events. In the
        application, the radar is populated from scheduled economic and
        corporate calendars provided by third parties.
      </Disclosure>
    </Section>
  );
}

/* ---------------- Modules ---------------- */

const ICONS: Record<string, typeof Globe> = {
  globe: Globe,
  scan: ScanLine,
  activity: Activity,
  candlestick: CandlestickChart,
  microscope: Microscope,
  history: History,
  wallet: Wallet,
  shield: Shield,
  bell: Bell,
};

export function ModulesSection() {
  return (
    <Section id="modules">
      <SectionHeading
        align="center"
        eyebrow="Product modules"
        title="Everything you need to investigate an opportunity."
        sub="Nine connected modules inside the MYLO Edge application. Each one answers a different part of the same question."
      />

      <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m, i) => {
          const I = ICONS[m.icon];
          return (
            <Reveal key={m.name} as="li" delay={Math.min(i * 0.05, 0.3)}>
              <Panel className="group relative h-full overflow-hidden" hover>
                <Link to={m.to} className="block p-5">
                  <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(127,168,217,0.14),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
                  <div className="relative flex items-start justify-between">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-hairline-strong bg-white/[0.03] transition-colors group-hover:border-edge/30">
                      <I className="h-4 w-4 text-ink-muted transition-colors group-hover:text-edge" aria-hidden />
                    </span>
                    <ArrowRight className="h-4 w-4 -translate-x-1 text-ink-faint opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                  </div>
                  <h3 className="num relative mt-7 text-[13px] font-semibold tracking-[0.14em] text-ink">
                    {m.name}
                  </h3>
                  <p className="relative mt-1.5 text-[13.5px] text-ink-muted">{m.desc}</p>
                </Link>
              </Panel>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* ---------------- Scanner preview (used on signals page) ---------------- */

export function ScannerPreview() {
  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-edge" aria-hidden />
          <span className="num text-[11px] tracking-[0.18em] text-ink uppercase">
            Scanner results
          </span>
        </div>
        <DemoTag label="SIMULATED" />
      </div>
      <div className="scroll-x">
        <span className="num flex items-center justify-end gap-1 px-4 pt-2 text-[10px] text-caution/70 sm:hidden">
          Scroll table →
        </span>
        <table className="w-full min-w-[560px] text-left">
          <caption className="sr-only">Simulated scanner results — demonstration data</caption>
          <thead>
            <tr className="border-b border-hairline bg-white/[0.015]">
              {["Symbol", "Class", "Bias", "Edge", "Risk", "Trend"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="num px-4 py-2.5 text-[9.5px] font-medium tracking-[0.14em] text-ink-faint uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {OPPORTUNITIES.slice(0, 8).map((o, i) => (
              <tr key={o.s} className="transition-colors hover:bg-white/[0.02]">
                <td className="num px-4 py-3 text-[12.5px] font-medium text-ink">{o.s}</td>
                <td className="px-4 py-3 text-[12.5px] text-ink-muted">{o.k}</td>
                <td className="px-4 py-3">
                  <Badge tone={o.bias === "BULLISH" ? "bull" : o.bias === "BEARISH" ? "bear" : "neutral"}>
                    {o.bias}
                  </Badge>
                </td>
                <td className="num px-4 py-3 text-[12.5px] font-semibold text-ink">{o.edge}</td>
                <td className="num px-4 py-3 text-[12.5px] text-ink-muted">{o.risk}</td>
                <td className="px-4 py-3">
                  <Sparkline seed={i + 2} up={o.bias !== "BEARISH"} className="h-5 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
