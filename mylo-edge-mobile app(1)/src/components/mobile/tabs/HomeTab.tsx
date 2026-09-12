import { ArrowUpRight, Zap, Sparkles, ChevronRight, Activity, Calendar } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { ASSETS, OPPORTUNITIES, EVENTS } from "../../../data/demo";
import { Sparkline } from "../../charts/CandleChart";

export function HomeTab() {
  const {
    accountBalance,
    todayPnl,
    todayPnlPercent,
    setSelectedAsset,
    setIsAssetDetailOpen,
    setIsTradeSheetOpen,
    setActiveTab,
  } = useMobileApp();

  return (
    <div className="space-y-4 pb-24">
      {/* Account Equity Card */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#161a17] via-[#101311] to-[#0d0f0e] p-5 shadow-2xl">
        <div className="pointer-events-none absolute -top-16 -right-16 h-36 w-36 rounded-full bg-edge/10 blur-2xl" />

        <div className="flex items-center justify-between text-xs">
          <span className="num font-semibold tracking-wider text-ink-muted uppercase">
            Paper Account Balance
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-edge/10 px-2 py-0.5 text-[10px] font-bold text-edge">
            <span className="h-1.5 w-1.5 rounded-full bg-edge pulse-dot" />
            Active
          </span>
        </div>

        <div className="mt-2">
          <span className="num text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="num flex items-center text-xs font-semibold text-bull">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +${todayPnl.toFixed(2)} ({todayPnlPercent}%)
          </span>
          <span className="text-xs text-ink-faint">Today's P&L</span>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsTradeSheetOpen(true)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-edge py-2.5 text-xs font-bold text-black shadow-lg shadow-edge/20 transition-all active:scale-95"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Quick Trade</span>
          </button>
          <button
            onClick={() => setActiveTab("signals")}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
          >
            <Zap className="h-3.5 w-3.5 text-edge" />
            <span>Scan Signals</span>
          </button>
        </div>
      </div>

      {/* Ticker Tape / Mini Watchlist Chips */}
      <div>
        <div className="mb-2 flex items-center justify-between px-1">
          <span className="text-[11px] font-bold tracking-wider text-ink-muted uppercase">
            Live Watchlist
          </span>
          <button
            onClick={() => setActiveTab("markets")}
            className="text-[11px] font-medium text-edge hover:underline"
          >
            See all
          </button>
        </div>

        <div className="scroll-x flex gap-2.5 pb-1">
          {ASSETS.map((asset, idx) => {
            const isUp = asset.change >= 0;
            return (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  setIsAssetDetailOpen(true);
                }}
                className="flex w-36 shrink-0 flex-col rounded-2xl border border-white/5 bg-[#121513] p-3 text-left transition-all hover:border-white/15 active:scale-95"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{asset.symbol}</span>
                  <span
                    className={`num text-[10px] font-bold ${
                      isUp ? "text-bull" : "text-bear"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {asset.change}%
                  </span>
                </div>
                <div className="num mt-1 text-sm font-semibold text-white">${asset.price}</div>
                <div className="mt-2 h-5 w-full">
                  <Sparkline seed={idx + 4} up={isUp} className="h-full w-full" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Edge Opportunities (High score radar) */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-edge/10 text-edge">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Top Edge Opportunities</h3>
              <p className="text-[10px] text-ink-muted">Consensus score &gt; 70</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("signals")}
            className="flex items-center text-xs font-medium text-edge hover:underline"
          >
            <span>Forensics</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {OPPORTUNITIES.filter((o) => o.edge >= 68).slice(0, 4).map((opp) => {
            const matchAsset = ASSETS.find((a) => a.symbol === opp.s) || ASSETS[0];
            return (
              <div
                key={opp.s}
                onClick={() => {
                  setSelectedAsset(matchAsset);
                  setIsAssetDetailOpen(true);
                }}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-black/20 p-2.5 transition-all hover:border-white/15 hover:bg-black/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-white">
                    {opp.s.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{opp.s}</span>
                      <span className="rounded bg-white/5 px-1 py-0.2 text-[9px] text-ink-muted">
                        {opp.k}
                      </span>
                    </div>
                    <span className="num text-[10px] text-ink-muted">Risk: {opp.risk}/100</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="num text-base font-extrabold text-edge">{opp.edge}</span>
                    <span className="text-[9px] text-ink-faint">EDGE</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      opp.bias === "BULLISH" ? "text-bull" : "text-bear"
                    }`}
                  >
                    {opp.bias}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Catalysts preview */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-edge" />
            <h3 className="text-sm font-bold text-white">Upcoming Session Radar</h3>
          </div>
          <span className="num text-[10px] text-ink-faint">Today</span>
        </div>

        <div className="space-y-2 text-xs">
          {EVENTS.slice(0, 2).map((e) => (
            <div
              key={e.title}
              className="flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-2.5"
            >
              <div>
                <p className="font-semibold text-white">{e.title}</p>
                <p className="text-[10px] text-ink-muted">{e.markets}</p>
              </div>
              <div className="text-right">
                <span className="num font-bold text-edge">{e.time}</span>
                <p
                  className={`text-[9px] font-bold ${
                    e.importance === "HIGH" ? "text-bear" : "text-caution"
                  }`}
                >
                  {e.importance} VOL
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Philosophy Banner */}
      <div className="rounded-2xl border border-edge/20 bg-edge/[0.03] p-3.5 text-center">
        <p className="num text-[11px] font-bold tracking-widest text-edge uppercase">
          FIND THE EDGE · UNDERSTAND THE RISK · MAKE THE DECISION
        </p>
        <p className="mt-1 text-[11px] text-ink-muted">
          MYLO Edge provides decision-support research. You always make the final call.
        </p>
      </div>
    </div>
  );
}
