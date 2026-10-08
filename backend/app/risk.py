from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PositionSizing:
    accepted: bool
    quantity: float
    maximum_risk: float
    risk_per_unit: float
    reason: str | None = None


def size_position(account_balance: float, risk_percent: float, entry: float, stop: float, max_exposure_percent: float | None = None) -> PositionSizing:
    if account_balance <= 0 or not 0 < risk_percent <= 100:
        return PositionSizing(False, 0, 0, 0, "invalid_account_or_risk")
    risk_per_unit = abs(entry - stop)
    if entry <= 0 or stop <= 0 or risk_per_unit == 0:
        return PositionSizing(False, 0, 0, risk_per_unit, "invalid_entry_or_stop")
    maximum_risk = account_balance * risk_percent / 100
    quantity = maximum_risk / risk_per_unit
    if max_exposure_percent is not None and quantity * entry > account_balance * max_exposure_percent / 100:
        return PositionSizing(False, 0, maximum_risk, risk_per_unit, "max_exposure_exceeded")
    return PositionSizing(True, quantity, maximum_risk, risk_per_unit)