from __future__ import annotations

from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.data_quality import validate_candles
from app.database import get_db
from app.engine import build_analysis
from app.ingestion import MarketDataIngestionService
from app.models import ApiError, IndicatorSnapshot, MarketAnalysis, MarketHealth, Quote
from app.models import PaperOrderRequest, RiskSizingRequest
from app.paper import PaperAccount, PaperBroker
from app.repository import CandleRepository
from app.research import get_research_adapter
from app.risk import size_position
from app.services.market_data import get_market_data_provider
from app.technical import adx, atr, ema, macd, momentum_from_rsi, rsi, trend_from_emas, vwap, volatility_from_atr
from sqlalchemy import text
from sqlalchemy.orm import Session
import redis

settings = get_settings()
app = FastAPI(title="MYLO Edge API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.cors_origins.split(",") if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}


@app.get("/health/live")
def health_live() -> dict:
    return {"status": "alive"}


@app.get("/health/ready")
def health_ready() -> dict:
    checks = {"database": "unavailable", "redis": "unavailable", "provider": "unavailable", "migrations": "unknown"}
    try:
        from app.database import engine
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            revision = connection.execute(text("SELECT version_num FROM alembic_version")).scalar_one_or_none()
        checks["database"] = "healthy"
        checks["migrations"] = "current" if revision == "0001_market_foundation" else "not_current"
    except Exception:
        pass
    try:
        redis.Redis.from_url(settings.redis_url, socket_connect_timeout=1, socket_timeout=1).ping()
        checks["redis"] = "healthy"
    except Exception:
        pass
    try:
        get_market_data_provider().get_asset("BTC/USD")
        checks["provider"] = "healthy"
    except Exception:
        pass
    ready = all(value in {"healthy", "current"} for value in checks.values())
    return {"status": "ready" if ready else "not_ready", **checks, "timestamp": datetime.utcnow().isoformat()}


@app.get("/api/v1/markets")
def list_markets() -> list[str]:
    return ["BTC/USD", "AAPL", "EUR/USD", "ETH/USD"]


@app.get("/api/v1/assets/{symbol}")
def get_asset(symbol: str):
    provider = get_market_data_provider()
    return provider.get_asset(symbol)


@app.get("/api/v1/quotes/{symbol}", response_model=Quote)
def get_quote(symbol: str) -> Quote:
    provider = get_market_data_provider()
    return provider.get_quote(symbol)


@app.post("/api/v1/ingestion/{symbol:path}")
def ingest_market_data(symbol: str, timeframe: str = "1H", limit: int = Query(default=120, ge=1, le=500), db: Session = Depends(get_db)):
    result = MarketDataIngestionService(get_market_data_provider(), CandleRepository(db)).ingest(symbol, timeframe, limit)
    if result.status == "OFFLINE":
        raise HTTPException(status_code=503, detail=result.__dict__)
    return result


@app.get("/api/v1/candles/{symbol:path}")
def get_candles(symbol: str, timeframe: str = "1H", limit: int = Query(default=120, ge=1, le=500), db: Session = Depends(get_db)):
    records = CandleRepository(db).get_recent(symbol, timeframe, limit)
    if not records:
        raise HTTPException(status_code=404, detail="No persisted candle data available")
    return [record.candle for record in records]


@app.get("/api/v1/indicators/{symbol:path}")
def get_indicators(symbol: str, timeframe: str = "1H", db: Session = Depends(get_db)) -> IndicatorSnapshot:
    records = CandleRepository(db).get_recent(symbol, timeframe, limit=200)
    candles = [record.candle for record in records]
    closes = [c.close for c in candles]
    if not closes:
        raise HTTPException(status_code=404, detail="No candle data available")

    ema_9 = ema(closes, 9)[-1]
    ema_21 = ema(closes, 21)[-1]
    ema_50 = ema(closes, 50)[-1]
    ema_200 = ema(closes, 200)[-1]
    indicator_rsi = rsi(closes, 14)
    macd_line, _ = macd(closes)
    indicator_atr = atr([{"high": c.high, "low": c.low, "close": c.close, "volume": c.volume} for c in candles], 14)
    indicator_vwap = vwap([
        {"typical_price": (c.high + c.low + c.close) / 3.0, "volume": c.volume}
        for c in candles
    ])
    trend = trend_from_emas(ema_9, ema_200)
    momentum = momentum_from_rsi(indicator_rsi)
    volatility = volatility_from_atr(indicator_atr)

    quality = validate_candles(candles, settings.market_data_stale_after_seconds)
    source = records[-1].source
    data_health = "DEMO" if source == "local" else quality.status
    return IndicatorSnapshot(
        symbol=symbol,
        timeframe=timeframe,
        ema_9=ema_9,
        ema_21=ema_21,
        ema_50=ema_50,
        ema_200=ema_200,
        rsi=indicator_rsi,
        macd=macd_line,
        atr=indicator_atr,
        adx=adx([{"close": c.close, "high": c.high, "low": c.low, "volume": c.volume} for c in candles]),
        vwap=indicator_vwap,
        trend=trend,
        momentum=momentum,
        volatility=volatility,
        data_health=data_health,
        updated_at=datetime.utcnow(),
    )


@app.get("/api/v1/health")
def api_health() -> MarketHealth:
    return MarketHealth(
        status="ok",
        database="unconfigured",
        redis="unconfigured",
        market_data_provider=settings.market_data_provider,
        timestamp=datetime.utcnow(),
    )


@app.get("/api/v1/research/{symbol:path}")
def get_research(symbol: str, analysis_date: str | None = None):
    from datetime import date
    requested_date = date.fromisoformat(analysis_date) if analysis_date else date.today()
    return get_research_adapter().run(symbol, requested_date)


@app.post("/api/v1/risk/position-size")
def calculate_position_size(request: RiskSizingRequest):
    return size_position(request.account_balance, request.risk_percent, request.entry, request.stop, request.max_exposure_percent)


@app.post("/api/v1/paper/orders")
def place_paper_order(request: PaperOrderRequest):
    account = PaperAccount(cash=request.cash, fee_rate=request.fee_rate)
    return PaperBroker(account).place_market_order(request.symbol, request.side, request.quantity, request.price)


@app.get("/api/v1/analysis/{symbol:path}", response_model=MarketAnalysis)
def get_analysis(symbol: str, timeframe: str = "1H", db: Session = Depends(get_db)) -> MarketAnalysis:
    records = CandleRepository(db).get_recent(symbol, timeframe, limit=200)
    if not records:
        raise HTTPException(status_code=404, detail="No persisted candle data available")
    candles = [record.candle for record in records]
    latest = records[-1]
    quality = validate_candles(candles, settings.market_data_stale_after_seconds)
    status = "DEMO" if latest.source == "local" else quality.status
    quote = Quote(
        symbol=symbol,
        name=symbol,
        price=latest.candle.close,
        previous_close=candles[-2].close if len(candles) > 1 else None,
        change_pct=((latest.candle.close - candles[-2].close) / candles[-2].close * 100) if len(candles) > 1 else None,
        status=status,
        source=latest.source,
        last_updated=latest.candle.timestamp,
    )
    return build_analysis(symbol, timeframe, quote, candles, latest.source, latest.candle.timestamp, latest.received_at)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("x-request-id", "unassigned")
    return JSONResponse(status_code=500, content=ApiError(code="internal_error", message="An internal server error occurred.", details=request_id).model_dump())
