from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Iterable

from app.models import Candle


@dataclass(frozen=True)
class BacktestResult:
    initial_capital: float
    final_capital: float
    net_return: float
    trades: int


def run_backtest(candles: Iterable[Candle], initial_capital: float, signal: Callable[[list[Candle]], str]) -> BacktestResult:
    if initial_capital <= 0:
        raise ValueError("initial_capital must be positive")
    history: list[Candle] = []
    capital = initial_capital
    position = 0.0
    entry = 0.0
    trades = 0
    for candle in candles:
        decision = signal(history)
        if decision == "BUY" and position == 0:
            position = capital / candle.open
            entry = candle.open
            capital = 0
            trades += 1
        elif decision == "SELL" and position > 0:
            capital = position * candle.open
            position = 0
            trades += 1
        history.append(candle)
    if position:
        capital = position * history[-1].close
    return BacktestResult(initial_capital, capital, (capital - initial_capital) / initial_capital * 100, trades)