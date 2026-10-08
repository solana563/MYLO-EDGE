/*
 * MYLO Edge service worker.
 *
 * Strategy:
 *  - App shell (index.html is the whole app in this single-file build) is
 *    precached so the installed app opens instantly and works offline.
 *  - Navigations are network-first with a bounded timeout so users get updates
 *    promptly, falling back to the cached shell, then to a static offline page.
 *  - Same-origin static assets use stale-while-revalidate.
 *  - Cross-origin API traffic (Supabase auth/database) is NEVER cached. Serving
 *    a cached auth response could present stale session state as valid.
 */

const VERSION = "mylo-edge-v3";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const FONT_CACHE = `${VERSION}-fonts`;

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./offline.html",
  "./manifest.webmanifest",
  "./icons/mylo-edge-icon.svg",
  "./icons/mylo-edge-icon.png",
  "./icons/mylo-edge-icon-maskable.png",
];

// Never hold on to auth or data responses.
const BYPASS_HOST_PATTERNS = [/supabase\.co$/i, /supabase\.in$/i, /supabase\.com$/i];
const BYPASS_PATH_PATTERNS = [/\/auth\//i, /\/rest\//i, /\/realtime\//i, /\/storage\//i, /\/functions\//i];

const NAVIGATION_TIMEOUT_MS = 8000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individual adds so one failed asset cannot abort the whole install.
      await Promise.all(
        SHELL_ASSETS.map(async (asset) => {
          try {
            await cache.add(new Request(asset, { cache: "reload" }));
          } catch {
            /* a missing optional asset should not block installation */
          }
        }),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("mylo-edge-") && !key.startsWith(VERSION))
          .map((key) => caches.delete(key)),
      );
      if (self.registration.navigationPreload) {
        try {
          await self.registration.navigationPreload.enable();
        } catch {
          /* not supported on this browser */
        }
      }
      await self.clients.claim();
    })(),
  );
});

function shouldBypass(url) {
  if (url.origin === self.location.origin) {
    return BYPASS_PATH_PATTERNS.some((pattern) => pattern.test(url.pathname));
  }
  return BYPASS_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
}

function withTimeout(request, milliseconds) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("navigation timeout")), milliseconds);
    fetch(request).then(
      (response) => {
        clearTimeout(timer);
        resolve(response);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function handleNavigation(event) {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const preload = event.preloadResponse ? await event.preloadResponse : null;
    const response = preload || (await withTimeout(event.request, NAVIGATION_TIMEOUT_MS));
    if (response && response.ok) {
      cache.put("./index.html", response.clone());
      return response;
    }
  } catch {
    /* offline or slow: fall through to the cached shell */
  }

  const cached = (await cache.match("./index.html")) || (await cache.match("./")) || (await caches.match(event.request));
  if (cached) return cached;

  const offline = await cache.match("./offline.html");
  if (offline) return offline;

  return new Response("<h1>Offline</h1><p>MYLO Edge is unavailable without a connection.</p>", {
    status: 503,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (shouldBypass(url)) return; // Network only. Auth must never be served from cache.

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(event));
    return;
  }

  if (url.origin === self.location.origin) {
    if (/\.(png|jpe?g|svg|webp|avif|ico|woff2?|css|js|json|webmanifest)$/i.test(url.pathname)) {
      event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    }
    return;
  }

  if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
  }
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
