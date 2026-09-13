from datetime import date

from app.research import TradingAgentsAdapter
from app.config import Settings


def test_missing_llm_key_is_unavailable_before_optional_import(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    report = TradingAgentsAdapter({"llm_provider": "openai", "version": "v0.2.0"}).run("BTC/USD", date.today())
    assert report.status == "UNAVAILABLE"


def test_default_research_configuration_uses_ollama():
    settings = Settings()
    assert settings.tradingagents_provider == "openrouter"
    assert settings.tradingagents_llm_provider == "openrouter"
    assert settings.tradingagents_deep_model == "google/gemma-2-9b-it:free"
    assert settings.tradingagents_quick_model == "meta-llama/llama-3-8b-instruct:free"
    assert settings.tradingagents_backend_url == "https://openrouter.ai/api/v1"


def test_openrouter_key_is_loaded_from_dotenv_settings(monkeypatch):
    monkeypatch.setenv("OPENROUTER_API_KEY", "test-key")
    settings = Settings()
    assert settings.openrouter_api_key == "test-key"