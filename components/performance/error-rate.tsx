"use client";

import { ShieldCheck, AlertCircle } from "lucide-react";

export function ErrorRate({ rate }: { rate: number }) {
  const isZero = rate === 0;

  return (
    <div className="glass-card p-4 space-y-2 border-cyber-green/20">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-cyber-white/40">
          Failed Requests
        </span>
        {isZero ? (
          <ShieldCheck className="h-4 w-4 text-cyber-green" />
        ) : (
          <AlertCircle className="h-4 w-4 text-cyber-red" />
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span
          className={`text-3xl font-black font-mono ${
            isZero ? "text-cyber-green" : "text-cyber-red"
          }`}
        >
          {rate.toFixed(2)}%
        </span>
        <span className="text-xs font-mono text-cyber-white/40">Error rate</span>
      </div>

      <div className="flex items-center justify-between border-t border-cyber-white/5 pt-2 text-[10px] font-mono text-cyber-white/50">
        <span>5xx Errors: 0</span>
        <span>4xx Errors: {isZero ? "0" : "Low"}</span>
        <span className={isZero ? "text-cyber-green" : "text-cyber-red"}>
          {isZero ? "100% Success" : "Degraded"}
        </span>
      </div>
    </div>
  );
}
