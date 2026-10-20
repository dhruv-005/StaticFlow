"use client";

import { useState } from "react";
import { Activity, Clock, TrendingDown, Zap } from "lucide-react";

const timeRanges = ["1H", "6H", "24H", "7D", "30D"];

const chartData = [
  { time: "00:00", response: 45, requests: 120 },
  { time: "03:00", response: 38, requests: 45 },
  { time: "06:00", response: 42, requests: 80 },
  { time: "09:00", response: 55, requests: 340 },
  { time: "12:00", response: 62, requests: 520 },
  { time: "15:00", response: 48, requests: 410 },
  { time: "18:00", response: 52, requests: 380 },
  { time: "21:00", response: 41, requests: 200 },
  { time: "Now", response: 39, requests: 150 },
];

const maxResponse = Math.max(...chartData.map((d) => d.response));

export function PerformanceChart() {
  const [activeRange, setActiveRange] = useState("24H");

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-cyber-white/5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cyber-purple" />
          <h2 className="font-bold text-cyber-white">Performance Overview</h2>
        </div>
        <div className="flex gap-1 rounded-lg border border-cyber-white/10 bg-cyber-white/[0.02] p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                activeRange === range
                  ? "bg-cyber-cyan/10 text-cyber-cyan"
                  : "text-cyber-white/30 hover:text-cyber-white/60"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 border-b border-cyber-white/5 px-6 py-4">
        <div>
          <p className="text-xs text-cyber-white/30">Avg Response</p>
          <p className="mt-1 text-xl font-black text-cyber-cyan">42ms</p>
        </div>
        <div>
          <p className="text-xs text-cyber-white/30">P95 Latency</p>
          <p className="mt-1 text-xl font-black text-cyber-purple">89ms</p>
        </div>
        <div>
          <p className="text-xs text-cyber-white/30">Throughput</p>
          <p className="mt-1 text-xl font-black text-cyber-green">1.2K/s</p>
        </div>
      </div>

      {/* Chart Area (CSS-based bar chart) */}
      <div className="px-6 py-6">
        <div className="flex items-end gap-2 h-40">
          {chartData.map((point, i) => {
            const height = (point.response / maxResponse) * 100;
            return (
              <div
                key={i}
                className="group relative flex flex-1 flex-col items-center gap-1"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block
                                rounded-lg border border-cyber-white/10 bg-cyber-navy px-2 py-1
                                text-[10px] text-cyber-white shadow-lg z-10 whitespace-nowrap">
                  {point.response}ms · {point.requests} req
                </div>

                {/* Bar */}
                <div
                  className="w-full rounded-t-sm bg-gradient-to-t from-cyber-cyan/20 to-cyber-cyan/60
                             transition-all duration-500 hover:from-cyber-cyan/40 hover:to-cyber-cyan/80
                             min-h-[4px]"
                  style={{ height: `${height}%` }}
                />

                {/* Label */}
                <span className="text-[9px] text-cyber-white/20 mt-1">
                  {point.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
