"use client";

import { DeploymentPlatform } from "@/types/deployment";
import { Rocket, Loader2 } from "lucide-react";

export function DeployButton({
  platform,
  isDeploying,
  onDeploy,
}: {
  platform: DeploymentPlatform;
  isDeploying: boolean;
  onDeploy: () => void;
}) {
  return (
    <div className="glass-card p-5 space-y-3 border-cyber-cyan/30">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-cyber-white/50">Build Target</span>
        <span className="font-bold text-cyber-cyan uppercase">{platform} Production</span>
      </div>

      <button
        onClick={onDeploy}
        disabled={isDeploying}
        className="neon-button flex items-center justify-center gap-2 w-full !py-3 text-xs uppercase font-bold tracking-wider disabled:opacity-50"
      >
        {isDeploying ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Building &amp; Deploying...</span>
          </>
        ) : (
          <>
            <Rocket className="h-4 w-4" />
            <span>Deploy to {platform.toUpperCase()}</span>
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-cyber-white/30 font-mono">
        Triggers container build, automated SSL, and healthcheck verification.
      </p>
    </div>
  );
}
