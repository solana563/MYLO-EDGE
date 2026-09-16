from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from app.database import Base
from app.db_models import AssetRecord, CandleRecord
from app.ingestion import MarketDataIngestionService
from app.main import app
from app.models import Candle, MarketAsset, Quote
from app.repository import CandleRepository
from app.services.market_data import MarketDataProvider


class FixedProvider(MarketDataProvider):
    def __init__(self, candles: list[Candle]):
        self.candles = candles
        self.calls = 0

    def get_asset(self, symbol: str) -> MarketAsset:
        return MarketAsset(symbol=symbol, name=symbol, price=100, market_status="LIVE")

    def get_quote(self, symbol: str) -> Quote:
        return Quote(symbol=symbol, name=symbol, price=100, status="LIVE", source="fixed", last_updated=datetime.now(timezone.utc))

    def get_candles(self, symbol: str, timeframe: str = "1H", limit: int = 120) -> list[Candle]:
        self.calls += 1
        return self.candles[:limit]

    def get_market_status(self, symbol: str) -> str:
        return "LIVE"


class FailingProvider(FixedProvider):
    def get_candles(self, symbol: str, timeframe: str = "1H", limit: int = 120) -> list[Candle]:
        raise TimeoutError("provider unavailable")


def make_candles(count: int = 220) -> list[Candle]:
    start = datetime.now(timezone.utc) - timedelta(hours=count)
    return [
        Candle(timestamp=start + timedelta(hours=index), open=100 + index, high=101 + index, low=99 + index, close=100.5 + index, volume=10)
        for index in range(count)
    ]


def make_session() -> Session:
    engine = create_engine("sqlite://")
    Base.metadata.create_all(engine)
    return Session(engine)


def test_repository_inserts_reads_and_deduplicates():
    session = make_session()
    repository = CandleRepository(session)
    candles = make_candles(3)

    assert repository.insert_many("BTC/USD", "1H", candles, "fixed") == (3, 0)
    assert repository.insert_many("BTC/USD", "1H", candles, "fixed") == (0, 3)
    records = repository.get_range("BTC/USD", "1H")

    assert [record.candle.timestamp for record in records] == [c.timestamp for c in candles]
    assert records[-1].source == "fixed"
    assert records[-1].received_at.tzinfo == timezone.utc
    assert session.query(CandleRecord).count() == 3


def test_ingestion_rejects_provider_failure_without_persistence():
    session = make_session()
    result = MarketDataIngestionService(FailingProvider([]), CandleRepository(session)).ingest("BTC/USD", "1H", 3)

    assert result.status == "OFFLINE"
    assert result.accepted == 0
    assert session.query(CandleRecord).count() == 0


def test_api_reads_persisted_candles_without_provider_call(monkeypatch):
    session = make_session()
    repository = CandleRepository(session)
    repository.insert_many("BTC/USD", "1H", make_candles(), "fixed")

    import app.database
    from app import main as main_module
    monkeypatch.setattr(app.database, "SessionLocal", lambda: session)
    monkeypatch.setattr(main_module, "get_market_data_provider", lambda: (_ for _ in ()).throw(AssertionError("provider called")))
    client = TestClient(app)

    candle_response = client.get("/api/v1/candles/BTC/USD?timeframe=1H&limit=10")
    indicator_response = client.get("/api/v1/indicators/BTC/USD?timeframe=1H")
    analysis_response = client.get("/api/v1/analysis/BTC/USD?timeframe=1H")

    assert candle_response.status_code == 200
    assert len(candle_response.json()) == 10
    assert indicator_response.status_code == 200
    assert analysis_response.status_code == 200
    assert analysis_response.json()["provider"] == "fixed"
    assert analysis_response.json()["score_version"] == "1.0"
