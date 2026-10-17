"use client";

import { DeploymentPlatform } from "@/types/deployment";
import { CheckCircle2, Server } from "lucide-react";

interface PlatformOption {
  id: DeploymentPlatform;
  name: string;
  category: "Serverless" | "Containers" | "Enterprise Cloud";
  description: string;
  freeTier: boolean;
  color: string;
}

const platforms: PlatformOption[] = [
  {
    id: "vercel",
    name: "Vercel Edge",
    category: "Serverless",
    description: "Global low-latency edge deployment with zero configuration.",
    freeTier: true,
    color: "text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5",
  },
  {
    id: "render",
    name: "Render Web Service",
    category: "Containers",
    description: "Auto-scaling web service with persistent DB attachments.",
    freeTier: true,
    color: "text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5",
  },
  {
    id: "flyio",
    name: "Fly.io MicroVM",
    category: "Containers",
    description: "Run Docker instances close to your users in global regions.",
    freeTier: true,
    color: "text-cyber-green border-cyber-green/30 bg-cyber-green/5",
  },
  {
    id: "railway",
    name: "Railway App",
    category: "Containers",
    description: "Instant infrastructure with automated database provisioning.",
    freeTier: false,
    color: "text-cyber-pink border-cyber-pink/30 bg-cyber-pink/5",
  },
  {
    id: "aws",
    name: "AWS ECS & Fargate",
    category: "Enterprise Cloud",
    description: "Multi-region cluster orchestration with IAM role security.",
    freeTier: false,
    color: "text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/5",
  },
];

export function PlatformSelector({
  selected,
  onSelect,
}: {
  selected: DeploymentPlatform;
  onSelect: (p: DeploymentPlatform) => void;
}) {
  return (
    <div className="glass-card p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono flex items-center gap-2">
          <Server className="h-4 w-4 text-cyber-cyan" />
          Select Target Cloud
        </h3>
        <span className="text-[10px] font-mono text-cyber-white/40">Multi-Cloud Ready</span>
      </div>

      <div className="space-y-2">
        {platforms.map((p) => {
          const isSelected = selected === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`flex w-full items-start justify-between rounded-xl border p-3 text-left transition-all ${
                isSelected
                  ? p.color
                  : "border-cyber-white/5 bg-cyber-white/[0.02] text-cyber-white/50 hover:border-cyber-white/10"
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-cyber-white">{p.name}</span>
                  {p.freeTier && (
                    <span className="rounded bg-cyber-green/10 border border-cyber-green/30 px-1.5 py-0.2 text-[9px] font-mono font-bold text-cyber-green">
                      FREE TIER
                    </span>
                  )}
                </div>
                <p className="text-[11px] opacity-70 leading-tight">{p.description}</p>
              </div>

              {isSelected && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-cyber-cyan mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
