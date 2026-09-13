from __future__ import annotations

from datetime import datetime

from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.engine import build_analysis
from app.models import ApiError, IndicatorSnapshot, MarketAnalysis, MarketHealth, Quote
from app.models import PaperOrderRequest, RiskSizingRequest
from app.paper import PaperAccount, PaperBroker
from app.research import get_research_adapter
from app.risk import size_position
from app.services.market_data import get_market_data_provider
from app.technical import adx, atr, bollinger_bands, ema, macd, momentum_from_rsi, rsi, trend_from_emas, vwap, volatility_from_atr

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
    return {
        "status": "ready",
        "database": "not-configured",
        "redis": "not-configured",
        "market_data_provider": settings.market_data_provider,
        "timestamp": datetime.utcnow().isoformat(),
    }


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


@app.get("/api/v1/candles/{symbol}")
def get_candles(symbol: str, timeframe: str = "1H", limit: int = Query(default=120, ge=10, le=500)):
    provider = get_market_data_provider()
    return provider.get_candles(symbol, timeframe=timeframe, limit=limit)


@app.get("/api/v1/indicators/{symbol}")
def get_indicators(symbol: str, timeframe: str = "1H") -> IndicatorSnapshot:
    provider = get_market_data_provider()
    candles = provider.get_candles(symbol, timeframe=timeframe, limit=200)
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


@app.get("/api/v1/analysis/{symbol}", response_model=MarketAnalysis)
def get_analysis(symbol: str, timeframe: str = "1H") -> MarketAnalysis:
    provider = get_market_data_provider()
    quote = provider.get_quote(symbol)
    candles = provider.get_candles(symbol, timeframe=timeframe, limit=200)
    return build_analysis(symbol, timeframe, quote, candles)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("x-request-id", "unassigned")
    return JSONResponse(status_code=500, content=ApiError(code="internal_error", message="An internal server error occurred.", details=request_id).model_dump())
