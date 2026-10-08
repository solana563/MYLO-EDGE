import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";

export function TradeBottomSheet() {
  const {
    isTradeSheetOpen,
    setIsTradeSheetOpen,
    selectedAsset,
    tradeSide,
    setTradeSide,
    addPosition,
    accountBalance,
  } = useMobileApp();

  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [amount, setAmount] = useState("1000");
  const [leverage, setLeverage] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isTradeSheetOpen) return null;

  const numericAmount = parseFloat(amount) || 0;
  const rawPrice = parseFloat(selectedAsset.price.replace(/,/g, "")) || 1;
  const estimatedUnits = (numericAmount * leverage) / rawPrice;
  const maxExposure = numericAmount * leverage;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericAmount <= 0) return;

    addPosition({
      symbol: selectedAsset.symbol,
      side: tradeSide === "BUY" ? "LONG" : "SHORT",
      qty: estimatedUnits < 1 ? estimatedUnits.toFixed(4) : estimatedUnits.toFixed(2),
      entryPrice: rawPrice,
      currentPrice: rawPrice,
      pnl: 0,
      pnlPercent: 0,
      stopLoss: selectedAsset.levels.invalidation,
      takeProfit: selectedAsset.levels.t1,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsTradeSheetOpen(false);
    }, 1400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsTradeSheetOpen(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal / Bottom Sheet */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg rounded-t-[28px] border-t border-white/10 bg-[#121513] p-5 pb-8 shadow-2xl sm:rounded-[24px] sm:border"
        >
          {/* Sheet Handle */}
          <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20 sm:hidden" />

          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-sm font-bold text-edge">
                {selectedAsset.symbol.slice(0, 3)}
              </span>
              <div>
                <h3 className="text-base font-semibold text-white">
                  Paper Trade · {selectedAsset.symbol}
                </h3>
                <p className="num text-xs text-ink-muted">
                  Spot: ${selectedAsset.price} · Edge {selectedAsset.edge}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsTradeSheetOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-ink-muted hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-edge/20 text-edge">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-white">Simulated Order Filled!</h4>
              <p className="mt-1 text-sm text-ink-muted">
                {tradeSide === "BUY" ? "Long" : "Short"} {selectedAsset.symbol} added to your paper
                portfolio.
              </p>
            </div>
          ) : (
            <form onSubmit={handleExecute} className="mt-4 space-y-4">
              {/* Buy / Sell Toggle */}
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setTradeSide("BUY")}
                  className={`rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    tradeSide === "BUY"
                      ? "bg-edge text-black shadow-lg shadow-edge/20"
                      : "text-ink-muted hover:text-white"
                  }`}
                >
                  Buy / Long
                </button>
                <button
                  type="button"
                  onClick={() => setTradeSide("SELL")}
                  className={`rounded-lg py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    tradeSide === "SELL"
                      ? "bg-bear text-white shadow-lg shadow-bear/20"
                      : "text-ink-muted hover:text-white"
                  }`}
                >
                  Sell / Short
                </button>
              </div>

              {/* Order Type & Presets */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setOrderType("MARKET")}
                    className={`rounded-md px-2.5 py-1 ${
                      orderType === "MARKET"
                        ? "bg-white/10 text-white font-medium"
                        : "text-ink-muted"
                    }`}
                  >
                    Market
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("LIMIT")}
                    className={`rounded-md px-2.5 py-1 ${
                      orderType === "LIMIT"
                        ? "bg-white/10 text-white font-medium"
                        : "text-ink-muted"
                    }`}
                  >
                    Limit
                  </button>
                </div>
                <span className="num text-ink-muted">
                  Avail: ${(accountBalance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Position Size Input */}
              <div className="rounded-xl border border-white/5 bg-black/30 p-3">
                <div className="flex justify-between text-xs text-ink-muted">
                  <span>Investment Amount (USD)</span>
                  <span className="num">Est. Units: {estimatedUnits.toFixed(4)}</span>
                </div>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-xl font-bold text-white">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="num w-full bg-transparent text-right text-xl font-bold text-white focus:outline-none"
                    placeholder="1000"
                  />
                </div>
                <div className="mt-2.5 flex justify-end gap-1.5">
                  {["250", "500", "1000", "2500"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className="rounded bg-white/5 px-2 py-0.5 text-[10px] text-ink-muted hover:bg-white/10 hover:text-white"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Leverage Selector */}
              <div className="rounded-xl border border-white/5 bg-black/20 p-3">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Simulated Leverage</span>
                  <span className="font-semibold text-edge">{leverage}x</span>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {[1, 2, 5, 10].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLeverage(l)}
                      className={`rounded-lg py-1.5 text-xs font-semibold ${
                        leverage === l
                          ? "border border-edge/60 bg-edge/10 text-edge"
                          : "bg-white/5 text-ink-muted hover:text-white"
                      }`}
                    >
                      {l}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Engine Breakdown */}
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <div className="flex items-center justify-between text-ink-muted">
                  <span>Invalidation Level</span>
                  <span className="num font-semibold text-bear">
                    ${selectedAsset.levels.invalidation}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-ink-muted">
                  <span>Target 1 (R:R {selectedAsset.levels.rr})</span>
                  <span className="num font-semibold text-edge">
                    ${selectedAsset.levels.t1}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between border-t border-white/5 pt-1.5 text-ink-muted">
                  <span>Max Exposure</span>
                  <span className="num text-white">${maxExposure.toLocaleString()}</span>
                </div>
              </div>

              {/* Notice */}
              <div className="flex items-center gap-2 text-[11px] text-ink-faint">
                <ShieldCheck className="h-3.5 w-3.5 text-edge" />
                <span>Simulated Paper Execution · No real funds at risk.</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={numericAmount <= 0}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold tracking-wide uppercase shadow-lg transition-all ${
                  tradeSide === "BUY"
                    ? "bg-edge text-black hover:bg-edge-soft shadow-edge/20"
                    : "bg-bear text-white hover:bg-bear/90 shadow-bear/20"
                } disabled:opacity-50`}
              >
                <span>
                  Confirm {tradeSide === "BUY" ? "Buy" : "Sell"} ${selectedAsset.symbol}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
