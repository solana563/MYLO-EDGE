import { Link } from "../../lib/router";
import { SITE } from "../../lib/seo";
import { Logo } from "./Navbar";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Markets", to: "/markets" },
      { label: "Scanner", to: "/signals" },
      { label: "Signals", to: "/signals" },
      { label: "Charts", to: "/markets" },
      { label: "Research", to: "/research" },
      { label: "Backtest", to: "/backtesting" },
      { label: "Paper Trading", to: "/paper-trading" },
      { label: "Risk", to: "/how-it-works" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/resources" },
      { label: "Research", to: "/research" },
      { label: "Help Center", to: "/resources" },
      { label: "FAQ", to: "/resources" },
      { label: "Get the App", to: "/install" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Use", to: "/terms" },
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Trading Risk Disclosure", to: "/risk-disclosure" },
      { label: "Cookie Policy", to: "/cookies" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-graphite/60">
      <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-7 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_2.7fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              Find your market edge. Market intelligence, research and risk
              analysis in one workspace.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {SITE.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    rel="noreferrer noopener"
                    target="_blank"
                    className="num inline-flex rounded-md border border-hairline-strong px-2.5 py-1.5 text-[11px] tracking-[0.1em] text-ink-muted uppercase transition-colors hover:border-white/20 hover:text-ink"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h2 className="num text-[10.5px] font-semibold tracking-[0.18em] text-ink-faint uppercase">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={col.title + l.label}>
                      <Link
                        to={l.to}
                        className="text-[13.5px] text-ink-muted transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-panel border border-hairline bg-white/[0.015] p-4 text-[12px] leading-relaxed text-ink-faint">
          <strong className="text-ink-muted">Risk notice.</strong> MYLO Edge is a
          decision-support and market-research platform. It does not provide
          financial advice or guaranteed investment returns, and it does not
          place live trades. Market data may be delayed, incomplete or
          incorrect depending on providers. Historical performance and
          backtesting results do not guarantee future results. You are
          responsible for your own trading and investment decisions.{" "}
          <Link to="/risk-disclosure" className="text-edge underline underline-offset-2">
            Read the full Trading Risk Disclosure
          </Link>
          .
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-hairline pt-6 text-[12.5px] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MYLO Edge. All rights reserved.</p>
          <p className="num tracking-[0.1em] uppercase">
            Find your market edge.
          </p>
        </div>
      </div>
    </footer>
  );
}
