from __future__ import annotations

from math import sqrt


def safe_mean(values: list[float]) -> float:
    return sum(values) / len(values) if values else 0.0


def ema(values: list[float], period: int) -> list[float]:
    if not values:
        return []
    multiplier = 2 / (period + 1)
    result: list[float] = []
    prev = values[0]
    for value in values:
        prev = value * multiplier + prev * (1 - multiplier)
        result.append(prev)
    return result


def sma(values: list[float], period: int) -> float | None:
    if not values:
        return None
    window = values[-period:]
    return safe_mean(window)


def rsi(values: list[float], period: int = 14) -> float | None:
    if len(values) < period + 1:
        return None
    deltas = [values[i] - values[i - 1] for i in range(1, len(values))]
    gains = [max(d, 0.0) for d in deltas]
    losses = [abs(min(d, 0.0)) for d in deltas]
    avg_gain = safe_mean(gains[-period:])
    avg_loss = safe_mean(losses[-period:])
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))


def macd(values: list[float]) -> tuple[float | None, float | None]:
    if len(values) < 26:
        return None, None
    slow = ema(values, 26)
    fast = ema(values, 12)
    if not slow or not fast:
        return None, None
    macd_line = fast[-1] - slow[-1]
    signal_line = ema([fast[i] - slow[i] for i in range(len(fast))], 9)[-1]
    return macd_line, signal_line


def atr(candles: list[dict], period: int = 14) -> float | None:
    if len(candles) < period:
        return None
    true_ranges: list[float] = []
    for i in range(1, len(candles)):
        prev = candles[i - 1]
        current = candles[i]
        high_low = current["high"] - current["low"]
        high_prev_close = abs(current["high"] - prev["close"])
        low_prev_close = abs(current["low"] - prev["close"])
        true_ranges.append(max(high_low, high_prev_close, low_prev_close))
    if not true_ranges:
        return None
    return safe_mean(true_ranges[-period:])


def vwap(candles: list[dict]) -> float | None:
    if not candles:
        return None
    total_volume = sum(float(c["volume"]) for c in candles)
    if total_volume == 0:
        return None
    weighted = sum(float(c["typical_price"]) * float(c["volume"]) for c in candles)
    return weighted / total_volume


def adx(candles: list[dict], period: int = 14) -> float | None:
    if len(candles) < period + 1:
        return None
    deltas = []
    for i in range(1, len(candles)):
        deltas.append(candles[i]["close"] - candles[i - 1]["close"])
    if not deltas:
        return None
    avg_move = safe_mean(deltas[-period:])
    return max(0.0, min(100.0, avg_move * 10.0))


def bollinger_bands(values: list[float], period: int = 20, std_dev: float = 2.0) -> tuple[float, float, float]:
    if not values:
        return 0.0, 0.0, 0.0
    window = values[-period:]
    mean = safe_mean(window)
    variance = safe_mean([(v - mean) ** 2 for v in window])
    sigma = sqrt(variance)
    return mean - (std_dev * sigma), mean, mean + (std_dev * sigma)


def trend_from_emas(ema_short: float | None, ema_long: float | None) -> str:
    if ema_short is None or ema_long is None:
        return "NEUTRAL"
    if ema_short > ema_long:
        return "UPTREND"
    if ema_short < ema_long:
        return "DOWNTREND"
    return "NEUTRAL"


def momentum_from_rsi(rsi_value: float | None) -> str:
    if rsi_value is None:
        return "NEUTRAL"
    if rsi_value >= 70:
        return "OVERBOUGHT"
    if rsi_value <= 30:
        return "OVERSOLD"
    return "NEUTRAL"


def volatility_from_atr(atr_value: float | None) -> str:
    if atr_value is None:
        return "MEDIUM"
    if atr_value > 0.02:
        return "HIGH"
    if atr_value < 0.005:
        return "LOW"
    return "MEDIUM"
