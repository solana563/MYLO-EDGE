from __future__ import annotations

from datetime import datetime, timedelta
from typing import Literal

from app.models import Candle, MarketAsset, Quote


class MarketDataProvider:
    def get_asset(self, symbol: str) -> MarketAsset:
        raise NotImplementedError

    def get_quote(self, symbol: str) -> Quote:
        raise NotImplementedError

    def get_candles(self, symbol: str, timeframe: str = "1H", limit: int = 120) -> list[Candle]:
        raise NotImplementedError

    def get_market_status(self, symbol: str) -> Literal["LIVE", "DELAYED", "STALE", "OFFLINE", "DEMO"]:
        raise NotImplementedError


class LocalMarketDataProvider(MarketDataProvider):
    """Deterministic provider for local development and end-to-end testing.

    This intentionally avoids claiming to be live market data. It is a local
    provider used to validate the API contract and technical calculations.
    """

    def get_asset(self, symbol: str) -> MarketAsset:
        base = {
            "BTC/USD": (64000.0, 1.4),
            "AAPL": (231.0, -0.3),
            "EUR/USD": (1.0850, -0.2),
            "ETH/USD": (3500.0, 1.1),
        }.get(symbol, (100.0, 0.0))
        price, change = base
        return MarketAsset(
            symbol=symbol,
            name=symbol,
            exchange="LOCAL",
            asset_type="crypto" if "/" in symbol else "equity",
            currency="USD",
            price=price,
            change_pct=change,
            market_status="DEMO",
        )

    def get_quote(self, symbol: str) -> Quote:
        asset = self.get_asset(symbol)
        return Quote(
            symbol=symbol,
            name=asset.name,
            price=asset.price or 0.0,
            previous_close=(asset.price or 0.0) * (1 - (asset.change_pct or 0.0) / 100),
            change_pct=asset.change_pct,
            status=asset.market_status,
            source="local",
            last_updated=datetime.utcnow(),
        )

    def get_candles(self, symbol: str, timeframe: str = "1H", limit: int = 120) -> list[Candle]:
        seed = sum(ord(ch) for ch in symbol)
        now = datetime.utcnow()
        base_price = self.get_asset(symbol).price or 100.0
        candles: list[Candle] = []
        current = base_price
        step = max(0.5, base_price * 0.0025 / max(1, limit / 20))
        for i in range(limit):
            timestamp = now - timedelta(minutes=(limit - i) * 60)
            drift = ((seed % 11) - 5) * 0.001
            open_price = current
            close_price = open_price * (1 + drift + ((i % 7) / 1000) * (1 if i % 2 else -1))
            high = max(open_price, close_price) * (1 + 0.005 + (i % 5) * 0.001)
            low = min(open_price, close_price) * (1 - 0.005 - (i % 4) * 0.001)
            volume = 1000 + ((i * 17 + seed) % 800)
            candles.append(
                Candle(
                    timestamp=timestamp,
                    open=float(open_price),
                    high=float(high),
                    low=float(low),
                    close=float(close_price),
                    volume=float(volume),
                )
            )
            current = close_price
        return candles

    def get_market_status(self, symbol: str) -> Literal["LIVE", "DELAYED", "STALE", "OFFLINE", "DEMO"]:
        return "DEMO"


def get_market_data_provider() -> MarketDataProvider:
    return LocalMarketDataProvider()
