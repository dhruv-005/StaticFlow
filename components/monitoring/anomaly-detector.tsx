"use client";

import { AlertOctagon } from "lucide-react";

export function AnomalyDetector() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-cyber-white/10 pb-3">
        <AlertOctagon className="h-4 w-4 text-cyber-red" />
        <h3 className="text-sm font-bold text-cyber-white font-mono">
          Anomaly Detection
        </h3>
      </div>
      <div className="flex flex-col items-center justify-center py-8 space-y-2">
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          ML-based anomaly detection is not yet configured.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          Requires a backend anomaly detection pipeline.
        </p>
      </div>
    </div>
  );
}
