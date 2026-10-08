import React, { createContext, useContext, useState } from "react";
import { ASSETS, DemoAsset } from "../../data/demo";

export type MobileTab = "overview" | "markets" | "terminal" | "signals" | "portfolio";

export type PaperPosition = {
  id: string;
  symbol: string;
  side: "LONG" | "SHORT";
  qty: string;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  stopLoss?: string;
  takeProfit?: string;
  openedAt: string;
};

interface MobileAppContextType {
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
  selectedAsset: DemoAsset;
  setSelectedAsset: (asset: DemoAsset) => void;
  isTradeSheetOpen: boolean;
  setIsTradeSheetOpen: (open: boolean) => void;
  isAssetDetailOpen: boolean;
  setIsAssetDetailOpen: (open: boolean) => void;
  isProfileSheetOpen: boolean;
  setIsProfileSheetOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  viewMode: "device" | "fullscreen";
  setViewMode: (mode: "device" | "fullscreen") => void;
  tradeSide: "BUY" | "SELL";
  setTradeSide: (side: "BUY" | "SELL") => void;
  positions: PaperPosition[];
  closePosition: (id: string) => void;
  addPosition: (position: Omit<PaperPosition, "id" | "openedAt">) => void;
  accountBalance: number;
  todayPnl: number;
  todayPnlPercent: number;
}

const INITIAL_POSITIONS: PaperPosition[] = [
  {
    id: "pos-1",
    symbol: "BTC/USD",
    side: "LONG",
    qty: "0.4500",
    entryPrice: 62450.0,
    currentPrice: 64182.4,
    pnl: 779.58,
    pnlPercent: 2.77,
    stopLoss: "62,380",
    takeProfit: "68,900",
    openedAt: "Today, 09:14",
  },
  {
    id: "pos-2",
    symbol: "AAPL",
    side: "LONG",
    qty: "140",
    entryPrice: 228.4,
    currentPrice: 231.68,
    pnl: 459.2,
    pnlPercent: 1.44,
    stopLoss: "224.10",
    takeProfit: "244.00",
    openedAt: "Yesterday",
  },
  {
    id: "pos-3",
    symbol: "EUR/USD",
    side: "SHORT",
    qty: "50,000",
    entryPrice: 1.0905,
    currentPrice: 1.0847,
    pnl: 290.0,
    pnlPercent: 0.53,
    stopLoss: "1.0938",
    takeProfit: "1.0665",
    openedAt: "2 days ago",
  },
];

const MobileAppContext = createContext<MobileAppContextType | null>(null);

export function MobileAppProvider({ children, initialTab }: { children: React.ReactNode; initialTab?: MobileTab }) {
  const [activeTab, setActiveTabState] = useState<MobileTab>(() => {
    if (initialTab) return initialTab;
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes("market")) return "markets";
      if (hash.includes("terminal") || hash.includes("chart")) return "terminal";
      if (hash.includes("signal") || hash.includes("research")) return "signals";
      if (hash.includes("portfolio") || hash.includes("paper")) return "portfolio";
    }
    return "overview";
  });
  const [selectedAsset, setSelectedAsset] = useState<DemoAsset>(ASSETS[0]);

  const setActiveTab = (tab: MobileTab) => {
    setActiveTabState(tab);
    if (typeof window !== "undefined") {
      const routeMap: Record<MobileTab, string> = {
        overview: "#/",
        markets: "#/markets",
        terminal: "#/terminal",
        signals: "#/signals",
        portfolio: "#/portfolio",
      };
      if (routeMap[tab]) {
        window.history.replaceState(null, "", routeMap[tab]);
      }
    }
  };
  const [isTradeSheetOpen, setIsTradeSheetOpen] = useState(false);
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(false);
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [tradeSide, setTradeSide] = useState<"BUY" | "SELL">("BUY");
  const [positions, setPositions] = useState<PaperPosition[]>(INITIAL_POSITIONS);
  const [accountBalance, setAccountBalance] = useState<number>(158290.5);

  // Default to device frame on desktop (>900px), full screen on mobile devices
  const [viewMode, setViewMode] = useState<"device" | "fullscreen">(() => {
    if (typeof window !== "undefined" && window.innerWidth < 800) {
      return "fullscreen";
    }
    return "device";
  });

  // Calculate total PnL
  const todayPnl = positions.reduce((acc, p) => acc + p.pnl, 0);
  const todayPnlPercent = 0.84;

  const closePosition = (id: string) => {
    setPositions((prev) => {
      const pos = prev.find((p) => p.id === id);
      if (pos) {
        setAccountBalance((b) => b + pos.pnl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  const addPosition = (newPos: Omit<PaperPosition, "id" | "openedAt">) => {
    const created: PaperPosition = {
      ...newPos,
      id: `pos-${Date.now()}`,
      openedAt: "Just now",
    };
    setPositions((prev) => [created, ...prev]);
  };

  return (
    <MobileAppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedAsset,
        setSelectedAsset,
        isTradeSheetOpen,
        setIsTradeSheetOpen,
        isAssetDetailOpen,
        setIsAssetDetailOpen,
        isProfileSheetOpen,
        setIsProfileSheetOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        viewMode,
        setViewMode,
        tradeSide,
        setTradeSide,
        positions,
        closePosition,
        addPosition,
        accountBalance,
        todayPnl,
        todayPnlPercent,
      }}
    >
      {children}
    </MobileAppContext.Provider>
  );
}

export function useMobileApp() {
  const context = useContext(MobileAppContext);
  if (!context) {
    throw new Error("useMobileApp must be used within a MobileAppProvider");
  }
  return context;
}
