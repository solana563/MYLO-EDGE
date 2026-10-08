import {
  Home,
  BarChart2,
  Activity,
  Zap,
  Briefcase,
  Bell,
  User,
  Search,
  Smartphone,
  Maximize2,
} from "lucide-react";
import { useMobileApp, MobileTab } from "./MobileAppContext";
import { HomeTab } from "./tabs/HomeTab";
import { MarketsTab } from "./tabs/MarketsTab";
import { TerminalTab } from "./tabs/TerminalTab";
import { SignalsTab } from "./tabs/SignalsTab";
import { PortfolioTab } from "./tabs/PortfolioTab";
import { TradeBottomSheet } from "./sheets/TradeBottomSheet";
import { AssetDetailSheet } from "./sheets/AssetDetailSheet";
import { NotificationsSheet } from "./sheets/NotificationsSheet";
import { ProfileSheet } from "./sheets/ProfileSheet";

export function MobileAppShell() {
  const {
    activeTab,
    setActiveTab,
    setIsProfileSheetOpen,
    setIsNotificationsOpen,
    setIsAssetDetailOpen,
    viewMode,
    setViewMode,
  } = useMobileApp();

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <HomeTab />;
      case "markets":
        return <MarketsTab />;
      case "terminal":
        return <TerminalTab />;
      case "signals":
        return <SignalsTab />;
      case "portfolio":
        return <PortfolioTab />;
      default:
        return <HomeTab />;
    }
  };

  const navItems: { id: MobileTab; label: string; icon: typeof Home; badge?: string }[] = [
    { id: "overview", label: "Home", icon: Home },
    { id: "markets", label: "Markets", icon: BarChart2 },
    { id: "terminal", label: "Terminal", icon: Activity },
    { id: "signals", label: "Signals", icon: Zap, badge: "76" },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
  ];

  // Mobile App Core UI (Content inside the phone or full screen)
  const appContent = (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#090a09] text-white select-none">
      {/* Native Mobile Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 border-b border-white/5">
        {/* User profile avatar */}
        <button
          onClick={() => setIsProfileSheetOpen(true)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#121513] text-ink hover:border-edge/50 transition-all active:scale-95"
        >
          <User className="h-4 w-4 text-edge" />
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-black bg-edge" />
        </button>

        {/* Search / Ticker Pill */}
        <button
          onClick={() => setActiveTab("markets")}
          className="flex h-9 flex-1 items-center gap-2 rounded-full border border-white/10 bg-[#121513] px-3.5 text-xs text-ink-muted transition-all hover:border-white/20"
        >
          <Search className="h-3.5 w-3.5 text-ink-faint" />
          <span className="truncate">Search BTC, AAPL, EUR...</span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#121513] text-ink hover:border-edge/50 transition-all active:scale-95"
        >
          <Bell className="h-4 w-4 text-ink-muted" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-edge" />
        </button>
      </div>

      {/* 3. Main Scrollable App View */}
      <main className="flex-1 overflow-y-auto px-4 pt-3 pb-6 overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
        {renderActiveTab()}
      </main>

      {/* 4. Native Bottom Navigation Tab Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="pb-safe shrink-0 border-t border-white/10 bg-[#0d0f0e]/95 backdrop-blur-xl"
      >
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "terminal") {
                    setIsAssetDetailOpen(false);
                  }
                }}
                className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                  isActive ? "text-edge" : "text-ink-muted hover:text-white"
                }`}
              >
                <div className="relative">
                  <Icon className={`h-5 w-5 ${isActive ? "text-edge stroke-[2.4]" : "stroke-[1.8]"}`} />
                  {item.badge && (
                    <span className="num absolute -top-1.5 -right-2.5 rounded-full bg-edge px-1 text-[8px] font-black text-black">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={`mt-1 text-[10px] font-semibold tracking-wide ${isActive ? "text-edge font-bold" : "text-ink-muted"}`}>
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 h-1 w-6 rounded-full bg-edge shadow-sm shadow-edge/50" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Slide-up Native Drawers */}
      <TradeBottomSheet />
      <AssetDetailSheet />
      <NotificationsSheet />
      <ProfileSheet />
    </div>
  );

  // If in full screen (or on actual mobile phone)
  if (viewMode === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#090a09]">
        {/* Optional Desktop Switcher Bar (only visible on wide screens) */}
        <div className="hidden sm:flex h-9 items-center justify-between border-b border-white/5 bg-[#121513] px-4 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-edge" />
            <span className="font-semibold text-white">MYLO EDGE Mobile App</span>
            <span className="text-[10px] text-ink-faint">· Native UI Engine</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#/"
              className="text-[11px] font-medium text-ink-muted hover:text-white"
            >
              Web Overview
            </a>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setViewMode("device")}
              className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-white/10"
            >
              <Smartphone className="h-3 w-3 text-edge" />
              <span>Switch to Phone Frame</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">{appContent}</div>
      </div>
    );
  }

  // Full-bleed native app view without fake phone hardware chrome
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#090a09]">
      <div className="flex-1 overflow-hidden">{appContent}</div>
    </div>
  );
}
