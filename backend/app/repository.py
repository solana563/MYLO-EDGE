from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as postgres_insert
from sqlalchemy.orm import Session

from app.db_models import AssetRecord, CandleRecord
from app.models import Candle


@dataclass(frozen=True)
class PersistedCandle:
    candle: Candle
    source: str
    received_at: datetime


class CandleRepository:
    def __init__(self, session: Session):
        self.session = session

    def _asset(self, symbol: str) -> AssetRecord:
        asset = self.session.scalar(select(AssetRecord).where(AssetRecord.symbol == symbol))
        if asset is None:
            asset = AssetRecord(
                symbol=symbol,
                name=symbol,
                asset_type="crypto" if "/" in symbol else "unknown",
                exchange=None,
                currency="USD",
            )
            self.session.add(asset)
            self.session.flush()
        return asset

    @staticmethod
    def _utc_naive(value: datetime) -> datetime:
        if value.tzinfo is None:
            return value
        return value.astimezone(timezone.utc).replace(tzinfo=None)

    def insert_many(self, symbol: str, timeframe: str, candles: list[Candle], source: str) -> tuple[int, int]:
        if not candles:
            return 0, 0
        asset = self._asset(symbol)
        received_at = datetime.now(timezone.utc).replace(tzinfo=None)
        rows = [
            {
                "asset_id": asset.id,
                "timeframe": timeframe,
                "timestamp": self._utc_naive(candle.timestamp),
                "received_at": received_at,
                "open": candle.open,
                "high": candle.high,
                "low": candle.low,
                "close": candle.close,
                "volume": candle.volume,
                "source": source,
            }
            for candle in candles
        ]
        if self.session.bind is not None and self.session.bind.dialect.name == "postgresql":
            statement = postgres_insert(CandleRecord).values(rows).on_conflict_do_nothing(
                constraint="uq_candle_period"
            )
            accepted = self.session.execute(statement).rowcount or 0
        else:
            accepted = 0
            for row in rows:
                exists = self.session.scalar(
                    select(CandleRecord.id).where(
                        CandleRecord.asset_id == row["asset_id"],
                        CandleRecord.timeframe == row["timeframe"],
                        CandleRecord.timestamp == row["timestamp"],
                    )
                )
                if exists is None:
                    self.session.add(CandleRecord(**row))
                    accepted += 1
        self.session.commit()
        return accepted, len(rows) - accepted

    def get_recent(self, symbol: str, timeframe: str, limit: int = 200) -> list[PersistedCandle]:
        asset = self.session.scalar(select(AssetRecord).where(AssetRecord.symbol == symbol))
        if asset is None:
            return []
        records = list(
            self.session.scalars(
                select(CandleRecord)
                .where(CandleRecord.asset_id == asset.id, CandleRecord.timeframe == timeframe)
                .order_by(CandleRecord.timestamp.desc())
                .limit(limit)
            )
        )
        return [self._to_domain(record) for record in reversed(records)]

    def get_range(self, symbol: str, timeframe: str) -> list[PersistedCandle]:
        return self.get_recent(symbol, timeframe, limit=5000)

    def get_latest(self, symbol: str, timeframe: str) -> PersistedCandle | None:
        recent = self.get_recent(symbol, timeframe, limit=1)
        return recent[-1] if recent else None

    def exists(self, symbol: str, timeframe: str, timestamp: datetime) -> bool:
        asset = self.session.scalar(select(AssetRecord).where(AssetRecord.symbol == symbol))
        if asset is None:
            return False
        return self.session.scalar(
            select(CandleRecord.id).where(
                CandleRecord.asset_id == asset.id,
                CandleRecord.timeframe == timeframe,
                CandleRecord.timestamp == self._utc_naive(timestamp),
            )
        ) is not None

    @staticmethod
    def _to_domain(record: CandleRecord) -> PersistedCandle:
        timestamp = record.timestamp.replace(tzinfo=timezone.utc)
        received_at = record.received_at.replace(tzinfo=timezone.utc)
        return PersistedCandle(
            candle=Candle(
                timestamp=timestamp,
                open=record.open,
                high=record.high,
                low=record.low,
                close=record.close,
                volume=record.volume,
            ),
            source=record.source,
            received_at=received_at,
        )
