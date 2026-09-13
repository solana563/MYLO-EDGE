from app.technical import adx, atr, bollinger_bands, ema, macd, momentum_from_rsi, rsi, trend_from_emas, vwap


def test_ema_returns_expected_length():
    values = [100.0, 101.0, 102.0, 103.0, 104.0]
    output = ema(values, 9)
    assert len(output) == len(values)
    assert output[-1] > values[0]


def test_rsi_is_in_range():
    values = [100, 101, 102, 103, 104, 105, 104, 103, 102, 101, 100, 99, 98, 97, 96]
    value = rsi(values, 14)
    assert value is not None
    assert 0 <= value <= 100


def test_bollinger_bands_are_ordered():
    lower, mid, upper = bollinger_bands([100, 101, 102, 103, 104, 105], 5, 2)
    assert lower <= mid <= upper


def test_macd_works_for_sufficient_data():
    values = [i for i in range(40)]
    macd_line, signal_line = macd(values)
    assert macd_line is not None
    assert signal_line is not None


def test_trend_and_momentum_helpers():
    assert trend_from_emas(105.0, 100.0) == "UPTREND"
    assert momentum_from_rsi(72.0) == "OVERBOUGHT"


def test_vwap_and_atr_are_numeric():
    candles = [
        {"high": 10.0, "low": 9.0, "close": 9.5, "volume": 100},
        {"high": 11.0, "low": 9.5, "close": 10.5, "volume": 150},
        {"high": 12.0, "low": 10.0, "close": 11.0, "volume": 200},
    ]
    assert vwap([{"typical_price": (c["high"] + c["low"] + c["close"]) / 3.0, "volume": c["volume"]} for c in candles]) is not None
    assert atr(candles, 2) is not None
    assert adx(candles, 2) is not None
