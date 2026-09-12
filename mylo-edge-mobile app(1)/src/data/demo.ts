/**
 * DEMONSTRATION DATA ONLY.
 * Every value in this file is synthetic and exists purely to illustrate the
 * MYLO Edge interface. Nothing here is live market data, a recommendation,
 * or a record of real trading performance.
 */

export type Candle = { o: number; h: number; l: number; c: number; v: number };

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function makeCandles(seed: number, start: number, drift = 0.0012, vol = 0.009, n = 64): Candle[] {
  const rnd = seeded(seed);
  const out: Candle[] = [];
  let price = start;
  for (let i = 0; i < n; i++) {
    const wave = Math.sin(i / 7) * vol * 0.5;
    const shock = (rnd() - 0.5) * vol * 2;
    const o = price;
    const c = Math.max(0.0001, o * (1 + drift + wave + shock));
    const h = Math.max(o, c) * (1 + rnd() * vol * 0.6);
    const l = Math.min(o, c) * (1 - rnd() * vol * 0.6);
    out.push({ o, h, l, c, v: 0.35 + rnd() * 0.65 });
    price = c;
  }
  return out;
}

export type Factor = { label: string; value: number };

export type DemoAsset = {
  id: string;
  symbol: string;
  name: string;
  klass: "Crypto" | "Stocks" | "Forex" | "Commodities" | "Indices";
  timeframe: string;
  price: string;
  change: number;
  bias: "BULLISH" | "BEARISH" | "NEUTRAL";
  edge: number;
  risk: "LOW" | "MODERATE" | "ELEVATED" | "HIGH";
  regime: string;
  factors: Factor[];
  levels: { entry: string; invalidation: string; t1: string; t2: string; rr: string; atr: string };
  consensus: string;
  bull: string[];
  bear: string[];
  seed: number;
  base: number;
  drift: number;
  vol: number;
};

export const ASSETS: DemoAsset[] = [
  {
    id: "btc",
    symbol: "BTC/USD",
    name: "Bitcoin",
    klass: "Crypto",
    timeframe: "1H",
    price: "64,182.40",
    change: 1.84,
    bias: "BULLISH",
    edge: 76,
    risk: "MODERATE",
    regime: "TRENDING · EXPANDING VOLATILITY",
    factors: [
      { label: "Technical", value: 86 },
      { label: "Momentum", value: 79 },
      { label: "News", value: 74 },
      { label: "Sentiment", value: 68 },
      { label: "Macro", value: 61 },
      { label: "Liquidity", value: 77 },
    ],
    levels: {
      entry: "64,050",
      invalidation: "62,380",
      t1: "66,400",
      t2: "68,900",
      rr: "2.1 : 1",
      atr: "1.42%",
    },
    consensus:
      "Conditions currently favor the bullish case, but risk remains elevated while volatility expands into the weekly range high.",
    bull: [
      "Price holding above rising 50/200 EMA structure",
      "Momentum confirmed by higher-low sequence",
      "Volume expansion on advancing candles",
      "Supportive flow-related catalyst in window",
    ],
    bear: [
      "Realized volatility above 30-day average",
      "Prior supply zone within 3.4% overhead",
      "Rate-path uncertainty into macro release",
      "Positioning sentiment stretched short-term",
    ],
    seed: 7,
    base: 61200,
    drift: 0.0011,
    vol: 0.011,
  },
  {
    id: "aapl",
    symbol: "AAPL",
    name: "Apple Inc.",
    klass: "Stocks",
    timeframe: "1D",
    price: "231.68",
    change: -0.42,
    bias: "NEUTRAL",
    edge: 58,
    risk: "LOW",
    regime: "RANGE-BOUND · COMPRESSING VOLATILITY",
    factors: [
      { label: "Technical", value: 62 },
      { label: "Momentum", value: 51 },
      { label: "News", value: 66 },
      { label: "Sentiment", value: 57 },
      { label: "Macro", value: 64 },
      { label: "Liquidity", value: 88 },
    ],
    levels: {
      entry: "230.90",
      invalidation: "224.10",
      t1: "238.50",
      t2: "244.00",
      rr: "1.6 : 1",
      atr: "1.08%",
    },
    consensus:
      "Evidence is mixed. Structure is neutral inside a multi-week range; the case strengthens only on a confirmed range resolution.",
    bull: [
      "Range support repeatedly defended",
      "Balance-sheet quality supports valuation floor",
      "Deep liquidity reduces slippage risk",
      "Volatility compression precedes expansion",
    ],
    bear: [
      "No directional trend confirmation",
      "Momentum flat across timeframes",
      "Earnings event risk inside horizon",
      "Sector rotation pressure",
    ],
    seed: 21,
    base: 224,
    drift: 0.0004,
    vol: 0.006,
  },
  {
    id: "eurusd",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    klass: "Forex",
    timeframe: "4H",
    price: "1.0847",
    change: -0.28,
    bias: "BEARISH",
    edge: 64,
    risk: "ELEVATED",
    regime: "TRENDING DOWN · EVENT SENSITIVE",
    factors: [
      { label: "Technical", value: 71 },
      { label: "Momentum", value: 68 },
      { label: "News", value: 59 },
      { label: "Sentiment", value: 55 },
      { label: "Macro", value: 78 },
      { label: "Liquidity", value: 84 },
    ],
    levels: {
      entry: "1.0852",
      invalidation: "1.0938",
      t1: "1.0740",
      t2: "1.0665",
      rr: "1.9 : 1",
      atr: "0.42%",
    },
    consensus:
      "Macro divergence supports the bearish case, but the position is highly sensitive to the scheduled central bank event.",
    bull: [
      "Oversold short-term oscillators",
      "Prior demand shelf below spot",
      "Positioning crowded on the short side",
      "Seasonality mildly supportive",
    ],
    bear: [
      "Rate differential widening against EUR",
      "Lower-high structure intact on 4H",
      "Yield spread trending unfavourably",
      "Event risk skewed to USD strength",
    ],
    seed: 33,
    base: 1.114,
    drift: -0.0006,
    vol: 0.0035,
  },
  {
    id: "gold",
    symbol: "GOLD",
    name: "XAU/USD Spot Gold",
    klass: "Commodities",
    timeframe: "1D",
    price: "2,391.20",
    change: 0.63,
    bias: "BULLISH",
    edge: 71,
    risk: "MODERATE",
    regime: "TRENDING · HIGH REAL-RATE SENSITIVITY",
    factors: [
      { label: "Technical", value: 80 },
      { label: "Momentum", value: 74 },
      { label: "News", value: 63 },
      { label: "Sentiment", value: 72 },
      { label: "Macro", value: 69 },
      { label: "Liquidity", value: 66 },
    ],
    levels: {
      entry: "2,388",
      invalidation: "2,318",
      t1: "2,452",
      t2: "2,510",
      rr: "1.8 : 1",
      atr: "0.94%",
    },
    consensus:
      "Trend structure and macro hedging demand support the bullish case; a real-yield reversal is the primary invalidation risk.",
    bull: [
      "Uptrend with rising higher lows",
      "Defensive demand into macro uncertainty",
      "Breakout retest held as support",
      "Central bank accumulation narrative",
    ],
    bear: [
      "Extended from 200-day average",
      "Real yields could reverse the bid",
      "Thin liquidity in overnight session",
      "Speculative longs elevated",
    ],
    seed: 45,
    base: 2265,
    drift: 0.0009,
    vol: 0.007,
  },
];

export const EDGE_BREAKDOWN: Factor[] = [
  { label: "TECHNICAL", value: 86 },
  { label: "MOMENTUM", value: 79 },
  { label: "NEWS", value: 74 },
  { label: "SENTIMENT", value: 68 },
  { label: "FUNDAMENTALS", value: 82 },
  { label: "MACRO", value: 61 },
  { label: "LIQUIDITY", value: 77 },
  { label: "RISK", value: 71 },
];

export const LENSES = [
  "PRICE",
  "TECHNICALS",
  "NEWS",
  "SENTIMENT",
  "FUNDAMENTALS",
  "MACRO",
  "RESEARCH",
  "RISK",
  "EDGE SCORE",
  "DECISION",
];

export type IntelPanel = {
  key: string;
  title: string;
  blurb: string;
  rows: { k: string; v: string; tone?: "bull" | "bear" | "warn" | "info" }[];
};

export const INTEL_PANELS: IntelPanel[] = [
  {
    key: "technical",
    title: "Technical",
    blurb: "Trend, momentum, volatility, support/resistance and market structure.",
    rows: [
      { k: "Trend (50/200 EMA)", v: "Aligned up", tone: "bull" },
      { k: "Momentum (RSI 14)", v: "61.4", tone: "info" },
      { k: "Structure", v: "Higher highs / higher lows", tone: "bull" },
      { k: "Nearest resistance", v: "+3.4%", tone: "warn" },
      { k: "Volatility (ATR%)", v: "1.42%", tone: "info" },
    ],
  },
  {
    key: "news",
    title: "News",
    blurb: "Relevant headlines, events and catalysts mapped to the instrument.",
    rows: [
      { k: "Headlines in window", v: "18 · clustered", tone: "info" },
      { k: "Catalyst proximity", v: "Within 24h", tone: "warn" },
      { k: "Tone balance", v: "Net constructive", tone: "bull" },
      { k: "Source diversity", v: "Moderate", tone: "info" },
      { k: "Unresolved narrative", v: "1 open item", tone: "warn" },
    ],
  },
  {
    key: "sentiment",
    title: "Sentiment",
    blurb: "Market and positioning sentiment, where reliable data exists.",
    rows: [
      { k: "Positioning skew", v: "Net long", tone: "warn" },
      { k: "Short-term crowding", v: "Elevated", tone: "bear" },
      { k: "Derivatives funding", v: "Mildly positive", tone: "info" },
      { k: "Data confidence", v: "Medium", tone: "info" },
      { k: "Divergence vs price", v: "None detected", tone: "bull" },
    ],
  },
  {
    key: "fundamentals",
    title: "Fundamentals",
    blurb: "Financial and valuation information where the asset class supports it.",
    rows: [
      { k: "Coverage", v: "Equities · ETFs", tone: "info" },
      { k: "Valuation vs sector", v: "In-line", tone: "info" },
      { k: "Earnings trajectory", v: "Improving", tone: "bull" },
      { k: "Balance sheet", v: "Stable", tone: "bull" },
      { k: "Estimate revisions", v: "Mixed", tone: "warn" },
    ],
  },
  {
    key: "macro",
    title: "Macro",
    blurb: "Rates, inflation, yields, currencies and scheduled economic events.",
    rows: [
      { k: "Policy path", v: "Data dependent", tone: "warn" },
      { k: "Real yields", v: "Drifting lower", tone: "bull" },
      { k: "Dollar trend", v: "Range", tone: "info" },
      { k: "Inflation surprise", v: "Neutral", tone: "info" },
      { k: "Events in 48h", v: "2 high importance", tone: "warn" },
    ],
  },
  {
    key: "liquidity",
    title: "Liquidity",
    blurb: "Volume, volatility and microstructure data where available.",
    rows: [
      { k: "Relative volume", v: "1.28x", tone: "bull" },
      { k: "Spread quality", v: "Tight", tone: "bull" },
      { k: "Depth stability", v: "Normal", tone: "info" },
      { k: "Session gaps", v: "Low", tone: "info" },
      { k: "Slippage estimate", v: "Modelled", tone: "info" },
    ],
  },
];

export const MODULES = [
  { name: "MYLO MARKETS", desc: "Explore markets and instruments.", icon: "globe", to: "/markets" },
  { name: "MYLO SCANNER", desc: "Find opportunities across markets.", icon: "scan", to: "/signals" },
  { name: "MYLO SIGNALS", desc: "Monitor structured signals.", icon: "activity", to: "/signals" },
  { name: "MYLO CHARTS", desc: "Analyze price action.", icon: "candlestick", to: "/markets" },
  { name: "MYLO RESEARCH", desc: "Understand the evidence.", icon: "microscope", to: "/research" },
  { name: "MYLO BACKTEST", desc: "Test strategies historically.", icon: "history", to: "/backtesting" },
  { name: "MYLO PAPER", desc: "Practice with simulated capital.", icon: "wallet", to: "/paper-trading" },
  { name: "MYLO RISK", desc: "Understand exposure before acting.", icon: "shield", to: "/how-it-works" },
  { name: "MYLO ALERTS", desc: "Monitor important changes.", icon: "bell", to: "/signals" },
];

export const EVENTS = [
  {
    time: "08:30",
    title: "Economic Release",
    importance: "HIGH",
    markets: "FX · Rates · Indices",
    vol: "Elevated",
  },
  {
    time: "10:00",
    title: "Market Data Event",
    importance: "MEDIUM",
    markets: "Commodities · Energy",
    vol: "Moderate",
  },
  {
    time: "14:00",
    title: "Central Bank Event",
    importance: "HIGH",
    markets: "FX · Rates · Gold",
    vol: "High",
  },
  {
    time: "16:30",
    title: "Earnings",
    importance: "MEDIUM",
    markets: "Single stock · Sector",
    vol: "Moderate",
  },
];

export const OPPORTUNITIES = [
  { s: "BTC/USD", k: "Crypto", edge: 76, risk: 58, mom: 79, bias: "BULLISH" },
  { s: "ETH/USD", k: "Crypto", edge: 69, risk: 64, mom: 71, bias: "BULLISH" },
  { s: "AAPL", k: "Stocks", edge: 58, risk: 31, mom: 51, bias: "NEUTRAL" },
  { s: "MSFT", k: "Stocks", edge: 66, risk: 34, mom: 62, bias: "BULLISH" },
  { s: "NVDA", k: "Stocks", edge: 73, risk: 71, mom: 88, bias: "BULLISH" },
  { s: "EUR/USD", k: "Forex", edge: 64, risk: 62, mom: 44, bias: "BEARISH" },
  { s: "USD/JPY", k: "Forex", edge: 55, risk: 49, mom: 58, bias: "NEUTRAL" },
  { s: "GOLD", k: "Commodities", edge: 71, risk: 47, mom: 74, bias: "BULLISH" },
  { s: "WTI", k: "Commodities", edge: 48, risk: 76, mom: 39, bias: "BEARISH" },
  { s: "SPX", k: "Indices", edge: 62, risk: 41, mom: 60, bias: "NEUTRAL" },
  { s: "NDX", k: "Indices", edge: 68, risk: 52, mom: 70, bias: "BULLISH" },
  { s: "DAX", k: "Indices", edge: 53, risk: 44, mom: 47, bias: "NEUTRAL" },
];

export const FORENSICS = [
  { dim: "By asset class", a: "Equities", b: "Crypto", c: "FX" },
  { dim: "By timeframe", a: "1H", b: "4H", c: "1D" },
  { dim: "By market regime", a: "Trending", b: "Range", c: "High-vol" },
  { dim: "By Edge Score band", a: "50–64", b: "65–79", c: "80+" },
  { dim: "By signal type", a: "Breakout", b: "Pullback", c: "Reversion" },
  { dim: "By volatility bucket", a: "Low", b: "Normal", c: "Expanded" },
];

export const FAQS = [
  {
    q: "What is MYLO Edge?",
    a: "MYLO Edge is a market-intelligence and paper-trading platform. It brings market data, technical analysis, research consensus, market context, catalysts and independent risk analysis into a single structured workflow so you can investigate an opportunity properly before acting.",
  },
  {
    q: "Does MYLO guarantee trading profits?",
    a: "No. MYLO Edge is a decision-support and research platform. It does not promise or guarantee any investment return, and nothing on this site should be read as a prediction of future prices.",
  },
  {
    q: "Does MYLO place live trades?",
    a: "No. MYLO Edge does not automatically place live trades. Trading in the platform is simulated (paper trading). Any decision to act in a live market is made by you, in your own broker or exchange account.",
  },
  {
    q: "What is Edge Score?",
    a: "Edge Score is a composite decision-support metric that summarises how several categories of evidence — technical, momentum, news, sentiment, fundamentals, macro, liquidity and risk — currently align for an instrument. It is a summary of available evidence, not a probability of profit.",
  },
  {
    q: "How does Research Consensus work?",
    a: "Research agents built on the TradingAgents research framework assemble the strongest supporting and opposing arguments from the available evidence, then produce a concise structured summary covering outlook, bull case, bear case, consensus, risks and catalysts. Underlying model reasoning is not exposed; only the structured findings are shown.",
  },
  {
    q: "What is paper trading?",
    a: "Paper trading is trading with simulated capital. You place simulated orders against market data, track simulated positions, P&L, portfolio exposure and trade history, and practise risk controls without risking real money.",
  },
  {
    q: "Can I backtest strategies?",
    a: "Yes. MYLO Backtest runs strategies against historical market data. The architecture is designed to limit look-ahead bias and to account for fees and slippage where the data supports it. Backtest results are historical simulations and do not guarantee future results.",
  },
  {
    q: "What markets does MYLO support?",
    a: "Coverage is organised around equities, crypto, forex, commodities and indices. Available instruments, history depth and data granularity depend on the data providers connected to your plan and region.",
  },
  {
    q: "Where does market data come from?",
    a: "Market data is sourced from third-party providers. Data may be delayed, incomplete or revised depending on the provider and instrument, and MYLO displays data-quality context where it can.",
  },
  {
    q: "How does MYLO handle risk?",
    a: "Risk is assessed separately from opportunity. Every opportunity carries an explicit invalidation level, volatility context, position-risk and exposure framing, so the downside is visible at the same time as the thesis.",
  },
  {
    q: "Is MYLO financial advice?",
    a: "No. MYLO Edge does not provide financial, investment, legal or tax advice, and does not take into account your personal circumstances. You are responsible for your own trading and investment decisions.",
  },
];

export const AUDIENCES = [
  {
    tag: "THE LEARNING TRADER",
    desc: "Understand why markets move and build better research habits before putting capital at risk.",
    points: ["Guided research structure", "Glossary and concept guides", "Paper trading from day one"],
  },
  {
    tag: "THE ACTIVE TRADER",
    desc: "Bring technicals, catalysts and research into one workflow instead of ten browser tabs.",
    points: ["Scanner and watchlists", "Catalyst and event radar", "Risk framing on every idea"],
  },
  {
    tag: "THE SYSTEMATIC TRADER",
    desc: "Backtest strategies, evaluate signals and study historical outcomes across regimes.",
    points: ["Historical strategy testing", "Signal forensics", "Regime and volatility breakdowns"],
  },
];
