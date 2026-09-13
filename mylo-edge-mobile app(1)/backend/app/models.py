from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class Candle(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float


class Quote(BaseModel):
    symbol: str
    name: str
    price: float
    previous_close: float | None = None
    change_pct: float | None = None
    status: Literal["LIVE", "DELAYED", "STALE", "OFFLINE", "DEMO"] = "DEMO"
    source: str = "local"
    last_updated: datetime


class IndicatorSnapshot(BaseModel):
    symbol: str
    timeframe: str
    ema_9: float | None = None
    ema_21: float | None = None
    ema_50: float | None = None
    ema_200: float | None = None
    rsi: float | None = None
    macd: float | None = None
    atr: float | None = None
    adx: float | None = None
    vwap: float | None = None
    trend: str = "NEUTRAL"
    momentum: str = "NEUTRAL"
    volatility: str = "MEDIUM"
    updated_at: datetime


class MarketAsset(BaseModel):
    symbol: str
    name: str
    exchange: str = "LOCAL"
    asset_type: str = "crypto"
    currency: str = "USD"
    price: float | None = None
    change_pct: float | None = None
    market_status: Literal["LIVE", "DELAYED", "STALE", "OFFLINE", "DEMO"] = "DEMO"


class MarketHealth(BaseModel):
    status: Literal["ok", "degraded", "down"]
    database: str
    redis: str
    market_data_provider: str
    timestamp: datetime


class ApiError(BaseModel):
    code: str
    message: str
    details: str | None = None
