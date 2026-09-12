import { useState } from "react";
import { ASSETS } from "../../data/demo";
import { track } from "../../lib/analytics";
import { Badge, Disclosure, Panel, Reveal, SectionHeading, Section } from "../ui";
import { TerminalPreview, biasTone } from "./Terminal";
import { cn } from "../../utils/cn";

export function InteractiveDemo() {
  const [idx, setIdx] = useState(0);
  const asset = ASSETS[idx];

  return (
    <Section id="demo">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Product demo"
          title="Switch the instrument. Watch the evidence change."
          sub="A simplified, offline version of the MYLO Edge workspace. Select an instrument to see how the same structured view adapts across asset classes."
        />
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Demo instrument selector"
        >
          {ASSETS.map((a, i) => (
            <button
              key={a.id}
              role="tab"
              aria-selected={i === idx}
              onClick={() => {
                setIdx(i);
                track("product_demo_used", { asset: a.symbol });
              }}
              className={cn(
                "num rounded-lg border px-3 py-2 text-[12px] tracking-[0.08em] transition-all",
                i === idx
                  ? "border-white/20 bg-white/[0.08] text-ink"
                  : "border-hairline-strong text-ink-muted hover:border-white/15 hover:text-ink",
              )}
            >
              {a.symbol}
            </button>
          ))}
        </div>
      </div>

      <Reveal className="mt-9">
        <TerminalPreview asset={asset} label="PRODUCT DEMO · SIMULATED" />
      </Reveal>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Panel className="p-5" hover>
          <p className="num text-[10px] tracking-[0.18em] text-ink-faint uppercase">
            Instrument
          </p>
          <p className="mt-2 text-[15px] font-medium text-ink">{asset.name}</p>
          <p className="mt-1 text-[13px] text-ink-muted">
            {asset.klass} · {asset.timeframe} horizon
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge tone={biasTone(asset.bias)}>{asset.bias}</Badge>
            <Badge tone="neutral">EDGE {asset.edge}</Badge>
            <Badge tone="warn">RISK {asset.risk}</Badge>
          </div>
        </Panel>

        <Panel className="p-5 lg:col-span-2" hover>
          <p className="num text-[10px] tracking-[0.18em] text-ink-faint uppercase">
            Research consensus · summary
          </p>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink">
            {asset.consensus}
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="num text-[10px] tracking-[0.16em] text-bull uppercase">
                Supporting
              </p>
              <ul className="mt-2 space-y-1.5">
                {asset.bull.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2 text-[13px] text-ink-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bull" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="num text-[10px] tracking-[0.16em] text-bear uppercase">
                Contradicting
              </p>
              <ul className="mt-2 space-y-1.5">
                {asset.bear.slice(0, 3).map((b) => (
                  <li key={b} className="flex gap-2 text-[13px] text-ink-muted">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-bear" aria-hidden />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Panel>
      </div>

      <Disclosure className="mt-5">
        Demonstration values only. Prices, scores and research summaries in this
        demo are static examples and are not live market data, forecasts or
        recommendations.
      </Disclosure>
    </Section>
  );
}
