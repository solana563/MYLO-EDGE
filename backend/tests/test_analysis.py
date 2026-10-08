from datetime import datetime, timedelta

from app.data_quality import validate_candles
from app.engine import build_analysis
from app.models import Candle, Quote


def make_candles(count: int = 220) -> list[Candle]:
    return [
        Candle(timestamp=datetime.utcnow() - timedelta(minutes=(count - index) * 60), open=100 + index,
               high=101 + index, low=99 + index, close=100.5 + index, volume=1000)
        for index in range(count)
    ]


def test_demo_provider_status_is_preserved():
    quote = Quote(symbol="BTC/USD", name="Bitcoin", price=320, previous_close=319, change_pct=1,
                  status="DEMO", source="local", last_updated=datetime.utcnow())
    analysis = build_analysis("BTC/USD", "1H", quote, make_candles())
    assert analysis.data_health == "DEMO"
    assert analysis.research_status == "PENDING"


def test_invalid_candle_is_not_live():
    candles = make_candles()
    candles[-1] = candles[-1].model_copy(update={"high": 200})
    quality = validate_candles(candles)
    assert quality.status == "OFFLINE"
    assert "invalid_ohlc" in quality.issues