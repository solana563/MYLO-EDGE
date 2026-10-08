from datetime import datetime, timedelta

from app.backtest import run_backtest
from app.models import Candle
from app.paper import OrderStatus, PaperAccount, PaperBroker
from app.research import UnavailableResearchAdapter
from app.risk import size_position


def candles(prices: list[float]) -> list[Candle]:
    return [Candle(timestamp=datetime.utcnow() + timedelta(hours=index), open=price, high=price + 1, low=price - 1, close=price, volume=1) for index, price in enumerate(prices)]


def test_position_sizing_is_deterministic():
    result = size_position(10_000, 1, 100, 95)
    assert result.accepted
    assert result.quantity == 20
    assert result.maximum_risk == 100


def test_paper_broker_tracks_cash_and_position():
    account = PaperAccount(cash=1_000, fee_rate=0.01)
    order = PaperBroker(account).place_market_order("TEST", "BUY", 5, 100)
    assert order.status == OrderStatus.FILLED
    assert account.positions["TEST"] == 5
    assert account.cash == 495


def test_unavailable_research_is_explicit():
    report = UnavailableResearchAdapter().run("BTC/USD", datetime.utcnow().date())
    assert report.status == "UNAVAILABLE"
    assert report.consensus == "Research engine unavailable"


def test_backtest_decides_on_history_and_executes_at_next_open():
    result = run_backtest(candles([100, 110, 120]), 1_000, lambda history: "BUY" if len(history) == 1 else "HOLD")
    assert result.trades == 1
    assert result.final_capital == 1_000 / 110 * 120