"use client";

import { useState } from "react";
import { usePerformanceTest } from "@/hooks/use-performance-test";
import { useProjectStore } from "@/stores/project-store";
import { PerformanceTestType } from "@/types/performance";
import { Gauge, Users, Clock, Flame, Zap, ShieldAlert, Waves, Loader2 } from "lucide-react";

const testProfiles: Array<{
  type: PerformanceTestType;
  label: string;
  description: string;
  icon: typeof Zap;
  color: string;
  defaultUsers: number;
  defaultDuration: number;
}> = [
  {
    type: "load",
    label: "Load Test",
    description: "Standard simulated concurrent user traffic",
    icon: Users,
    color: "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5",
    defaultUsers: 100,
    defaultDuration: 30,
  },
  {
    type: "stress",
    label: "Stress Test",
    description: "Scale load beyond threshold to find system breaking point",
    icon: Flame,
    color: "text-cyber-red border-cyber-red/30 bg-cyber-red/5",
    defaultUsers: 500,
    defaultDuration: 60,
  },
  {
    type: "spike",
    label: "Spike Test",
    description: "Sudden explosive surge of requests in short bursts",
    icon: Zap,
    color: "text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/5",
    defaultUsers: 1000,
    defaultDuration: 15,
  },
  {
    type: "soak",
    label: "Soak Test",
    description: "Extended continuous traffic to detect memory leaks",
    icon: Waves,
    color: "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5",
    defaultUsers: 250,
    defaultDuration: 120,
  },
];

export function TestConfig() {
  const { activeProject } = useProjectStore();
  const { isRunningTest, startTest } = usePerformanceTest(activeProject?.id);

  const [selectedType, setSelectedType] = useState<PerformanceTestType>("load");
  const [users, setUsers] = useState<number>(100);
  const [duration, setDuration] = useState<number>(30);

  const handleProfileSelect = (profile: typeof testProfiles[0]) => {
    setSelectedType(profile.type);
    setUsers(profile.defaultUsers);
    setDuration(profile.defaultDuration);
  };

  const handleRun = () => {
    startTest(selectedType);
  };

  return (
    <div className="glass-card space-y-5 p-5">
      {/* Card Header */}
      <div className="flex items-center gap-2">
        <Gauge className="h-5 w-5 text-cyber-purple" />
        <h3 className="font-bold text-cyber-white">Benchmark Profile</h3>
      </div>

      {/* Target Project Meta */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-cyber-white/50">
          Target System
        </label>
        <div className="flex items-center justify-between rounded-lg border border-cyber-white/10 bg-cyber-white/[0.03] px-3 py-2 text-xs font-mono text-cyber-white">
          <span>{activeProject?.name || "E-Commerce API (Virtual Engine)"}</span>
          <span className="text-cyber-green">ONLINE</span>
        </div>
      </div>

      {/* Profile Selector */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-cyber-white/50">
          Simulation Type
        </label>
        <div className="grid grid-cols-1 gap-2">
          {testProfiles.map((p) => (
            <button
              key={p.type}
              onClick={() => handleProfileSelect(p)}
              className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                selectedType === p.type
                  ? p.color
                  : "border-cyber-white/5 bg-cyber-white/[0.01] text-cyber-white/40 hover:border-cyber-white/10"
              }`}
            >
              <p.icon className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-cyber-white">{p.label}</p>
                <p className="text-[11px] opacity-60 leading-tight">{p.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sliders: Users & Duration */}
      <div className="space-y-4 pt-2 border-t border-cyber-white/5">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-cyber-white/50">Virtual Users (VU)</span>
            <span className="font-bold text-cyber-cyan">{users}</span>
          </div>
          <input
            type="range"
            min="10"
            max="2000"
            step="10"
            value={users}
            onChange={(e) => setUsers(Number(e.target.value))}
            className="w-full accent-cyber-cyan cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-cyber-white/50">Duration (Seconds)</span>
            <span className="font-bold text-cyber-purple">{duration}s</span>
          </div>
          <input
            type="range"
            min="10"
            max="300"
            step="5"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-cyber-purple cursor-pointer"
          />
        </div>
      </div>

      {/* Trigger Button */}
      <button
        onClick={handleRun}
        disabled={isRunningTest}
        className="neon-button flex w-full items-center justify-center gap-2 text-xs uppercase font-bold tracking-wider disabled:opacity-50"
      >
        {isRunningTest ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Executing Benchmark...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Start Performance Test
          </>
        )}
      </button>
    </div>
  );
}
