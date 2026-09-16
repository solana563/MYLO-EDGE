from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from app.data_quality import DataQuality, validate_candles
from app.models import Candle
from app.repository import CandleRepository
from app.services.market_data import MarketDataProvider


@dataclass(frozen=True)
class IngestionResult:
    provider: str
    symbol: str
    timeframe: str
    requested: int
    received: int
    accepted: int
    duplicates: int
    rejected: int
    latest_timestamp: datetime | None
    status: str
    issues: tuple[str, ...] = ()


class MarketDataIngestionService:
    def __init__(self, provider: MarketDataProvider, repository: CandleRepository):
        self.provider = provider
        self.repository = repository

    def ingest(self, symbol: str, timeframe: str = "1H", limit: int = 120) -> IngestionResult:
        provider_name = self.provider.__class__.__name__.removesuffix("MarketDataProvider").lower()
        try:
            candles = self.provider.get_candles(symbol, timeframe=timeframe, limit=limit)
        except Exception as exc:
            return IngestionResult(
                provider=provider_name,
                symbol=symbol,
                timeframe=timeframe,
                requested=limit,
                received=0,
                accepted=0,
                duplicates=0,
                rejected=0,
                latest_timestamp=None,
                status="OFFLINE",
                issues=(f"provider_unavailable:{type(exc).__name__}",),
            )

        normalized = [self._normalize(candle) for candle in candles]
        quality = validate_candles(normalized)
        if quality.status == "OFFLINE":
            return self._rejected(provider_name, symbol, timeframe, limit, normalized, quality)

        accepted, duplicates = self.repository.insert_many(symbol, timeframe, normalized, provider_name)
        return IngestionResult(
            provider=provider_name,
            symbol=symbol,
            timeframe=timeframe,
            requested=limit,
            received=len(normalized),
            accepted=accepted,
            duplicates=duplicates,
            rejected=0,
            latest_timestamp=normalized[-1].timestamp if normalized else None,
            status="STALE" if quality.status == "STALE" else "LIVE",
            issues=quality.issues,
        )

    @staticmethod
    def _normalize(candle: Candle) -> Candle:
        timestamp = candle.timestamp
        if timestamp.tzinfo is None:
            timestamp = timestamp.replace(tzinfo=timezone.utc)
        else:
            timestamp = timestamp.astimezone(timezone.utc)
        return candle.model_copy(update={"timestamp": timestamp})

    @staticmethod
    def _rejected(
        provider: str,
        symbol: str,
        timeframe: str,
        requested: int,
        candles: list[Candle],
        quality: DataQuality,
    ) -> IngestionResult:
        return IngestionResult(
            provider=provider,
            symbol=symbol,
            timeframe=timeframe,
            requested=requested,
            received=len(candles),
            accepted=0,
            duplicates=0,
            rejected=len(candles),
            latest_timestamp=candles[-1].timestamp if candles else None,
            status=quality.status,
            issues=quality.issues,
        )
