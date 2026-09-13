from __future__ import annotations

from dataclasses import dataclass, field
from enum import StrEnum


class OrderStatus(StrEnum):
    PENDING = "PENDING"
    FILLED = "FILLED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"


@dataclass(frozen=True)
class PaperOrder:
    symbol: str
    side: str
    quantity: float
    order_type: str = "MARKET"
    status: OrderStatus = OrderStatus.PENDING
    fill_price: float | None = None
    reason: str | None = None


@dataclass
class PaperAccount:
    cash: float
    fee_rate: float = 0.0
    positions: dict[str, float] = field(default_factory=dict)
    orders: list[PaperOrder] = field(default_factory=list)


class PaperBroker:
    def __init__(self, account: PaperAccount):
        self.account = account

    def place_market_order(self, symbol: str, side: str, quantity: float, price: float) -> PaperOrder:
        if quantity <= 0 or price <= 0 or side not in {"BUY", "SELL"}:
            order = PaperOrder(symbol, side, quantity, status=OrderStatus.REJECTED, reason="invalid_order")
        else:
            gross = quantity * price
            fee = gross * self.account.fee_rate
            if side == "BUY" and self.account.cash < gross + fee:
                order = PaperOrder(symbol, side, quantity, status=OrderStatus.REJECTED, reason="insufficient_cash")
            else:
                self.account.cash += -gross - fee if side == "BUY" else gross - fee
                self.account.positions[symbol] = self.account.positions.get(symbol, 0) + (quantity if side == "BUY" else -quantity)
                order = PaperOrder(symbol, side, quantity, status=OrderStatus.FILLED, fill_price=price)
        self.account.orders.append(order)
        return order