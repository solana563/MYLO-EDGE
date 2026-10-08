"""Create market data and analysis foundation."""

from alembic import op
import sqlalchemy as sa

revision = "0001_market_foundation"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table("assets", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("symbol", sa.String(32), nullable=False), sa.Column("name", sa.String(160), nullable=False), sa.Column("asset_type", sa.String(32), nullable=False), sa.Column("exchange", sa.String(64)), sa.Column("currency", sa.String(8), nullable=False), sa.Column("created_at", sa.DateTime(), nullable=False), sa.UniqueConstraint("symbol"))
    op.create_index("ix_assets_symbol", "assets", ["symbol"], unique=False)
    op.create_index("ix_assets_asset_type", "assets", ["asset_type"], unique=False)
    op.create_table("candles", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("asset_id", sa.Integer(), sa.ForeignKey("assets.id", ondelete="CASCADE"), nullable=False), sa.Column("timeframe", sa.String(8), nullable=False), sa.Column("timestamp", sa.DateTime(), nullable=False), sa.Column("received_at", sa.DateTime(), nullable=False), sa.Column("open", sa.Float(), nullable=False), sa.Column("high", sa.Float(), nullable=False), sa.Column("low", sa.Float(), nullable=False), sa.Column("close", sa.Float(), nullable=False), sa.Column("volume", sa.Float(), nullable=False), sa.Column("source", sa.String(64), nullable=False), sa.UniqueConstraint("asset_id", "timeframe", "timestamp", name="uq_candle_period"))
    op.create_index("ix_candles_asset_time", "candles", ["asset_id", "timeframe", "timestamp"], unique=False)
    op.create_table("market_snapshots", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("asset_id", sa.Integer(), sa.ForeignKey("assets.id", ondelete="CASCADE"), nullable=False), sa.Column("price", sa.Float(), nullable=False), sa.Column("change_pct", sa.Float()), sa.Column("status", sa.String(16), nullable=False), sa.Column("source", sa.String(64), nullable=False), sa.Column("timestamp", sa.DateTime(), nullable=False), sa.Column("received_at", sa.DateTime(), nullable=False))
    op.create_index("ix_market_snapshots_asset_id", "market_snapshots", ["asset_id"], unique=False)
    op.create_index("ix_market_snapshots_timestamp", "market_snapshots", ["timestamp"], unique=False)
    op.create_table("technical_snapshots", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("asset_id", sa.Integer(), sa.ForeignKey("assets.id", ondelete="CASCADE"), nullable=False), sa.Column("timeframe", sa.String(8), nullable=False), sa.Column("technical_score", sa.Integer(), nullable=False), sa.Column("trend", sa.String(32), nullable=False), sa.Column("momentum", sa.String(32), nullable=False), sa.Column("volatility", sa.String(32), nullable=False), sa.Column("analyzed_at", sa.DateTime(), nullable=False))
    op.create_index("ix_technical_snapshots_asset_id", "technical_snapshots", ["asset_id"], unique=False)
    op.create_index("ix_technical_snapshots_timeframe", "technical_snapshots", ["timeframe"], unique=False)
    op.create_table("market_regimes", sa.Column("id", sa.Integer(), primary_key=True), sa.Column("asset_id", sa.Integer(), sa.ForeignKey("assets.id", ondelete="CASCADE"), nullable=False), sa.Column("timeframe", sa.String(8), nullable=False), sa.Column("regime", sa.String(32), nullable=False), sa.Column("reason", sa.String(255), nullable=False), sa.Column("analyzed_at", sa.DateTime(), nullable=False))
    op.create_index("ix_market_regimes_asset_id", "market_regimes", ["asset_id"], unique=False)
    op.create_index("ix_market_regimes_timeframe", "market_regimes", ["timeframe"], unique=False)
    op.create_index("ix_market_regimes_regime", "market_regimes", ["regime"], unique=False)


def downgrade() -> None:
    op.drop_table("market_regimes")
    op.drop_table("technical_snapshots")
    op.drop_table("market_snapshots")
    op.drop_table("candles")
    op.drop_table("assets")