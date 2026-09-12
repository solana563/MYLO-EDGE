import { useCallback, useEffect, useState } from "react";

/**
 * Native app capabilities for the website: install prompt, service worker
 * lifecycle and connectivity. Everything degrades to a no-op in browsers that
 * do not support the capability, so the marketing site is unaffected.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export type AppPlatform = "ios" | "android" | "desktop";
export type InstallSupport = "native" | "manual" | "unavailable";

function detectPlatform(): AppPlatform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  const iOS = /iphone|ipod|ipad/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  if (iOS) return "ios";
  return "desktop";
}

/** True when the app is already running as an installed app. */
export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    iOSStandalone ||
    document.referrer.startsWith("android-app://")
  );
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const promptListeners = new Set<(available: boolean) => void>();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    // Suppress the browser's own mini-infobar so the install experience stays
    // inside MYLO Edge's own interface.
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    promptListeners.forEach((listener) => listener(true));
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    promptListeners.forEach((listener) => listener(false));
  });
}

export function useInstallPrompt() {
  const [available, setAvailable] = useState(() => Boolean(deferredPrompt));
  const [platform] = useState<AppPlatform>(detectPlatform);
  const [installed, setInstalled] = useState(isStandalone);

  useEffect(() => {
    const listener = (next: boolean) => setAvailable(next);
    promptListeners.add(listener);
    return () => {
      promptListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    const queries = ["(display-mode: standalone)", "(display-mode: minimal-ui)"];
    const handlers = queries.map((query) => {
      const mql = window.matchMedia(query);
      const onChange = () => setInstalled(isStandalone());
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    });
    return () => handlers.forEach((off) => off());
  }, []);

  const support: InstallSupport =
    installed ? "unavailable" : available ? "native" : platform === "ios" ? "manual" : "unavailable";

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable" as const;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      setAvailable(false);
      return outcome;
    } catch {
      return "dismissed" as const;
    }
  }, []);

  return { available, platform, installed, support, promptInstall };
}

export function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator === "undefined" ? true : navigator.onLine));

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return online;
}

/**
 * Registers the service worker once for the whole application. Kept separate
 * from the update UI so any route can host registration.
 */
export function useServiceWorkerRegistration() {
  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!("serviceWorker" in navigator)) return;
    if (!window.isSecureContext) return; // Service workers need HTTPS or localhost.
    if (sessionStorage.getItem(SW_REGISTERED_KEY)) return;

    const swUrl = new URL("sw.js", document.baseURI);
    let cancelled = false;

    navigator.serviceWorker
      .register(swUrl, { scope: "./" })
      .then(() => {
        if (!cancelled) sessionStorage.setItem(SW_REGISTERED_KEY, "1");
      })
      .catch(() => {
        /* An unavailable service worker must never break the site. */
      });

    return () => {
      cancelled = true;
    };
  }, []);
}

const SW_REGISTERED_KEY = "mylo:sw-registered";

type ServiceWorkerStatus = {
  /** A new version has been downloaded and is waiting to take control. */
  updateReady: boolean;
  /** The current page is controlled by a service worker. */
  controlled: boolean;
  applyUpdate: () => void;
};

export function useServiceWorker(): ServiceWorkerStatus {
  const [updateReady, setUpdateReady] = useState(false);
  const [controlled, setControlled] = useState(
    () => typeof navigator !== "undefined" && Boolean(navigator.serviceWorker?.controller),
  );

  const applyUpdate = useCallback(() => {
    // Tell the waiting worker to take over; the controllerchange listener reloads.
    const waiting = navigator.serviceWorker?.controller;
    waiting?.postMessage("SKIP_WAITING");
    // If ownership does not hand over (older worker), reload anyway.
    window.setTimeout(() => window.location.reload(), 1200);
  }, []);

  useEffect(() => {
    if (!import.meta.env.PROD) return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    let registration: ServiceWorkerRegistration | null = null;

    // Registration happens once in useServiceWorkerRegistration; this hook only
    // observes the lifecycle so a waiting version can be surfaced to the user.
    navigator.serviceWorker.getRegistration().then((existing) => {
      if (cancelled) return;
      registration = existing ?? null;
      setControlled(Boolean(navigator.serviceWorker.controller));
      if (registration?.waiting && navigator.serviceWorker.controller) setUpdateReady(true);

      registration?.addEventListener("updatefound", () => {
        const installing = registration?.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            setUpdateReady(true);
          }
        });
      });
    });

    const onControllerChange = () => {
      if (navigator.serviceWorker.controller) {
        setControlled(true);
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      cancelled = true;
      registration = null;
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  return { updateReady, controlled, applyUpdate };
}
