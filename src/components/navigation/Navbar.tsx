import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useRouter } from "../../lib/router";
import { Button } from "../ui";
import { cn } from "../../utils/cn";
import { track } from "../../lib/analytics";
import { useAuth } from "../../lib/auth";

const NAV = [
  { label: "Markets", to: "/markets" },
  { label: "Intelligence", to: "/how-it-works" },
  { label: "Signals", to: "/signals" },
  { label: "Research", to: "/research" },
  { label: "Backtesting", to: "/backtesting" },
  { label: "Paper Trading", to: "/paper-trading" },
  { label: "Pricing", to: "/pricing" },
  { label: "Resources", to: "/resources" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="relative grid h-7 w-7 place-items-center rounded-[7px] border border-white/12 bg-gradient-to-br from-white/12 to-white/[0.02]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
          <path d="M4 17L9 11L13 14L20 6" fill="none" stroke="#96e879" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="6" r="2" fill="#e8ecf2" />
        </svg>
      </span>
      <span className="num text-[13.5px] font-semibold tracking-[0.16em] text-ink">
        MYLO<span className="text-edge"> EDGE</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { path } = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-void"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-all duration-300 sm:px-5 sm:pt-5",
          scrolled
            ? "bg-void/75 pb-3 shadow-[0_12px_40px_-28px_rgba(0,0,0,1)] backdrop-blur-xl sm:pb-4"
            : "bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1200px] items-center justify-between gap-4"
        >
          <div className="flex h-12 items-center rounded-[14px] border border-white/[0.08] bg-charcoal/78 px-3 shadow-[0_12px_35px_-24px_rgba(0,0,0,1)] backdrop-blur-xl sm:px-4">
            <Link to="/" ariaLabel="MYLO Edge home" className="shrink-0">
              <Logo />
            </Link>

            <span className="mx-4 hidden h-5 w-px bg-white/[0.08] xl:block" aria-hidden />

            <ul className="hidden items-center gap-0.5 xl:flex">
              {NAV.map((n) => (
                <li key={n.to + n.label}>
                  <Link
                    to={n.to}
                    className={cn(
                      "rounded-lg px-2.5 py-2 text-[12px] transition-colors",
                      path === n.to
                        ? "bg-white/[0.055] text-ink"
                        : "text-ink-muted hover:bg-white/[0.035] hover:text-ink",
                    )}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden h-12 items-center gap-1 rounded-[14px] border border-white/[0.08] bg-charcoal/78 p-1 shadow-[0_12px_35px_-24px_rgba(0,0,0,1)] backdrop-blur-xl md:flex">
            <Button to="/" size="sm" variant="outline" className="border-edge/40 text-edge hover:bg-edge/10">
              Open App
            </Button>
            {loading ? (
              <span role="status" className="px-3 text-xs text-ink-muted">...</span>
            ) : user ? (
              <Button to="/onboarding" size="sm" event="account_nav">My Account</Button>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm" event="sign_in_nav">Sign In</Button>
                <Button to="/signup" size="sm" event="get_started_nav">Get Started</Button>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => {
              setOpen((v) => !v);
              if (!open) track("nav_opened");
            }}
            className="inline-flex h-12 items-center gap-2 rounded-[14px] border border-white/[0.08] bg-charcoal/80 px-3.5 text-[12px] text-ink-muted shadow-[0_12px_35px_-24px_rgba(0,0,0,1)] backdrop-blur-xl transition-colors hover:text-ink xl:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            <span className="num tracking-[0.12em] uppercase">Menu</span>
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-40 xl:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
        inert={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-void/90 backdrop-blur-xl transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "scroll-x pb-safe absolute inset-x-0 top-20 bottom-0 overflow-y-auto px-5 pt-4 transition-all duration-300",
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
          )}
        >
          <ul className="space-y-1">
            {NAV.map((n, i) => (
              <li key={n.label}>
                <Link
                  to={n.to}
                  className={cn(
                    "flex min-h-[58px] items-center justify-between gap-4 border-b border-hairline text-[19px] font-medium",
                    path === n.to ? "text-edge-soft" : "text-ink",
                  )}
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                  <span className="num text-[11px] text-ink-faint">
                    0{i + 1}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {loading ? (
              <span role="status" className="text-sm text-ink-muted">Checking session...</span>
            ) : user ? (
              <Button to="/onboarding" size="lg" className="sm:col-span-2">My Account</Button>
            ) : (
              <>
                <Button to="/login" variant="outline" size="lg">Sign In</Button>
                <Button to="/signup" size="lg">Get Started</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
