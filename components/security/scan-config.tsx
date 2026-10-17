"use client";

import { useState } from "react";
import { useSecurityScan } from "@/hooks/use-security-scan";
import { useProjectStore } from "@/stores/project-store";
import { ScanType } from "@/types/security";
import { Shield, Zap, Search, Eye, Loader2 } from "lucide-react";

const scanTypes: Array<{
  type: ScanType;
  label: string;
  description: string;
  duration: string;
  tests: number;
  icon: typeof Zap;
  color: string;
}> = [
  {
    type: "quick",
    label: "Quick Scan",
    description: "SQL injection, XSS, headers, CORS",
    duration: "2-5 min",
    tests: 200,
    icon: Zap,
    color: "text-cyber-green border-cyber-green/30 bg-cyber-green/5",
  },
  {
    type: "deep",
    label: "Deep Scan",
    description: "Full OWASP Top 10 + auth bypass + JWT",
    duration: "15-30 min",
    tests: 800,
    icon: Search,
    color: "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5",
  },
  {
    type: "full",
    label: "Full Audit",
    description: "Everything + DDoS + dependencies + compliance",
    duration: "1-2 hours",
    tests: 2000,
    icon: Eye,
    color: "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5",
  },
];

export function ScanConfig() {
  const { activeProject } = useProjectStore();
  const { isScanning, triggerScan } = useSecurityScan(activeProject?.id);
  const [selectedType, setSelectedType] = useState<ScanType>("quick");

  const handleStartScan = () => {
    triggerScan(selectedType);
  };

  return (
    <div className="glass-card space-y-5 p-5">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-cyber-cyan" />
        <h3 className="font-bold text-cyber-white">Scan Configuration</h3>
      </div>

      {/* Project Selector */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-cyber-white/50">
          Target Project
        </label>
        <div className="rounded-lg border border-cyber-white/10 bg-cyber-white/[0.03] px-3 py-2.5 text-sm text-cyber-white">
          {activeProject ? activeProject.name : "E-Commerce API (Demo)"}
        </div>
      </div>

      {/* Scan Type Selector */}
      <div>
        <label className="mb-2 block text-xs font-medium text-cyber-white/50">
          Scan Depth
        </label>
        <div className="space-y-2">
          {scanTypes.map((st) => (
            <button
              key={st.type}
              onClick={() => setSelectedType(st.type)}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                selectedType === st.type
                  ? st.color
                  : "border-cyber-white/5 bg-cyber-white/[0.01] text-cyber-white/40 hover:border-cyber-white/10"
              }`}
            >
              <st.icon className="h-5 w-5 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold">{st.label}</p>
                <p className="text-xs opacity-60">{st.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-mono opacity-60">{st.duration}</p>
                <p className="text-[10px] opacity-40">{st.tests} tests</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStartScan}
        disabled={isScanning}
        className="neon-button flex w-full items-center justify-center gap-2 text-sm disabled:opacity-50"
      >
        {isScanning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            Start {scanTypes.find((s) => s.type === selectedType)?.label}
          </>
        )}
      </button>
    </div>
  );
}
