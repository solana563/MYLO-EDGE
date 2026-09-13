from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from app.models import Candle


@dataclass(frozen=True)
class DataQuality:
    status: str
    issues: tuple[str, ...]


def validate_candles(candles: list[Candle], stale_after_seconds: int = 900) -> DataQuality:
    issues: list[str] = []
    timestamps = [c.timestamp for c in candles]
    if len(timestamps) != len(set(timestamps)):
        issues.append("duplicate_candles")
    if timestamps != sorted(timestamps):
        issues.append("timestamp_inconsistency")
    for candle in candles:
        if min(candle.open, candle.high, candle.low, candle.close) <= 0 or candle.volume < 0:
            issues.append("invalid_price_or_volume")
        if candle.high < max(candle.open, candle.close) or candle.low > min(candle.open, candle.close) or candle.low > candle.high:
            issues.append("invalid_ohlc")
    if timestamps:
        latest = timestamps[-1]
        if latest.tzinfo is None:
            latest = latest.replace(tzinfo=timezone.utc)
        if (datetime.now(timezone.utc) - latest.astimezone(timezone.utc)).total_seconds() > stale_after_seconds:
            issues.append("stale_data")
    if issues:
        status = "STALE" if set(issues) == {"stale_data"} else "OFFLINE"
        return DataQuality(status, tuple(sorted(set(issues))))
    return DataQuality("LIVE", ())