import { useState, useMemo } from "react";
import { ArrowUpRight, ArrowDownRight, Layers, ShieldCheck, Activity } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { ASSETS, makeCandles } from "../../../data/demo";
import { CandleChart } from "../../charts/CandleChart";

const TIMEFRAMES = ["1H", "4H", "1D", "1W"] as const;

export function TerminalTab() {
  const { selectedAsset, setSelectedAsset, setIsTradeSheetOpen, setTradeSide } = useMobileApp();
  const [activeTimeframe, setActiveTimeframe] = useState<string>("1H");

  const candles = useMemo(
    () => makeCandles(selectedAsset.seed, selectedAsset.base, selectedAsset.drift, selectedAsset.vol, 48),
    [selectedAsset]
  );

  const isUp = selectedAsset.change >= 0;

  return (
    <div className="space-y-3 pb-24">
      {/* Ticker Selector Pills */}
      <div className="scroll-x flex gap-1.5 pb-1">
        {ASSETS.map((asset) => (
          <button
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedAsset.id === asset.id
                ? "bg-edge text-black shadow-md shadow-edge/20"
                : "border border-white/5 bg-[#121513] text-ink-muted hover:text-white"
            }`}
          >
            {asset.symbol}
          </button>
        ))}
      </div>

      {/* Main Terminal Header Card */}
      <div className="rounded-[24px] border border-white/10 bg-[#121513] p-4 shadow-xl">
        {/* Top Info */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white">{selectedAsset.symbol}</span>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                {selectedAsset.klass}
              </span>
            </div>
            <p className="text-xs text-ink-muted">{selectedAsset.name}</p>
          </div>

          <div className="text-right">
            <div className="flex items-baseline justify-end gap-1.5">
              <span className="num text-2xl font-extrabold text-white">
                ${selectedAsset.price}
              </span>
            </div>
            <span
              className={`num inline-flex items-center text-xs font-semibold ${
                isUp ? "text-bull" : "text-bear"
              }`}
            >
              {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {isUp ? "+" : ""}
              {selectedAsset.change}%
            </span>
          </div>
        </div>

        {/* Timeframe Bar */}
        <div className="mt-4 flex items-center justify-between border-y border-white/5 py-2">
          <div className="flex gap-1">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                  activeTimeframe === tf
                    ? "bg-white/10 text-white"
                    : "text-ink-muted hover:text-white"
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-ink-faint">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-edge" />
              EMA 26
            </span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-caution" />
              EMA 12
            </span>
          </div>
        </div>

        {/* Candlestick Chart View */}
        <div className="mt-2 overflow-hidden py-1">
          <CandleChart candles={candles} height={210} />
        </div>

        {/* Chart Legend / Levels */}
        <div className="mt-2 grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-center text-xs">
          <div className="rounded-xl bg-black/20 p-2">
            <p className="text-[10px] text-ink-muted uppercase">Invalidation</p>
            <p className="num mt-0.5 font-bold text-bear">${selectedAsset.levels.invalidation}</p>
          </div>
          <div className="rounded-xl bg-black/20 p-2">
            <p className="text-[10px] text-ink-muted uppercase">Target 1</p>
            <p className="num mt-0.5 font-bold text-edge">${selectedAsset.levels.t1}</p>
          </div>
          <div className="rounded-xl bg-black/20 p-2">
            <p className="text-[10px] text-ink-muted uppercase">R:R Ratio</p>
            <p className="num mt-0.5 font-bold text-white">{selectedAsset.levels.rr}</p>
          </div>
        </div>
      </div>

      {/* Edge Score & Market Regime Card */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-edge/10 text-edge">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Market Regime</p>
              <p className="num text-[10px] text-ink-muted">{selectedAsset.regime}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="num text-xl font-bold text-edge">{selectedAsset.edge}</span>
            <span className="text-[10px] text-ink-faint"> /100 EDGE</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px] text-ink-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-edge" />
          <span>Risk evaluated as {selectedAsset.risk.toLowerCase()} on this timeframe.</span>
        </div>
      </div>

      {/* Simulated Order Book / Depth Snapshot */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-4 text-xs">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-edge" />
            Order Book Liquidity
          </span>
          <span className="num text-[10px] text-ink-faint">Spread: 0.01%</span>
        </div>

        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between text-bear">
            <span>64,210.00</span>
            <span className="text-ink-muted">1.452 BTC</span>
          </div>
          <div className="flex justify-between text-bear">
            <span>64,195.50</span>
            <span className="text-ink-muted">0.820 BTC</span>
          </div>
          <div className="border-y border-white/5 py-1 text-center font-bold text-white">
            ${selectedAsset.price} <span className="text-[9px] text-edge">MID</span>
          </div>
          <div className="flex justify-between text-bull">
            <span>64,170.00</span>
            <span className="text-ink-muted">2.110 BTC</span>
          </div>
          <div className="flex justify-between text-bull">
            <span>64,155.00</span>
            <span className="text-ink-muted">3.400 BTC</span>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => {
            setTradeSide("BUY");
            setIsTradeSheetOpen(true);
          }}
          className="rounded-xl bg-edge py-3.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-edge/20 transition-all active:scale-95"
        >
          Paper Buy / Long
        </button>
        <button
          onClick={() => {
            setTradeSide("SELL");
            setIsTradeSheetOpen(true);
          }}
          className="rounded-xl bg-bear py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-bear/20 transition-all active:scale-95"
        >
          Paper Sell / Short
        </button>
      </div>
    </div>
  );
}
