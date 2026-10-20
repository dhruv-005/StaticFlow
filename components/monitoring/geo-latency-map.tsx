"use client";

import { Globe, Radio, ShieldCheck } from "lucide-react";

const edgeLocations = [
  { region: "US East (N. Virginia)", code: "iad", latency: 14, status: "healthy", traffic: "38%" },
  { region: "US West (Oregon)", code: "pdx", latency: 28, status: "healthy", traffic: "22%" },
  { region: "EU Central (Frankfurt)", code: "fra", latency: 32, status: "healthy", traffic: "18%" },
  { region: "Asia East (Tokyo)", code: "hnd", latency: 45, status: "healthy", traffic: "12%" },
  { region: "Asia South (Singapore)", code: "sin", latency: 52, status: "healthy", traffic: "6%" },
  { region: "SA East (São Paulo)", code: "gru", latency: 68, status: "healthy", traffic: "4%" },
];

export function GeoLatencyMap() {
  return (
    <div className="glass-card p-6 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Globe className="h-5 w-5 text-cyber-cyan" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Worldwide Edge Cluster Latency</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Anycast Routing &amp; Distributed Edge Endpoints</p>
          </div>
        </div>
        <span className="flex items-center gap-1 text-xs font-mono text-cyber-green">
          <Radio className="h-3.5 w-3.5 animate-pulse" /> 6/6 PoPs Operational
        </span>
      </div>

      {/* Grid of Global PoPs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {edgeLocations.map((loc) => (
          <div
            key={loc.code}
            className="rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 space-y-3 hover:border-cyber-cyan/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyber-cyan/10 border border-cyber-cyan/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyber-cyan uppercase">
                  {loc.code}
                </span>
                <p className="text-xs font-bold text-cyber-white">{loc.region}</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-cyber-green animate-pulse" />
            </div>

            <div className="flex items-baseline justify-between border-t border-cyber-white/5 pt-2">
              <div>
                <p className="text-[10px] text-cyber-white/40 font-mono">Round-Trip Latency</p>
                <p className="text-xl font-black font-mono text-cyber-cyan">{loc.latency} ms</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-cyber-white/40 font-mono">Traffic Share</p>
                <p className="text-sm font-bold font-mono text-cyber-white">{loc.traffic}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
