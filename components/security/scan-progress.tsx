"use client";

import { useSecurityStore } from "@/stores/security-store";
import { Progress } from "@/components/ui/progress";
import { Shield, Loader2, CheckCircle2 } from "lucide-react";

const scanPhases = [
  { label: "Reconnaissance", desc: "Discovering endpoints & technologies" },
  { label: "Injection Testing", desc: "SQL, NoSQL, XSS, SSTI payloads" },
  { label: "Authentication", desc: "JWT, OAuth, brute force checks" },
  { label: "Authorization", desc: "BOLA, BFLA, privilege escalation" },
  { label: "Configuration", desc: "Headers, CORS, SSL, dependencies" },
];

export function ScanProgress() {
  const { scanProgress } = useSecurityStore();

  const currentPhaseIndex = Math.min(
    Math.floor(scanProgress / 20),
    scanPhases.length - 1
  );

  return (
    <div className="glass-card overflow-hidden border-cyber-cyan/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
            <Shield className="h-4 w-4 text-cyber-cyan animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-cyber-white">Security Scan in Progress</h3>
            <p className="text-xs text-cyber-cyan/60 font-mono">
              Phase {currentPhaseIndex + 1}/{scanPhases.length}: {scanPhases[currentPhaseIndex].label}
            </p>
          </div>
        </div>
        <span className="text-2xl font-black neon-text font-mono">{scanProgress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-3">
        <Progress
          value={scanProgress}
          className="h-2"
          indicatorClassName="bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink"
        />
      </div>

      {/* Phase List */}
      <div className="grid grid-cols-5 gap-2 px-6 pb-4">
        {scanPhases.map((phase, i) => {
          const isComplete = i < currentPhaseIndex;
          const isActive = i === currentPhaseIndex;

          return (
            <div
              key={phase.label}
              className={`flex flex-col items-center gap-1 rounded-lg p-2 text-center transition-all ${
                isComplete
                  ? "bg-cyber-green/5 border border-cyber-green/20"
                  : isActive
                    ? "bg-cyber-cyan/5 border border-cyber-cyan/20"
                    : "bg-cyber-white/[0.01] border border-cyber-white/5"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="h-4 w-4 text-cyber-green" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-cyber-cyan animate-spin" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-cyber-white/10" />
              )}
              <span
                className={`text-[10px] font-semibold ${
                  isComplete
                    ? "text-cyber-green"
                    : isActive
                      ? "text-cyber-cyan"
                      : "text-cyber-white/20"
                }`}
              >
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
