from app.database import Base
from app import db_models  # noqa: F401


def test_market_foundation_metadata_contains_required_tables():
    assert {
        "assets",
        "candles",
        "market_snapshots",
        "technical_snapshots",
        "market_regimes",
    } <= set(Base.metadata.tables)


def test_candles_are_unique_per_asset_timeframe_and_timestamp():
    constraint_names = {constraint.name for constraint in Base.metadata.tables["candles"].constraints}
    assert "uq_candle_period" in constraint_names