from __future__ import annotations

from datetime import datetime

from app.data_quality import validate_candles
from app.models import Candle, IndicatorSnapshot, MarketAnalysis, Quote, ScoreComponents
from app.technical import adx, atr, ema, macd, momentum_from_rsi, rsi, trend_from_emas, volatility_from_atr, vwap


def _score(value: float) -> int:
    return max(0, min(100, round(value)))


def _regime(indicators: IndicatorSnapshot, candles: list[Candle]) -> tuple[str, str]:
    if not candles or indicators.atr is None:
        return "UNKNOWN", "Insufficient candle data"
    if indicators.volatility == "HIGH":
        return "HIGH_VOLATILITY", "ATR indicates elevated volatility"
    if indicators.trend == "UPTREND":
        return ("STRONG_TREND_UP" if indicators.adx and indicators.adx >= 25 else "TREND_UP"), "EMA structure is aligned upward"
    if indicators.trend == "DOWNTREND":
        return ("STRONG_TREND_DOWN" if indicators.adx and indicators.adx >= 25 else "TREND_DOWN"), "EMA structure is aligned downward"
    return "RANGE", "EMA structure is not directional"


def build_analysis(symbol: str, timeframe: str, quote: Quote, candles: list[Candle]) -> MarketAnalysis:
    closes = [c.close for c in candles]
    candle_dicts = [{"high": c.high, "low": c.low, "close": c.close, "volume": c.volume} for c in candles]
    ema_9, ema_21, ema_50, ema_200 = (ema(closes, period)[-1] if closes else None for period in (9, 21, 50, 200))
    indicator_rsi = rsi(closes, 14)
    macd_line, _ = macd(closes)
    indicator_atr = atr(candle_dicts, 14)
    indicators = IndicatorSnapshot(
        symbol=symbol, timeframe=timeframe, ema_9=ema_9, ema_21=ema_21, ema_50=ema_50,
        ema_200=ema_200, rsi=indicator_rsi, macd=macd_line, atr=indicator_atr,
        adx=adx(candle_dicts), vwap=vwap([{"typical_price": (c.high + c.low + c.close) / 3, "volume": c.volume} for c in candles]),
        trend=trend_from_emas(ema_9, ema_200), momentum=momentum_from_rsi(indicator_rsi),
        volatility=volatility_from_atr((indicator_atr or 0) / (quote.price or 1)), updated_at=datetime.utcnow(),
    )
    quality = validate_candles(candles)
    regime, reason = _regime(indicators, candles)
    trend_score = _score(50 + (25 if indicators.trend == "UPTREND" else -25 if indicators.trend == "DOWNTREND" else 0))
    momentum_score = _score(indicator_rsi if indicator_rsi is not None else 50)
    technical_score = _score(trend_score * 0.6 + momentum_score * 0.4)
    components = ScoreComponents(technical=technical_score, momentum=momentum_score)
    edge_score = _score(technical_score * 0.25 + momentum_score * 0.15 + 50 * 0.60) if quality.status == "LIVE" else None
    signal = "UNAVAILABLE" if edge_score is None else ("BUY" if edge_score >= 60 and indicators.trend == "UPTREND" else "SELL" if edge_score <= 40 and indicators.trend == "DOWNTREND" else "HOLD")
    risk = "UNAVAILABLE" if indicator_atr is None else ("HIGH" if indicators.volatility == "HIGH" else "MEDIUM" if indicators.volatility == "MEDIUM" else "LOW")
    data_health = "DEMO" if quote.status == "DEMO" else quality.status
    return MarketAnalysis(symbol=symbol, timeframe=timeframe, quote=quote, indicators=indicators, regime=regime, regime_reason=reason,
        edge_score=edge_score, score_label="Developing" if edge_score is not None else None, score_components=components,
        signal=signal, risk=risk, data_health=data_health, generated_at=datetime.utcnow())