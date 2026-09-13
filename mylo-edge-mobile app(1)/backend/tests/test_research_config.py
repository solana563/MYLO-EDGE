from datetime import date

from app.research import TradingAgentsAdapter


def test_missing_llm_key_is_unavailable_before_optional_import(monkeypatch):
    monkeypatch.delenv("OPENAI_API_KEY", raising=False)
    report = TradingAgentsAdapter({"llm_provider": "openai", "version": "v0.2.0"}).run("BTC/USD", date.today())
    assert report.status == "UNAVAILABLE"