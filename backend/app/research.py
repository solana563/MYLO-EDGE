from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
import os
import sys
from typing import Any, Protocol


@dataclass(frozen=True)
class ResearchReport:
    symbol: str
    outlook: str
    bull_case: tuple[str, ...]
    bear_case: tuple[str, ...]
    catalysts: tuple[str, ...]
    risks: tuple[str, ...]
    consensus: str
    status: str
    source: str
    generated_at: datetime


class TradingResearchAdapter(Protocol):
    def run(self, symbol: str, analysis_date: date) -> ResearchReport: ...


class UnavailableResearchAdapter:
    def run(self, symbol: str, analysis_date: date) -> ResearchReport:
        return ResearchReport(symbol, "UNAVAILABLE", (), (), (), (), "Research engine unavailable", "UNAVAILABLE", "TradingAgents", datetime.utcnow())


class TradingAgentsAdapter:
    """MYLO boundary for TradingAgents v0.2.x; no agent transcripts are exposed."""

    def __init__(self, config: dict[str, Any]):
        self.config = config

    def run(self, symbol: str, analysis_date: date) -> ResearchReport:
        provider = self.config["llm_provider"]
        key_name = {"openai": "OPENAI_API_KEY", "google": "GOOGLE_API_KEY", "anthropic": "ANTHROPIC_API_KEY", "xai": "XAI_API_KEY", "openrouter": "OPENROUTER_API_KEY"}.get(provider)
        provider_key = self.config.get("api_key") or (os.getenv(key_name) if key_name else None)
        if key_name and not provider_key:
            return UnavailableResearchAdapter().run(symbol, analysis_date)
        if key_name and provider_key:
            os.environ[key_name] = provider_key
            if provider == "openrouter":
                # TradingAgents v0.2.0 routes OpenRouter through ChatOpenAI;
                # this alias supports client versions that read OpenAI's key.
                os.environ["OPENAI_API_KEY"] = provider_key
        source_path = self.config.get("source_path")
        if source_path and source_path not in sys.path:
            sys.path.insert(0, source_path)
        try:
            from tradingagents.graph.trading_graph import TradingAgentsGraph
            from tradingagents.default_config import DEFAULT_CONFIG
        except ImportError:
            return UnavailableResearchAdapter().run(symbol, analysis_date)
        config = DEFAULT_CONFIG.copy()
        config.update(self.config)
        try:
            graph = TradingAgentsGraph(config=config)
            state, decision = graph.propagate(symbol, analysis_date.isoformat())
        except Exception:
            return UnavailableResearchAdapter().run(symbol, analysis_date)
        return ResearchReport(symbol, "STRUCTURED", (), (), (), (), str(decision), "AVAILABLE", f"TradingAgents {self.config['version']}", datetime.utcnow())


def get_research_adapter() -> TradingResearchAdapter:
    from app.config import get_settings
    settings = get_settings()
    provider = settings.tradingagents_provider.lower()
    if provider not in {"tradingagents", "openrouter"}:
        return UnavailableResearchAdapter()
    return TradingAgentsAdapter({
        "project_dir": ".",
        "version": settings.tradingagents_version,
        "source_path": settings.tradingagents_source_path,
        "llm_provider": "openrouter" if provider == "openrouter" else settings.tradingagents_llm_provider,
        "api_key": settings.openrouter_api_key if provider == "openrouter" else settings.tradingagents_api_key,
        "deep_think_llm": settings.tradingagents_deep_model,
        "quick_think_llm": settings.tradingagents_quick_model,
        "backend_url": settings.tradingagents_backend_url,
        "max_debate_rounds": settings.tradingagents_max_debate_rounds,
        "max_risk_discuss_rounds": settings.tradingagents_max_risk_rounds,
    })