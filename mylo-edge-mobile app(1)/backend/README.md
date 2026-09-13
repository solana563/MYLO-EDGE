# MYLO Edge Backend

This backend is the service layer for the MYLO Edge terminal. It is separated from the Vite client so terminal screens can connect to service-backed market data and analysis.

## Local development

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Optional TradingAgents setup

The integration is disabled by default. To enable the verified Tauric Research
`v0.2.0` adapter, install its optional dependency set and configure the selected
LLM provider without committing credentials:

```bash
pip install -r requirements-tradingagents.txt
cp .env.example .env
# Set TRADINGAGENTS_PROVIDER=tradingagents
# Set TRADINGAGENTS_LLM_PROVIDER=openai (or google, anthropic, xai, openrouter, ollama)
# Set the matching provider key, for example OPENAI_API_KEY, in your local .env
# If the package build does not expose its source, clone the official repo and set
# TRADINGAGENTS_SOURCE_PATH=/absolute/path/to/TradingAgents
```

TradingAgents reads provider credentials from its standard environment variable.
MYLO only returns its structured decision summary; private agent transcripts are
not exposed by the API. If the package or selected provider credential is absent,
the research endpoint returns `UNAVAILABLE`.

## Current status

This initial backend provides:

- FastAPI app bootstrap
- health checks
- market schema definitions
- technical indicator calculations
- local market-data provider interface and deterministic sample market data
- first vertical-slice API routes for markets, quotes, candles, indicators, and analysis
- SQLAlchemy market-data metadata and an Alembic migration for PostgreSQL persistence
- TradingAgents v0.2.x adapter boundary with explicit unavailable behavior when unconfigured
- deterministic position sizing, paper-order simulation, and no-lookahead backtest primitives

This is a foundation, not a full production trading platform. Run `alembic upgrade head` after PostgreSQL is available. Paper orders and backtests are currently service primitives and are not yet persisted through authenticated API workflows. Production research providers, job workers, and authorization enforcement are still required for full deployment.
