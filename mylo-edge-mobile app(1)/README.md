# MYLO EDGE — Market Intelligence Terminal

**Find your market edge.**

The MYLO Edge web application is a market-intelligence and paper-trading terminal. Public marketing/demo pages have been removed; the root route opens the terminal directly.

---

## Stack

The existing repository is a **React 19 + Vite 7 + TypeScript + Tailwind CSS v4** project that builds to a single inlined `dist/index.html` (`vite-plugin-singlefile`).

- `lucide-react` — icons
- `framer-motion` — scroll reveals, flow animation
- Charts are hand-built SVG (no charting library) to keep the bundle small
- `@supabase/supabase-js` provides email/password authentication and session management

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # production build -> dist/index.html
npm run preview  # preview the build
```

## Structure

```
src/
  lib/
    router.tsx        hash router mirroring the production route map
    seo.ts            per-route title/description/OG/Twitter/canonical + JSON-LD
    analytics.ts      privacy-conscious analytics abstraction (no provider wired)
    supabase.ts       configured Supabase client and safe auth error messages
    auth.tsx          persisted session context and sign-out
    auth-links.ts     callback URL construction and credential-safe URL parsing
    auth-callback.ts  single-use PKCE/email callback exchange
  data/
    demo.ts           UI fallback/demo datasets, clearly labelled in the UI
    pricing.ts        configurable pricing tiers (no invented prices)
  components/
    ui/               Button, Panel, Section, SectionHeading, Badge, DemoTag,
                      Disclosure, Accordion, Meter, CountUp, Reveal
    navigation/       Navbar (+ Logo), Footer
    auth/             shared accessible account forms and feedback
    charts/           CandleChart, EquityCurve, Sparkline
    product-demos/    TerminalPreview, InteractiveDemo
  pages/
    Home.tsx, Pages.tsx (product pages), Legal.tsx, Auth.tsx, Account.tsx, Errors.tsx
public/
  robots.txt, sitemap.xml
```

## Installable native app (PWA)

The website is a full installable application on iOS, Android, Windows, macOS and ChromeOS, distributed directly from the site without an app store.

| File | Purpose |
| --- | --- |
| `public/manifest.webmanifest` | Identity, icons, standalone display, theme colours and app shortcuts (Markets, Signals, Research, Sign in). |
| `public/sw.js` | Offline app shell, versioned caches and a controlled update flow. |
| `public/offline.html` | Static fallback when the shell is not yet cached. |
| `public/icons/` | `any` and `maskable` icons, plus the Apple touch icon. |
| `src/lib/pwa.ts` | Install prompt capture, standalone detection, service worker lifecycle and connectivity hooks. |
| `src/components/app/NativeApp.tsx` | Install suggestion, update toast, offline notice and the `/install` instructions page. |

Service worker behaviour:

- **App shell precached** — the whole app is one inlined `index.html`, so an installed launch is instant and works offline.
- **Navigations are network-first** with an 8s timeout so users receive updates promptly, falling back to the cached shell and then `offline.html`.
- **Static assets use stale-while-revalidate**; Google Fonts are cached.
- **Cross-origin API traffic is never cached.** Supabase auth, REST, realtime and storage requests bypass the cache entirely, so a stale response can never be presented as a valid session. Add any future API host to `BYPASS_HOST_PATTERNS` in `sw.js`.
- **Updates are user-controlled.** A new version downloads in the background and shows a "Refresh" toast instead of reloading mid-session. Bump `VERSION` in `sw.js` to force a cache purge.
- Registration is **production-only** and gated on `isSecureContext`, so dev-server HMR is unaffected.

Native platform behaviour is handled in markup and CSS: `viewport-fit=cover` with `env(safe-area-inset-*)` padding for notches and the home indicator, `black-translucent` status bar, `overscroll-behavior` to suppress pull-to-refresh, transparent tap highlights, 16px inputs so iOS never zooms on focus, and `user-select: none` on app chrome only (never on content or forms).

### App store packaging

This repository produces an installable PWA. Compiling iOS or Android binaries requires a native shell, which needs Xcode or Android Studio and cannot be run here. The supported path when needed is Capacitor, reusing this build output unchanged:

```bash
npm i @capacitor/core @capacitor/cli
npx cap init "MYLO Edge" com.myloedge.app --web-dir=dist
npx cap add ios && npx cap add android
npx cap sync
```

Because `web-dir` points at the existing `dist/`, no application code changes are required. The Supabase redirect URLs in `docs/SUPABASE_AUTH.md` must then be extended with the native origin, and push notifications, in-app purchases and other device APIs each need their own native implementation.

## Routes

Terminal: `/`, `/app`, `/markets`, `/terminal`, `/signals`, `/portfolio`, `/install`

Supabase Auth: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`, `/auth/callback`, `/onboarding`

The static deployment uses hash routes, for example `/#/login`. Direct paths also work when the host serves the SPA entry point for them. Supabase email callbacks return to the root with a query marker, so they do not require server rewrites.

Legal (versioned): `/terms`, `/privacy`, `/risk-disclosure`, `/cookies`

Fallbacks: 404 (any unknown route), `/500`, `/offline`

## Design system

Tokens live in `src/index.css` under `@theme`:

- Surfaces: `void`, `graphite`, `charcoal`, `slate-panel`, `elevated`
- Text: `ink`, `ink-muted`, `ink-faint`
- Borders: `hairline`, `hairline-strong`
- States: `bull`, `bear`, `caution`, `info`
- Accent: `edge`, `edge-soft`
- Utilities: `.glass`, `.glass-soft`, `.grid-bg`, `.num` (tabular monospace numerics), `.text-gradient`

## Supabase authentication

Sign-up and sign-in are connected to the configured Supabase project using its browser-safe publishable key in `.env`. The SDK handles persisted sessions and automatic token refresh. Email confirmation, verification resends, password recovery, password updates, and local sign-out are implemented. Auth callbacks use PKCE, and onboarding preferences are saved to the signed-in user's metadata.

Before testing email flows or deploying, configure the Supabase Site URL, allowed redirect URLs, and email delivery. See [the Supabase setup guide](docs/SUPABASE_AUTH.md) for exact settings and a verification checklist. No database migrations are needed for these auth flows.

The authenticated trading terminal remains a separate application. Set `VITE_MYLO_APP_URL` to its deployed HTTPS URL to show the terminal link. Cross-origin session sharing is not implemented: tokens are never forwarded in that link, and the terminal must establish its own session. Without a configured terminal, users land on their real account/preferences page and can explore the public product demos.

## Analytics

`configureAnalytics(adapter)` in `src/lib/analytics.ts` accepts any provider. Events emitted: `page_view`, `cta_clicked`, `signup_started`, `signup_completed`, `product_demo_used`, `pricing_viewed`, `faq_opened`, `nav_opened`. No personal data is collected.

## Demo data policy

Every number, chart, report and event on the site is synthetic and lives in `src/data/demo.ts`. Each surface is tagged `DEMO`, `SIMULATED`, `EXAMPLE` or `PRODUCT DEMO`. Performance statistics (net return, win rate, profit factor, drawdown, Sharpe) are deliberately left blank — no trading performance is fabricated.

## Responsible marketing

The copy never claims guaranteed returns, prediction, perfect signals or risk-free trading, and never brands the product as an "AI trading bot". Terminology used: market intelligence, research consensus, signal engine, market outlook, risk assessment, Edge Score, market regime, opportunity, catalyst, research report, signal forensics, paper trading.

## Accessibility

Semantic landmarks, skip link, keyboard-operable tabs/accordions/filters, visible focus rings, ARIA labelling on data visuals, table captions, and full `prefers-reduced-motion` support.
