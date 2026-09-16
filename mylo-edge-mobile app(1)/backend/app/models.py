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
    data_health: Literal["LIVE", "DELAYED", "STALE", "OFFLINE", "DEMO", "UNAVAILABLE"] = "UNAVAILABLE"
    updated_at: datetime


class ScoreComponents(BaseModel):
    technical: int
    momentum: int
    news: int | None = None
    sentiment: int | None = None
    fundamentals: int | None = None
    macro: int | None = None
    liquidity: int | None = None
    risk: int | None = None


class MarketAnalysis(BaseModel):
    symbol: str
    timeframe: str
    quote: Quote
    indicators: IndicatorSnapshot
    regime: str
    regime_reason: str
    edge_score: int | None = None
    score_label: str | None = None
    score_components: ScoreComponents
    signal: Literal["STRONG BUY", "BUY", "HOLD", "SELL", "STRONG SELL", "UNAVAILABLE"]
    risk: Literal["LOW", "MEDIUM", "HIGH", "UNAVAILABLE"]
    entry_zone: dict[str, float] | None = None
    invalidation: float | None = None
    target_1: float | None = None
    target_2: float | None = None
    risk_reward: float | None = None
    research_status: Literal["PENDING", "AVAILABLE", "UNAVAILABLE"] = "PENDING"
    data_health: Literal["LIVE", "DELAYED", "STALE", "OFFLINE", "DEMO", "UNAVAILABLE"]
    provider: str | None = None
    latest_candle: datetime | None = None
    received_at: datetime | None = None
    score_version: str = "1.0"
    generated_at: datetime


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


class RiskSizingRequest(BaseModel):
    account_balance: float = Field(gt=0)
    risk_percent: float = Field(gt=0, le=100)
    entry: float = Field(gt=0)
    stop: float = Field(gt=0)
    max_exposure_percent: float | None = Field(default=None, gt=0, le=100)


class PaperOrderRequest(BaseModel):
    cash: float = Field(ge=0)
    symbol: str = Field(min_length=1, max_length=32)
    side: Literal["BUY", "SELL"]
    quantity: float = Field(gt=0)
    price: float = Field(gt=0)
    fee_rate: float = Field(default=0, ge=0, le=1)
