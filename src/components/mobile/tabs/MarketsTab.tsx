import { useState } from "react";
import { Search, ArrowUpRight, ArrowDownRight, SlidersHorizontal } from "lucide-react";
import { useMobileApp } from "../MobileAppContext";
import { ASSETS, OPPORTUNITIES } from "../../../data/demo";
import { Sparkline } from "../../charts/CandleChart";

const CATEGORIES = ["All", "Crypto", "Stocks", "Forex", "Commodities", "Indices"] as const;

export function MarketsTab() {
  const { setSelectedAsset, setIsAssetDetailOpen, setActiveTab } = useMobileApp();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssets = OPPORTUNITIES.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.k === activeCategory;
    const matchesSearch =
      item.s.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.k.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-3 pb-24">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tickers, coins, forex..."
          className="w-full rounded-2xl border border-white/10 bg-[#121513] py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-ink-muted focus:border-edge/50 focus:outline-none"
        />
      </div>

      {/* Category Pills */}
      <div className="scroll-x flex gap-1.5 pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-edge text-black shadow-md shadow-edge/20"
                : "border border-white/5 bg-[#121513] text-ink-muted hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Market Table / List Cards */}
      <div className="rounded-[24px] border border-white/5 bg-[#121513] p-3">
        <div className="mb-2 flex items-center justify-between border-b border-white/5 px-2 pb-2 text-[10px] font-bold tracking-wider text-ink-faint uppercase">
          <span>Instrument</span>
          <div className="flex items-center gap-4">
            <span>Trend</span>
            <span>Edge / Risk</span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filteredAssets.map((item, idx) => {
            const assetObj = ASSETS.find((a) => a.symbol === item.s) || {
              ...ASSETS[0],
              symbol: item.s,
              klass: item.k as any,
              edge: item.edge,
            };
            const isUp = item.bias !== "BEARISH";

            return (
              <div
                key={item.s}
                onClick={() => {
                  setSelectedAsset(assetObj);
                  setIsAssetDetailOpen(true);
                }}
                className="flex cursor-pointer items-center justify-between py-2.5 px-2 transition-all hover:bg-white/[0.02] active:scale-[0.99]"
              >
                {/* Left info */}
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-xs font-bold text-white">
                    {item.s.slice(0, 3)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white">{item.s}</span>
                      <span className="rounded bg-white/5 px-1 py-0.2 text-[9px] text-ink-muted">
                        {item.k}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span className="num font-medium text-ink-muted">
                        ${assetObj.price || "234.50"}
                      </span>
                      <span
                        className={`num flex items-center text-[10px] font-semibold ${
                          isUp ? "text-bull" : "text-bear"
                        }`}
                      >
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {isUp ? "+1.8%" : "-0.8%"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right metrics */}
                <div className="flex items-center gap-3">
                  <div className="hidden h-5 w-16 sm:block">
                    <Sparkline seed={idx + 2} up={isUp} className="h-full w-full" />
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="num text-sm font-extrabold text-edge">{item.edge}</span>
                      <span className="text-[9px] text-ink-faint">EDGE</span>
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px]">
                      <span className="text-ink-faint">Risk</span>
                      <span
                        className={`font-semibold ${
                          item.risk > 60 ? "text-bear" : item.risk > 45 ? "text-caution" : "text-bull"
                        }`}
                      >
                        {item.risk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Terminal Launcher */}
      <div className="rounded-2xl border border-white/5 bg-black/20 p-3.5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white">Deep Chart Analysis</p>
          <p className="text-[11px] text-ink-muted">Switch to the interactive candlestick terminal</p>
        </div>
        <button
          onClick={() => setActiveTab("terminal")}
          className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-edge" />
          <span>Open Chart</span>
        </button>
      </div>
    </div>
  );
}
