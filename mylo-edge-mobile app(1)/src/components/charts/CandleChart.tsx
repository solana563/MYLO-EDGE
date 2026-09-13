import { useMemo } from "react";
import type { Candle } from "../../services/market";

function ema(values: number[], period: number) {
  const k = 2 / (period + 1);
  const out: number[] = [];
  let prev = values[0];
  values.forEach((v, i) => {
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
}

type Props = {
  candles: Candle[];
  width?: number;
  height?: number;
  animate?: boolean;
  showMarkers?: boolean;
};

export function CandleChart({
  candles,
  width = 720,
  height = 260,
  animate = true,
  showMarkers = true,
}: Props) {
  const model = useMemo(() => {
    const padL = 6;
    const padR = 62;
    const volH = 38;
    const priceH = height - volH - 10;
    const closes = candles.map((c) => c.close);
    const e12 = ema(closes, 12);
    const e26 = ema(closes, 26);
    const hi = Math.max(...candles.map((c) => c.high));
    const lo = Math.min(...candles.map((c) => c.low));
    const span = hi - lo || 1;
    const pad = span * 0.08;
    const top = hi + pad;
    const bot = lo - pad;
    const innerW = width - padL - padR;
    const step = innerW / candles.length;
    const bw = Math.max(1.5, step * 0.56);
    const y = (p: number) => ((top - p) / (top - bot)) * priceH + 4;
    const x = (i: number) => padL + i * step + step / 2;
    const maxV = Math.max(...candles.map((c) => c.volume));

    const line = (arr: number[]) =>
      arr.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

    const last = candles[candles.length - 1].close;
    const entryIdx = Math.floor(candles.length * 0.62);
    const entry = candles[entryIdx].close;
    const invalidation = lo + span * 0.08;
    const target = hi - span * 0.02;

    return {
      padL, padR, priceH, volH, step, bw, x, y, maxV,
      e12: line(e12), e26: line(e26),
      last, entry, entryIdx, invalidation, target, top, bot,
    };
  }, [candles, width, height]);

  const { x, y, bw, maxV, priceH, volH } = model;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full"
      role="img"
      aria-label="Market price chart with candlesticks, EMA lines, volume and risk markers"
    >
      <defs>
        <linearGradient id="volgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5b8fd9" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5b8fd9" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* horizontal grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((p) => (
        <line
          key={p}
          x1={0}
          x2={width - model.padR + 4}
          y1={4 + p * priceH}
          y2={4 + p * priceH}
          stroke="rgba(255,255,255,0.045)"
          strokeWidth="1"
        />
      ))}

      {/* candles */}
      {candles.map((c, i) => {
        const up = c.close >= c.open;
        const col = up ? "#3fbf7f" : "#e0574d";
        const yO = y(c.open);
        const yC = y(c.close);
        return (
          <g key={i} opacity={0.95}>
            <line x1={x(i)} x2={x(i)} y1={y(c.high)} y2={y(c.low)} stroke={col} strokeWidth="1" opacity="0.75" />
            <rect
              x={x(i) - bw / 2}
              y={Math.min(yO, yC)}
              width={bw}
              height={Math.max(1, Math.abs(yC - yO))}
              fill={col}
              opacity={up ? 0.85 : 0.8}
              rx="0.5"
            />
          </g>
        );
      })}

      {/* EMA lines */}
      <path
        d={model.e26}
        fill="none"
        stroke="#7fa8d9"
        strokeWidth="1.4"
        opacity="0.85"
        className={animate ? "draw-line" : undefined}
      />
      <path
        d={model.e12}
        fill="none"
        stroke="#d9a441"
        strokeWidth="1.2"
        opacity="0.7"
        strokeDasharray="4 3"
      />

      {/* volume */}
      {candles.map((c, i) => {
        const h = (c.volume / maxV) * (volH - 6);
        return (
          <rect
            key={`v${i}`}
            x={x(i) - bw / 2}
            y={height - h - 2}
            width={bw}
            height={h}
            fill="url(#volgrad)"
          />
        );
      })}

      {showMarkers && (
        <>
          {/* entry */}
          <line
            x1={0}
            x2={width - model.padR}
            y1={y(model.entry)}
            y2={y(model.entry)}
            stroke="#7fa8d9"
            strokeWidth="1"
            strokeDasharray="5 4"
            opacity="0.8"
          />
          <rect x={width - model.padR + 2} y={y(model.entry) - 9} width={58} height={18} rx="3.5" fill="#1b2739" />
          <text x={width - model.padR + 8} y={y(model.entry) + 4.5} fontSize="11.5" fill="#7fa8d9" fontFamily="ui-monospace, monospace">
            ENTRY
          </text>

          {/* invalidation */}
          <line
            x1={0}
            x2={width - model.padR}
            y1={y(model.invalidation)}
            y2={y(model.invalidation)}
            stroke="#e0574d"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.75"
          />
          <rect x={width - model.padR + 2} y={y(model.invalidation) - 9} width={58} height={18} rx="3.5" fill="#3a201e" />
          <text x={width - model.padR + 6} y={y(model.invalidation) + 4.5} fontSize="11.5" fill="#e0574d" fontFamily="ui-monospace, monospace">
            INVALID
          </text>

          {/* target */}
          <line
            x1={0}
            x2={width - model.padR}
            y1={y(model.target)}
            y2={y(model.target)}
            stroke="#3fbf7f"
            strokeWidth="1"
            strokeDasharray="3 4"
            opacity="0.6"
          />
          <rect x={width - model.padR + 2} y={y(model.target) - 9} width={58} height={18} rx="3.5" fill="#1c3a2c" />
          <text x={width - model.padR + 12} y={y(model.target) + 4.5} fontSize="11.5" fill="#3fbf7f" fontFamily="ui-monospace, monospace">
            TGT
          </text>

          {/* signal marker */}
          <g>
            <circle cx={x(model.entryIdx)} cy={y(model.entry)} r="8" fill="#7fa8d9" opacity="0.16" className="pulse-dot" />
            <circle cx={x(model.entryIdx)} cy={y(model.entry)} r="3" fill="#7fa8d9" />
          </g>
        </>
      )}
    </svg>
  );
}

export function EquityCurve({
  seed = 3,
  height = 180,
  className,
}: {
  seed?: number;
  height?: number;
  className?: string;
}) {
  const { path, area, dd } = useMemo(() => {
    const n = 90;
    let s = seed * 7919;
    const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
    const pts: number[] = [];
    let v = 100;
    for (let i = 0; i < n; i++) {
      v *= 1 + 0.0038 + (rnd() - 0.48) * 0.019 + Math.sin(i / 11) * 0.0025;
      pts.push(v);
    }
    const hi = Math.max(...pts);
    const lo = Math.min(...pts);
    const w = 640;
    const X = (i: number) => (i / (n - 1)) * w;
    const Y = (p: number) => height - 8 - ((p - lo) / (hi - lo || 1)) * (height - 22);
    const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${X(i).toFixed(1)},${Y(p).toFixed(1)}`).join(" ");
    const a = `${d} L${w},${height} L0,${height} Z`;
    // drawdown shading window
    let peak = pts[0];
    let worst = 0;
    let wStart = 0;
    let wEnd = 0;
    let curStart = 0;
    pts.forEach((p, i) => {
      if (p > peak) {
        peak = p;
        curStart = i;
      }
      const draw = (p - peak) / peak;
      if (draw < worst) {
        worst = draw;
        wStart = curStart;
        wEnd = i;
      }
    });
    return { path: d, area: a, dd: { x1: X(wStart), x2: X(wEnd) } };
  }, [seed, height]);

  return (
    <svg viewBox={`0 0 640 ${height}`} className={className} style={{ width: "100%", height }} role="img" aria-label="Simulated equity curve, demonstration data">
      <defs>
        <linearGradient id="eqfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fbf7f" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#3fbf7f" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.33, 0.66, 1].map((p) => (
        <line key={p} x1="0" x2="640" y1={8 + p * (height - 20)} y2={8 + p * (height - 20)} stroke="rgba(255,255,255,0.05)" />
      ))}
      <rect x={dd.x1} y={0} width={Math.max(2, dd.x2 - dd.x1)} height={height} fill="#e0574d" opacity="0.07" />
      <path d={area} fill="url(#eqfill)" />
      <path d={path} fill="none" stroke="#3fbf7f" strokeWidth="1.6" className="draw-line" />
    </svg>
  );
}

export function Sparkline({
  seed = 1,
  up = true,
  className,
}: {
  seed?: number;
  up?: boolean;
  className?: string;
}) {
  const d = useMemo(() => {
    let s = seed * 104729;
    const rnd = () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296);
    const n = 28;
    let v = 50;
    const pts: number[] = [];
    for (let i = 0; i < n; i++) {
      v += (rnd() - 0.5) * 9 + (up ? 0.9 : -0.9);
      pts.push(v);
    }
    const hi = Math.max(...pts);
    const lo = Math.min(...pts);
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"}${(i / (n - 1)) * 80},${22 - ((p - lo) / (hi - lo || 1)) * 18}`)
      .join(" ");
  }, [seed, up]);
  return (
    <svg viewBox="0 0 80 24" className={className} aria-hidden>
      <path d={d} fill="none" stroke={up ? "#3fbf7f" : "#e0574d"} strokeWidth="1.3" />
    </svg>
  );
}
