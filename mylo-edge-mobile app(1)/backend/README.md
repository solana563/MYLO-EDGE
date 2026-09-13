# MYLO Edge Backend

This backend is a production foundation for the existing MYLO Edge frontend. It is intentionally separated from the Vite client so the public marketing demo can remain static while authenticated product screens can connect to real service-backed data.

## Local development

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Current status

This initial backend provides:

- FastAPI app bootstrap
- health checks
- market schema definitions
- technical indicator calculations
- local market-data provider interface and deterministic sample market data
- first vertical-slice API routes for markets, quotes, candles, and indicators

This is a foundation, not a full production trading platform. Production data providers, Postgres migrations, job workers, and authorization enforcement are still required for full deployment.
