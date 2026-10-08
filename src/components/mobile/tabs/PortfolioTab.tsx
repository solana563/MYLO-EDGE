import { ArrowUpRight, ArrowDownRight, Wallet, History, XCircle, ShieldAlert } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { EquityCurve } from "../../charts/CandleChart";

export function PortfolioTab() {
  const { accountBalance, positions, closePosition, todayPnl, todayPnlPercent, setIsTradeSheetOpen } =
    useMobileApp();

  return (
    <div className="space-y-4 pb-24">
      {/* Portfolio Equity Header */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-[#161a17] via-[#101311] to-[#0d0f0e] p-5 shadow-2xl">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-ink-muted">
            <Wallet className="h-4 w-4 text-edge" />
            <span className="font-semibold tracking-wider uppercase">Paper Portfolio Equity</span>
          </div>
          <span className="rounded-full bg-edge/10 px-2 py-0.5 text-[10px] font-bold text-edge">
            Simulated
          </span>
        </div>

        <div className="mt-2.5">
          <span className="num text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <span className="num flex items-center text-xs font-semibold text-bull">
            <ArrowUpRight className="h-3.5 w-3.5" />
            +${todayPnl.toFixed(2)} (+{todayPnlPercent}%)
          </span>
          <span className="text-xs text-ink-faint">Unrealized P&L</span>
        </div>

        {/* Small Equity Curve */}
        <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-2.5">
          <div className="mb-1 flex items-center justify-between text-[10px] text-ink-faint">
            <span>Historical Equity Curve (Simulated)</span>
            <span className="text-edge font-semibold">+14.2% Total</span>
          </div>
          <div className="h-16 w-full">
            <EquityCurve height={64} className="h-full w-full" />
          </div>
        </div>
      </div>

      {/* Active Positions */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Open Paper Positions</h3>
            <p className="text-[10px] text-ink-muted">
              {positions.length} active trade{positions.length === 1 ? "" : "s"}
            </p>
          </div>
          <button
            onClick={() => setIsTradeSheetOpen(true)}
            className="rounded-lg bg-edge/10 px-2.5 py-1 text-xs font-semibold text-edge hover:bg-edge/20"
          >
            + New Order
          </button>
        </div>

        {positions.length === 0 ? (
          <div className="py-8 text-center text-xs text-ink-muted">
            <p>No open positions right now.</p>
            <button
              onClick={() => setIsTradeSheetOpen(true)}
              className="mt-2 text-edge font-semibold hover:underline"
            >
              Open a paper trade
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {positions.map((pos) => {
              const isProfit = pos.pnl >= 0;
              return (
                <div
                  key={pos.id}
                  className="rounded-xl border border-white/5 bg-black/30 p-3 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{pos.symbol}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                            pos.side === "LONG" ? "bg-bull/20 text-bull" : "bg-bear/20 text-bear"
                          }`}
                        >
                          {pos.side}
                        </span>
                      </div>
                      <p className="num mt-0.5 text-[11px] text-ink-muted">
                        Qty: {pos.qty} · Entry: ${pos.entryPrice.toLocaleString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`num text-sm font-bold flex items-center justify-end ${
                          isProfit ? "text-bull" : "text-bear"
                        }`}
                      >
                        {isProfit ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {isProfit ? "+" : ""}${pos.pnl.toFixed(2)}
                      </span>
                      <span className="num text-[10px] text-ink-muted">
                        ({isProfit ? "+" : ""}{pos.pnlPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Levels & Close button */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                    <div className="text-ink-muted">
                      {pos.stopLoss && (
                        <span>
                          SL: <strong className="text-bear">${pos.stopLoss}</strong>
                        </span>
                      )}
                      {pos.takeProfit && (
                        <span className="ml-2">
                          TP: <strong className="text-edge">${pos.takeProfit}</strong>
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => closePosition(pos.id)}
                      className="flex items-center gap-1 rounded bg-white/5 px-2 py-0.5 font-medium text-ink-muted hover:bg-white/10 hover:text-white"
                    >
                      <XCircle className="h-3 w-3 text-bear" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Backtesting Stats Card */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-edge" />
            <h3 className="text-sm font-bold text-white">Strategy Backtest Engine</h3>
          </div>
          <span className="num text-[10px] text-ink-faint">DEMO BENCHMARK</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-xl bg-black/20 p-2.5">
            <p className="text-[10px] text-ink-muted uppercase">Win Rate</p>
            <p className="num mt-1 font-bold text-edge">64.2%</p>
          </div>
          <div className="rounded-xl bg-black/20 p-2.5">
            <p className="text-[10px] text-ink-muted uppercase">Sharpe</p>
            <p className="num mt-1 font-bold text-white">1.82</p>
          </div>
          <div className="rounded-xl bg-black/20 p-2.5">
            <p className="text-[10px] text-ink-muted uppercase">Max DD</p>
            <p className="num mt-1 font-bold text-caution">-6.4%</p>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <div className="flex items-center gap-2 rounded-2xl border border-white/5 bg-black/20 p-3 text-[11px] text-ink-muted">
        <ShieldAlert className="h-4 w-4 shrink-0 text-caution" />
        <span>Paper trading uses simulated liquidity. Real market slippage will differ.</span>
      </div>
    </div>
  );
}
