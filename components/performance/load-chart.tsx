"use client";

import { PerformanceTest } from "@/types/performance";
import { Activity, Radio } from "lucide-react";

export function LoadChart({
  test,
  isRunning = false,
}: {
  test: PerformanceTest;
  isRunning?: boolean;
}) {
  const points = test.metrics || [];
  const maxResponse = Math.max(...points.map((p) => p.responseTime), 100);

  // SVG Chart Dimensions
  const height = 220;
  const width = 600;
  const padding = 30;

  // Build SVG Path Coordinates
  const coordinates = points.map((p, index) => {
    const x = padding + (index / (points.length - 1 || 1)) * (width - padding * 2);
    const y = height - padding - (p.responseTime / maxResponse) * (height - padding * 2);
    return { x, y, ...p };
  });

  const pathD =
    coordinates.length > 0
      ? coordinates.reduce(
          (acc, curr, idx) =>
            idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`,
          ""
        )
      : "";

  const areaD =
    coordinates.length > 0
      ? `${pathD} L ${coordinates[coordinates.length - 1].x} ${height - padding} L ${coordinates[0].x} ${height - padding} Z`
      : "";

  return (
    <div className="glass-card overflow-hidden">
      {/* Chart Title */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 px-5 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyber-cyan" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white">
            Response Latency Over Test Duration
          </h4>
        </div>

        {isRunning && (
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyber-green animate-pulse">
            <Radio className="h-3 w-3" />
            <span>Streaming Metrics</span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <div className="p-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <line
            x1={padding}
            y1={padding}
            x2={width - padding}
            y2={padding}
            stroke="rgba(255,255,255,0.05)"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Area Fill */}
          {areaD && <path d={areaD} fill="url(#cyberGradient)" />}

          {/* Main Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 6px rgba(0, 240, 255, 0.6))" }}
            />
          )}

          {/* Data Nodes */}
          {coordinates.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r="4"
              fill="#0A0A1A"
              stroke="#00F0FF"
              strokeWidth="2"
              className="hover:r-6 cursor-pointer transition-all"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-cyber-white/40">
          <span>0s (Start)</span>
          <span className="text-cyber-cyan font-bold">Peak: {maxResponse.toFixed(1)} ms</span>
          <span>{points.length * 3}s (Completed)</span>
        </div>
      </div>
    </div>
  );
}
