import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { Meter } from "../../ui";

export function AssetDetailSheet() {
  const { isAssetDetailOpen, setIsAssetDetailOpen, selectedAsset, setIsTradeSheetOpen, setTradeSide } =
    useMobileApp();

  if (!isAssetDetailOpen) return null;

  const isUp = selectedAsset.change >= 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAssetDetailOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal / Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border-t border-white/10 bg-[#121513] p-5 pb-8 shadow-2xl sm:rounded-[24px] sm:border"
        >
          {/* Sheet Handle */}
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/20 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{selectedAsset.symbol}</h3>
                <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                  {selectedAsset.klass}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                    selectedAsset.bias === "BULLISH"
                      ? "bg-bull/10 text-bull"
                      : selectedAsset.bias === "BEARISH"
                      ? "bg-bear/10 text-bear"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {selectedAsset.bias}
                </span>
              </div>
              <p className="text-xs text-ink-muted">{selectedAsset.name}</p>
            </div>
            <button
              onClick={() => setIsAssetDetailOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ink-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Price & Edge Score Hero */}
          <div className="mt-4 flex items-baseline justify-between rounded-2xl border border-white/5 bg-black/40 p-4">
            <div>
              <p className="text-xs text-ink-muted">Current Spot</p>
              <div className="flex items-baseline gap-2">
                <span className="num text-2xl font-bold text-white">${selectedAsset.price}</span>
                <span
                  className={`num flex items-center text-xs font-semibold ${
                    isUp ? "text-bull" : "text-bear"
                  }`}
                >
                  {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {isUp ? "+" : ""}
                  {selectedAsset.change}%
                </span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-semibold tracking-wider text-edge uppercase">
                Edge Score
              </p>
              <div className="flex items-baseline justify-end gap-1">
                <span className="num text-3xl font-extrabold text-white">
                  {selectedAsset.edge}
                </span>
                <span className="text-xs text-ink-faint">/100</span>
              </div>
            </div>
          </div>

          {/* Research Consensus Summary */}
          <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.02] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-edge">
              <Zap className="h-3.5 w-3.5" />
              <span>Research Consensus</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              {selectedAsset.consensus}
            </p>
          </div>

          {/* Factor Breakdown */}
          <div className="mt-4 space-y-2.5 rounded-xl border border-white/5 bg-black/20 p-3.5">
            <p className="text-[10px] font-bold tracking-widest text-ink-faint uppercase">
              Factor Breakdown
            </p>
            {selectedAsset.factors.map((f) => (
              <Meter
                key={f.label}
                label={f.label}
                value={f.value}
                compact
                tone={f.value >= 75 ? "bull" : f.value >= 60 ? "edge" : "warn"}
              />
            ))}
          </div>

          {/* Bull vs Bear Case Split */}
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl border border-bull/15 bg-bull/[0.03] p-3">
              <div className="flex items-center gap-1 font-semibold text-bull">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Bull Thesis</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-ink-muted">
                {selectedAsset.bull.slice(0, 2).map((item) => (
                  <li key={item} className="flex items-start gap-1">
                    <span className="text-bull">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-bear/15 bg-bear/[0.03] p-3">
              <div className="flex items-center gap-1 font-semibold text-bear">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>Bear Thesis</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-ink-muted">
                {selectedAsset.bear.slice(0, 2).map((item) => (
                  <li key={item} className="flex items-start gap-1">
                    <span className="text-bear">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setTradeSide("BUY");
                setIsAssetDetailOpen(false);
                setIsTradeSheetOpen(true);
              }}
              className="rounded-xl bg-edge py-3 text-xs font-bold tracking-wider text-black uppercase shadow-lg shadow-edge/20 transition-all hover:bg-edge-soft"
            >
              Paper Long
            </button>
            <button
              onClick={() => {
                setTradeSide("SELL");
                setIsAssetDetailOpen(false);
                setIsTradeSheetOpen(true);
              }}
              className="rounded-xl bg-bear py-3 text-xs font-bold tracking-wider text-white uppercase shadow-lg shadow-bear/20 transition-all hover:bg-bear/90"
            >
              Paper Short
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
