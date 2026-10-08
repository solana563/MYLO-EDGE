# MYLO Edge Production Conversion Audit

## Executive summary

This repository is already a strong frontend prototype for a market-intelligence and paper-trading product. It contains a polished dark-theme mobile app shell, marketing pages, routing, auth flows, onboarding screens, legal pages, and a reusable design system. However, it is not yet a production system because the current app is driven by synthetic demo data, the authenticated experience is not backed by a real application database or market-data service, and the product workflow does not yet persist user-owned state in a real backend.

The current codebase is most accurately described as:

- production-capable frontend shell
- partially implemented auth layer
- demo-only data product
- missing real backend services
- missing real persistence and job orchestration

This document is a repository-specific audit based on the source in the current workspace, not a generic product plan.

## Already production-capable

The following areas are in good shape for a real product foundation:

### Frontend shell and product structure

- Vite + React + TypeScript app structure is already established
- Route map is coherent and already mapped for marketing, auth, legal, and app routes
- Mobile app shell is built around a clear tab model with navigation and sheets
- Dark graphite design system is consistent and reusable
- Marketing pages and UX patterns have a mature visual language
- PWA install and offline shell support is implemented in the frontend
- Service worker logic is present for install/update flow and offline fallback

### Auth foundation

- Supabase client configuration exists in `src/lib/supabase.ts`
- PKCE-based auth callback flow is implemented
- Sign-in, sign-up, password reset, email verification, and sign-out flows are present
- Auth context and session handling are in place
- The app already understands configured-vs-misconfigured auth states and user-friendly error messaging

### Product design and interaction model

- Mobile app tabs follow a production-worthy information architecture: overview, markets, terminal, signals, portfolio
- Trade sheet, profile sheet, notification sheet, and asset detail patterns are implemented
- Charting and financial dashboard layouts already match a real fintech user experience
- The app preserves consistent branding, glass styling, and typography standards

### Public-facing docs and deployment intent

- README explains installable PWA flow and route semantics
- `docs/SUPABASE_AUTH.md` provides auth configuration expectations
- There is explicit separation between public marketing pages and private application flows

## Demo-only

These areas are intentionally synthetic and should not be treated as production application data:

### Synthetic market data

- `src/data/demo.ts` contains the active market-data, price, research, and signal examples
- `makeCandles()` creates deterministic synthetic candles
- `ASSETS` contains market examples that are clearly presentation data rather than live market records
- `CandleChart.tsx` is built to display generated instrument data and simulated markers

### Synthetic app state

- `src/components/mobile/MobileAppContext.tsx` stores paper positions and account balances in React state
- Trade actions are local and non-persistent
- Portfolio and order state are not backed by Postgres or any business API

### Product demo content

- Marketing pages intentionally use demo labels like `DEMO`, `SIMULATED`, `EXAMPLE`, and `PRODUCT DEMO`
- These surfaces are acceptable for public marketing and product education, but they are not real application state

## Partially implemented

The following areas are started but not complete enough for a real production deployment:

### Authentication

- Supabase auth is present and structured correctly
- However, it is not yet connected to a real application authorization layer or user-owned backend records
- The frontend can identify the user, but the backend does not yet enforce authorization for app business data

### PWA and offline behavior

- Service worker is configured for install/update/offline shell support
- This is appropriate for a static frontend shell
- It is not sufficient for protecting sensitive private data or replaying private account state

### Market-facing UI

- The market app shell is designed to display charts, signals, watchlists, and a paper portfolio
- The UI is ready to host real services
- It is not yet data-backed by a real market API or persisted storage model

## Missing backend functionality

The current repository does not include a complete backend for the following critical functions:

- market data ingestion and quote normalization
- technical indicator computation
- multi-timeframe regime detection
- signal generation from real inputs
- research job orchestration
- persistent paper trading state
- portfolio persistence
- backtesting engine
- alerts processing
- database-backed watchlists
- audit logs
- health checks and production observability

The `frontend-only` structure means there is currently no source of truth for any authenticated user-owned business data.

## Security concerns

These are the main security and trust concerns in the current state:

### Authentication boundary

- Supabase Auth is used to identify users, but there is no backend authorization layer to protect business data
- The frontend must never be trusted to send a raw `user_id` for authorization decisions

### Data trust model

- The current app can represent demo data as if it were live product data unless the app is carefully gated
- The UI must never present simulated values as live market outputs in authenticated product screens

### API security

- No authentication middleware, role enforcement, rate limiting, or private API protection exists in the project
- No CORS, CSRF, or header policy is defined for a backend API layer

### Secret handling

- Frontend env variables only allow browser-safe public config
- Secret-bearing external service credentials must remain in backend-only env files, not in `VITE_*` variables

## External services required

A production deployment will need external services beyond the current frontend:

- PostgreSQL for application data persistence
- Redis for background job orchestration and stateful queue workers
- A real market-data provider (exchange / broker / data vendor)
- A news provider
- A fundamentals provider
- A macro data provider
- A sentiment provider
- Optional TradingAgents integration for research workflows
- Supabase Auth remains the identity provider, but not the whole app backend

## Database requirements

PostgreSQL should be the source of truth for the application domain. The required production domain model includes user-owned and system-owned records such as:

- profiles
- watchlists and watchlist items
- assets and markets
- candles and market snapshots
- technical indicators and market regimes
- signals and signal factors
- research runs and research reports
- news items and sentiment records
- macro events and catalysts
- alerts
- paper account records
- paper positions, orders, fills, and trades
- portfolio snapshots
- backtests and backtest runs
- audit logs

The current repo does not yet contain migration files or a schema layer for these tables.

## Deployment requirements

To deploy the product responsibly, the team needs:

- production-ready backend service (FastAPI preferred)
- PostgreSQL database and migration tooling
- Redis + worker service
- environment files separated by frontend/backend
- health checks for app, database, and Redis
- CI pipeline for frontend and backend validation
- backup and restore documentation
- structured observability and request logging
- no caching of private authenticated data in the service worker

## Recommended migration order

The safe migration sequence is:

1. Add a real backend foundation and health checks
2. Implement a real market-data API and technical indicator service
3. Connect the terminal chart to a real backend dataset
4. Add persistent storage to watchlists, paper accounts, and portfolio state
5. Introduce signal generation and Edge Score computation from real inputs
6. Add research job orchestration with Redis workers and TradingAgents integration
7. Add alerting, backtesting, and persistence
8. Add security, rate limiting, and API authorization enforcement
9. Add end-to-end tests and production CI
10. Deploy with production env configuration and backup workflow

## Key conclusion

The repository is not a fake app masquerading as production; it is a strong and well-designed prototype with a clear production path. The main work now is not redesigning the UI, but connecting the existing product shell to a real backend, real databases, and real external data providers while preserving the current visual design.

The current codebase is a good candidate for a controlled conversion rather than a rebuild.
