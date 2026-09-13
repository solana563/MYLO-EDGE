export type MarketStatus = "LIVE" | "DELAYED" | "STALE" | "OFFLINE" | "DEMO";

export type Candle = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type MarketQuote = {
  symbol: string;
  name: string;
  price: number;
  previous_close: number | null;
  change_pct: number | null;
  status: MarketStatus;
  source: string;
  last_updated: string;
};

export type IndicatorSnapshot = {
  symbol: string;
  timeframe: string;
  ema_9: number | null;
  ema_21: number | null;
  ema_50: number | null;
  ema_200: number | null;
  rsi: number | null;
  macd: number | null;
  atr: number | null;
  adx: number | null;
  vwap: number | null;
  trend: string;
  momentum: string;
  volatility: string;
  updated_at: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function fetchJson<T>(input: string): Promise<T> {
  const response = await fetch(`${API_BASE}${input}`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const marketService = {
  getMarkets: () => fetchJson<string[]>("/api/v1/markets"),
  getAsset: (symbol: string) => fetchJson<{ symbol: string; name: string; price: number | null; change_pct: number | null; market_status: MarketStatus }>(`/api/v1/assets/${encodeURIComponent(symbol)}`),
  getQuote: (symbol: string) => fetchJson<MarketQuote>(`/api/v1/quotes/${encodeURIComponent(symbol)}`),
  getCandles: (symbol: string, timeframe = "1H", limit = 120) =>
    fetchJson<Candle[]>(`/api/v1/candles/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}&limit=${limit}`),
  getIndicators: (symbol: string, timeframe = "1H") =>
    fetchJson<IndicatorSnapshot>(`/api/v1/indicators/${encodeURIComponent(symbol)}?timeframe=${encodeURIComponent(timeframe)}`),
};
