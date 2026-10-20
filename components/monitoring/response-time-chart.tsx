"use client";

import { useState } from "react";
import { Clock, Activity } from "lucide-react";

export function ResponseTimeChart() {
  const [range, setRange] = useState<"1h" | "24h" | "7d">("24h");

  // Simulated 24 datapoints
  const data = [
    { t: "00:00", p50: 24, p95: 45, p99: 72 },
    { t: "02:00", p50: 22, p95: 41, p99: 68 },
    { t: "04:00", p50: 25, p95: 44, p99: 70 },
    { t: "06:00", p50: 31, p95: 58, p99: 89 },
    { t: "08:00", p50: 42, p95: 78, p99: 115 },
    { t: "10:00", p50: 48, p95: 84, p99: 130 },
    { t: "12:00", p50: 52, p95: 92, p99: 145 },
    { t: "14:00", p50: 46, p95: 81, p99: 122 },
    { t: "16:00", p50: 39, p95: 69, p99: 104 },
    { t: "18:00", p50: 35, p95: 62, p99: 95 },
    { t: "20:00", p50: 28, p95: 50, p99: 81 },
    { t: "22:00", p50: 25, p95: 46, p99: 75 },
  ];

  const maxVal = 160;
  const height = 180;
  const width = 500;
  const padding = 20;

  const getCoordinates = (key: "p50" | "p95" | "p99") => {
    return data.map((d, i) => ({
      x: padding + (i / (data.length - 1)) * (width - padding * 2),
      y: height - padding - (d[key] / maxVal) * (height - padding * 2),
    }));
  };

  const toPath = (coords: Array<{ x: number; y: number }>) =>
    coords.reduce((acc, c, i) => (i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`), "");

  const p50Coords = getCoordinates("p50");
  const p95Coords = getCoordinates("p95");
  const p99Coords = getCoordinates("p99");

  return (
    <div className="glass-card p-5 space-y-4">
      {/* Title + Filter */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-cyber-cyan" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white">
            Latency Distribution (Percentiles)
          </h4>
        </div>

        <div className="flex gap-1 rounded border border-cyber-white/10 bg-cyber-white/[0.02] p-0.5 text-xs font-mono">
          {(["1h", "24h", "7d"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded px-2 py-0.5 uppercase transition-all ${
                range === r ? "bg-cyber-cyan/20 text-cyber-cyan font-bold" : "text-cyber-white/40 hover:text-cyber-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.08)" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />

          {/* P99 Curve (Red/Pink) */}
          <path d={toPath(p99Coords)} fill="none" stroke="#FF2D7B" strokeWidth="1.5" strokeDasharray="2 2" />
          {/* P95 Curve (Purple) */}
          <path d={toPath(p95Coords)} fill="none" stroke="#7B2FFF" strokeWidth="2" />
          {/* P50 Curve (Cyan) */}
          <path
            d={toPath(p50Coords)}
            fill="none"
            stroke="#00F0FF"
            strokeWidth="2.5"
            style={{ filter: "drop-shadow(0 0 6px rgba(0,240,255,0.4))" }}
          />
        </svg>
      </div>

      {/* Legend & Current Latencies */}
      <div className="flex flex-wrap items-center justify-between border-t border-cyber-white/5 pt-3 text-xs font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-cyber-cyan">
            <span className="h-2 w-2 rounded-full bg-cyber-cyan" /> P50 (Median): 25ms
          </span>
          <span className="flex items-center gap-1 text-cyber-purple">
            <span className="h-2 w-2 rounded-full bg-cyber-purple" /> P95: 46ms
          </span>
          <span className="flex items-center gap-1 text-cyber-pink">
            <span className="h-2 w-2 rounded-full bg-cyber-pink" /> P99: 75ms
          </span>
        </div>
        <span className="text-cyber-white/30">Target SLA &lt; 100ms</span>
      </div>
    </div>
  );
}
