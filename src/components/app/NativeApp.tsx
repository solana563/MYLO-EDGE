import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowDownToLine, Check, CloudOff, Download, RotateCcw, Share, X } from "lucide-react";
import { useInstallPrompt, useOnline, useServiceWorker, type AppPlatform } from "../../lib/pwa";
import { track } from "../../lib/analytics";
import { Button } from "../ui";
import { cn } from "../../utils/cn";

const INSTALL_DISMISS_KEY = "mylo:install-dismissed-at";
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

function readDismissed(): boolean {
  try {
    const raw = window.localStorage.getItem(INSTALL_DISMISS_KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

/** Applies native-app chrome to the document when running standalone. */
export function useAppChrome(installed: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-standalone", installed);
    return () => root.classList.remove("is-standalone");
  }, [installed]);
}

export function InstallBanner() {
  const { platform, installed, support, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(readDismissed);
  const online = useOnline();
  const reduce = useReducedMotion();

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      window.localStorage.setItem(INSTALL_DISMISS_KEY, String(Date.now()));
    } catch {
      /* private browsing: banner simply returns next load */
    }
  }, []);

  const install = async () => {
    const outcome = await promptInstall();
    track("cta_clicked", { cta: `install_${outcome}` });
    if (outcome === "accepted") dismiss();
  };

  // Don't prompt to install while the connection is down, and keep the offline
  // notice (which shares this position) unobstructed.
  const visible = online && !installed && !dismissed && support !== "unavailable";
  useAppChrome(installed);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="app-banner fixed inset-x-3 bottom-3 z-30 sm:inset-x-auto sm:right-5 sm:w-[380px]"
          role="region"
          aria-label="Install MYLO Edge"
        >
          <div className="glass rounded-panel p-4 pr-11">
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss install suggestion"
              className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-md text-ink-faint transition-colors hover:bg-white/5 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>

            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-white/10 bg-white/[0.04]">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path d="M4 17L9 11L13 14L20 6" fill="none" stroke="#96e879" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="6" r="2" fill="#e8ecf2" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-ink">Install MYLO Edge</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-ink-muted">
                  {platform === "ios"
                    ? "Add it to your Home Screen for a full-screen app that opens instantly."
                    : "Install the app for full-screen access and offline browsing."}
                </p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button size="sm" className="flex-1" onClick={install} event="install_prompt">
                <Download className="h-3.5 w-3.5" aria-hidden />
                Install
              </Button>
              {platform === "ios" && (
                <Button size="sm" variant="outline" to="/install" event="install_help">
                  How
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function UpdateToast() {
  const { updateReady, applyUpdate } = useServiceWorker();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {updateReady && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-3 top-[76px] z-30 sm:left-1/2 sm:right-auto sm:w-[420px] sm:-translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <div className="glass flex items-center gap-3 rounded-panel px-4 py-3">
            <Check className="h-4 w-4 shrink-0 text-edge" aria-hidden />
            <p className="flex-1 text-[13px] text-ink-muted">A new version of MYLO Edge is ready.</p>
            <Button size="sm" onClick={applyUpdate} event="app_update">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden />
              Refresh
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function OfflineNotice() {
  const online = useOnline();
  const reduce = useReducedMotion();

  return (
    <AnimatePresence>
      {!online && (
        <motion.div
          initial={reduce ? false : { opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="app-banner fixed inset-x-3 bottom-3 z-30 sm:left-1/2 sm:right-auto sm:w-auto sm:-translate-x-1/2"
        >
          <div
            className="glass flex items-center justify-center gap-2 rounded-panel px-4 py-2.5"
            role="status"
            aria-live="polite"
          >
            <CloudOff className="h-3.5 w-3.5 shrink-0 text-caution" aria-hidden />
            <p className="text-[12px] text-caution">
              Offline. Cached pages are available; live data and sign-in need a connection.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const STEPS: Record<AppPlatform, { title: string; steps: string[] }> = {
  ios: {
    title: "iPhone and iPad",
    steps: [
      "Open myloedge.com in Safari.",
      "Tap the Share button in the toolbar.",
      "Scroll and tap “Add to Home Screen”.",
      "Tap Add. MYLO Edge opens full screen from your Home Screen.",
    ],
  },
  android: {
    title: "Android",
    steps: [
      "Open myloedge.com in Chrome.",
      "Tap “Install app” when prompted, or the install icon in the address bar.",
      "Confirm. MYLO Edge appears in your app drawer.",
    ],
  },
  desktop: {
    title: "Windows, macOS, Linux and ChromeOS",
    steps: [
      "Open myloedge.com in Chrome, Edge or another Chromium browser.",
      "Select the install icon in the address bar, or use the browser's “Install app” menu item.",
      "Confirm. MYLO Edge opens in its own window from your dock or taskbar.",
    ],
  },
};

export function InstallPanel() {
  const { available, platform, installed, support, promptInstall } = useInstallPrompt();
  const step = STEPS[platform];

  const install = async () => {
    const outcome = await promptInstall();
    track("cta_clicked", { cta: `install_page_${outcome}` });
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-panel p-5 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="num text-[10px] tracking-[0.2em] text-edge uppercase">{step.title}</p>
            <h2 className="mt-3 text-[19px] font-semibold text-ink">
              {installed ? "MYLO Edge is installed" : "Add MYLO Edge to your device"}
            </h2>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] border border-white/10 bg-white/[0.04]">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path d="M4 17L9 11L13 14L20 6" fill="none" stroke="#96e879" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="6" r="2" fill="#e8ecf2" />
            </svg>
          </span>
        </div>

        {installed ? (
          <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-edge/25 bg-edge/[0.06] p-3.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-edge" aria-hidden />
            <p className="text-[13.5px] leading-relaxed text-ink-muted">
              You are using the installed app. It runs full screen without browser
              controls, opens from your Home Screen or app drawer, and keeps the
              last visited pages available offline.
            </p>
          </div>
        ) : (
          <ol className="mt-5 space-y-3">
            {step.steps.map((text, index) => (
              <li key={text} className="flex items-start gap-3">
                <span className="num mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border border-hairline-strong bg-white/[0.03] text-[11px] text-edge">
                  {index + 1}
                </span>
                <span className="text-[13.5px] leading-relaxed text-ink-muted">{text}</span>
              </li>
            ))}
          </ol>
        )}

        {!installed && (
          <div className="mt-6">
            {support === "native" ? (
              <Button onClick={install} size="lg" event="install_panel">
                <ArrowDownToLine className="h-4 w-4" aria-hidden />
                Install MYLO Edge
              </Button>
            ) : (
              <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-ink-faint">
                <Share className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                {platform === "ios"
                  ? "Use the Share button in Safari to install. Browsers on iOS do not show an automatic install prompt."
                  : "Installation is not available in this browser. Follow the steps above using a supported browser."}
              </p>
            )}
          </div>
        )}

        {available && !installed && (
          <p className="num mt-4 text-[10px] tracking-[0.16em] text-ink-faint uppercase">
            One-tap install available
          </p>
        )}
      </div>

      <div className="glass rounded-panel divide-y divide-hairline">
        {[
          ["Full-screen app", "Opens without browser tabs or address bars."],
          ["Instant launch", "The app shell is stored on your device."],
          ["Offline access", "Product pages stay readable without a connection."],
          ["Home Screen shortcuts", "Jump straight to Markets, Signals or Research."],
          ["Home Screen icon", "Your own icon, not a bookmark tab."],
        ].map(([title, description]) => (
          <div key={title} className="flex items-start justify-between gap-4 px-5 py-3.5">
            <span className="text-[13.5px] text-ink">{title}</span>
            <span className="max-w-[58%] text-right text-[12.5px] text-ink-muted">{description}</span>
          </div>
        ))}
      </div>

      <p className="text-[12px] leading-relaxed text-ink-faint">
        Installing is optional. The full website remains available in any browser,
        and signing in is always required before any account data is shown. Live
        market data and account sign-in still need a connection.
      </p>
    </div>
  );
}

export function PlatformBadge({ className }: { className?: string }) {
  const { platform, installed } = useInstallPrompt();
  return (
    <span
      className={cn(
        "num inline-flex items-center gap-1.5 rounded border border-hairline-strong px-2 py-1 text-[10px] tracking-[0.14em] text-ink-muted uppercase",
        className,
      )}
    >
      {installed ? "Installed app" : platform}
    </span>
  );
}
