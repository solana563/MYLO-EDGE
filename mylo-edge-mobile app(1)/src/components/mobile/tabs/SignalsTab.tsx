import { useState } from "react";
import { Zap, TrendingUp, TrendingDown, ArrowRight, ShieldCheck, Filter } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { ASSETS, OPPORTUNITIES } from "../../../data/demo";

export function SignalsTab() {
  const { setSelectedAsset, setIsAssetDetailOpen, setIsTradeSheetOpen, setTradeSide } = useMobileApp();
  const [filterScore, setFilterScore] = useState<number>(0);

  const filtered = OPPORTUNITIES.filter((o) => o.edge >= filterScore);

  return (
    <div className="space-y-4 pb-24">
      {/* Header Explainer */}
      <div className="rounded-[24px] border border-white/10 bg-[#121513] p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-edge/10 text-edge">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Signal Engine & Consensus</h2>
            <p className="text-[11px] text-ink-muted">
              Evidence-backed research. Never an automated profit claim.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3 text-xs">
          <span className="flex items-center gap-1 text-ink-muted">
            <Filter className="h-3 w-3" />
            Min Edge Score:
          </span>
          <div className="flex gap-1.5">
            {[0, 60, 70].map((score) => (
              <button
                key={score}
                onClick={() => setFilterScore(score)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  filterScore === score
                    ? "bg-edge text-black font-bold"
                    : "bg-white/5 text-ink-muted hover:text-white"
                }`}
              >
                {score === 0 ? "All" : `${score}+`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-3">
        {filtered.map((opp) => {
          const asset = ASSETS.find((a) => a.symbol === opp.s) || ASSETS[0];
          const isBull = opp.bias === "BULLISH";

          return (
            <div
              key={opp.s}
              className="rounded-[24px] border border-white/5 bg-[#121513] p-4 shadow-lg transition-all hover:border-white/15"
            >
              {/* Top row */}
              <div className="flex items-start justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/40 text-sm font-bold text-white">
                    {opp.s.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">{opp.s}</span>
                      <span className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-ink-muted">
                        {opp.k}
                      </span>
                    </div>
                    <span
                      className={`num flex items-center gap-1 text-[11px] font-semibold ${
                        isBull ? "text-bull" : "text-bear"
                      }`}
                    >
                      {isBull ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {opp.bias} BIAS
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="num text-2xl font-extrabold text-edge">{opp.edge}</span>
                  <p className="text-[9px] text-ink-faint">EDGE SCORE</p>
                </div>
              </div>

              {/* Research Forensics / Summary */}
              <div className="mt-3 text-xs leading-relaxed text-ink-muted">
                {asset.consensus}
              </div>

              {/* Bull vs Bear Pill bullets */}
              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-xl bg-bull/[0.04] p-2 text-bull border border-bull/10">
                  <span className="font-bold">Bull: </span>
                  <span className="text-ink-muted">{asset.bull[0]}</span>
                </div>
                <div className="rounded-xl bg-bear/[0.04] p-2 text-bear border border-bear/10">
                  <span className="font-bold">Bear: </span>
                  <span className="text-ink-muted">{asset.bear[0]}</span>
                </div>
              </div>

              {/* Risk Invalidation & Actions */}
              <div className="mt-3.5 flex items-center justify-between border-t border-white/5 pt-3">
                <div className="text-[11px]">
                  <span className="text-ink-faint">Invalidation: </span>
                  <span className="num font-semibold text-bear">
                    ${asset.levels.invalidation}
                  </span>
                </div>

                <div className="flex gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsAssetDetailOpen(true);
                    }}
                    className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-white/10"
                  >
                    <span>Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAsset(asset);
                      setTradeSide(isBull ? "BUY" : "SELL");
                      setIsTradeSheetOpen(true);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-edge px-3 py-1.5 text-xs font-bold text-black shadow-md shadow-edge/20"
                  >
                    <span>Trade</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Engine notice */}
      <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-black/20 p-3 text-[11px] text-ink-muted">
        <ShieldCheck className="h-4 w-4 shrink-0 text-edge" />
        <span>Signals are structured research outputs. Invalidation must be observed before entry.</span>
      </div>
    </div>
  );
}
