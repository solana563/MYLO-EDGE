import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { ASSETS, makeCandles, type DemoAsset } from "../../data/demo";
import { CandleChart } from "../charts/CandleChart";
import { Badge, DemoTag, Meter } from "../ui";
import { cn } from "../../utils/cn";

export function biasTone(bias: DemoAsset["bias"]) {
  return bias === "BULLISH" ? "bull" : bias === "BEARISH" ? "bear" : "neutral";
}

function riskTone(risk: DemoAsset["risk"]) {
  return risk === "LOW" ? "bull" : risk === "MODERATE" ? "info" : risk === "ELEVATED" ? "warn" : "bear";
}

export function TerminalPreview({
  asset = ASSETS[0],
  compact = false,
  label = "SIMULATED TERMINAL",
}: {
  asset?: DemoAsset;
  compact?: boolean;
  label?: string;
}) {
  const candles = useMemo(
    () => makeCandles(asset.seed, asset.base, asset.drift, asset.vol, compact ? 48 : 64),
    [asset, compact],
  );
  const up = asset.change >= 0;

  return (
    <div className="glass overflow-hidden rounded-panel">
      {/* window chrome */}
      <div className="flex items-center justify-between gap-3 border-b border-hairline bg-white/[0.02] px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-white/12" />
            <span className="h-2 w-2 rounded-full bg-white/12" />
            <span className="h-2 w-2 rounded-full bg-white/12" />
          </span>
          <span className="num ml-1 text-[10px] tracking-[0.16em] text-ink-faint uppercase">
            mylo edge · terminal
          </span>
        </div>
        <DemoTag label={label} />
      </div>

      {/* instrument header */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-hairline px-4 py-3">
        <div className="flex items-baseline gap-2.5">
          <span className="num text-[15px] font-semibold tracking-wide text-ink">
            {asset.symbol}
          </span>
          <span className="num rounded border border-hairline-strong px-1.5 py-0.5 text-[10px] text-ink-muted">
            {asset.timeframe}
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="num text-[15px] font-semibold text-ink">{asset.price}</span>
          <span
            className={cn(
              "num inline-flex items-center gap-0.5 text-[12px] font-medium",
              up ? "text-bull" : "text-bear",
            )}
          >
            {asset.change === 0 ? (
              <Minus className="h-3 w-3" />
            ) : up ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {up ? "+" : ""}
            {asset.change.toFixed(2)}%
          </span>
        </div>
        <Badge tone={biasTone(asset.bias)}>{asset.bias}</Badge>
        <span className="num ml-auto hidden text-[10px] tracking-[0.14em] text-ink-faint uppercase sm:block">
          {asset.regime}
        </span>
      </div>

      {/* Mobile-only summary strip: keeps the headline metrics visible above
          the horizontally-scrolled chart instead of buried in the side rail. */}
      <dl className="grid grid-cols-3 divide-x divide-hairline border-b border-hairline lg:hidden">
        <div className="px-3 py-2.5">
          <dt className="num text-[9px] tracking-[0.14em] text-ink-faint uppercase">Edge</dt>
          <dd className="num mt-0.5 text-[17px] leading-none font-semibold text-ink">
            {asset.edge}
          </dd>
        </div>
        <div className="px-3 py-2.5">
          <dt className="num text-[9px] tracking-[0.14em] text-ink-faint uppercase">Risk</dt>
          <dd className="mt-1">
            <span
              className={cn(
                "num text-[11px] font-semibold",
                asset.risk === "LOW"
                  ? "text-bull"
                  : asset.risk === "MODERATE"
                    ? "text-info"
                    : asset.risk === "ELEVATED"
                      ? "text-caution"
                      : "text-bear",
              )}
            >
              {asset.risk}
            </span>
          </dd>
        </div>
        <div className="px-3 py-2.5">
          <dt className="num text-[9px] tracking-[0.14em] text-ink-faint uppercase">Bias</dt>
          <dd
            className={cn(
              "num mt-0.5 text-[11px] font-semibold",
              asset.bias === "BULLISH"
                ? "text-bull"
                : asset.bias === "BEARISH"
                  ? "text-bear"
                  : "text-ink-muted",
            )}
          >
            {asset.bias}
          </dd>
        </div>
      </dl>

      <div className="grid lg:grid-cols-[1fr_248px]">
        {/* chart */}
        <div className="border-b border-hairline px-2 py-3 lg:border-r lg:border-b-0">
          <div className="scroll-x -mx-3 px-3 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="min-w-[580px] sm:min-w-0">
              <CandleChart candles={candles} height={compact ? 200 : 248} />
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 px-1 text-[10px] text-ink-faint sm:px-2">
            <span className="num flex items-center gap-1.5">
              <span className="h-px w-4 bg-edge" /> EMA 26
            </span>
            <span className="num flex items-center gap-1.5">
              <span className="h-px w-4 border-t border-dashed border-caution" /> EMA 12
            </span>
            <span className="num flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-edge" /> Signal marker
            </span>
            <span className="num sm:ml-auto">Volume · lower pane</span>
            <span className="num text-caution/70 sm:hidden">Swipe chart →</span>
          </div>
        </div>

        {/* right rail */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="num text-[9.5px] tracking-[0.18em] text-ink-faint uppercase">
                Edge Score
              </p>
              <p className="num mt-0.5 text-[38px] leading-none font-semibold text-ink">
                {asset.edge}
              </p>
            </div>
            <div className="text-right">
              <p className="num text-[9.5px] tracking-[0.18em] text-ink-faint uppercase">
                Risk
              </p>
              <p className="mt-1.5">
                <Badge tone={riskTone(asset.risk)}>{asset.risk}</Badge>
              </p>
            </div>
          </div>

          <div className="mt-4 h-px bg-hairline" />

          <div className="mt-4 space-y-3">
            {asset.factors.map((f) => (
              <Meter
                key={f.label}
                label={f.label}
                value={f.value}
                compact
                tone={f.value >= 75 ? "bull" : f.value >= 60 ? "edge" : "warn"}
              />
            ))}
          </div>

          <div className="mt-4 h-px bg-hairline" />

          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
            {[
              ["Entry", asset.levels.entry],
              ["Invalidation", asset.levels.invalidation],
              ["Target 1", asset.levels.t1],
              ["R:R", asset.levels.rr],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="num text-[9px] tracking-[0.14em] text-ink-faint uppercase">{k}</dt>
                <dd
                  className={cn(
                    "num text-[12.5px] font-medium",
                    k === "Invalidation" ? "text-bear" : k === "Target 1" ? "text-bull" : "text-ink",
                  )}
                >
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <p className="border-t border-hairline bg-white/[0.015] px-4 py-2.5 text-[11px] text-ink-faint">
        Illustrative interface with simulated data. Not live market data and not
        a recommendation to buy or sell any instrument.
      </p>
    </div>
  );
}
