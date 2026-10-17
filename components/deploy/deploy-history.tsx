"use client";

import { RollbackButton } from "./rollback-button";
import { ExternalLink, Clock, GitCommit } from "lucide-react";

export function DeployHistory() {
  const deployments = [
    {
      id: "dep_9941a",
      platform: "Vercel",
      commit: "feat: add stripe checkout webhook endpoint",
      status: "LIVE",
      url: "https://ecom-api.vercel.app",
      deployedAt: "10 minutes ago",
      duration: "34s",
      isCurrent: true,
    },
    {
      id: "dep_8820c",
      platform: "Vercel",
      commit: "refactor: optimize postgres sql query latency",
      status: "ROLLED_BACK",
      url: "https://ecom-api-prev.vercel.app",
      deployedAt: "3 hours ago",
      duration: "42s",
      isCurrent: false,
    },
    {
      id: "dep_7719b",
      platform: "Fly.io",
      commit: "initial: deploy scaffolded rest endpoints",
      status: "COMPLETED",
      url: "https://ecom-api.fly.dev",
      deployedAt: "1 day ago",
      duration: "58s",
      isCurrent: false,
    },
  ];

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-cyber-white">Deployment Timeline &amp; History</h3>
          <p className="text-xs text-cyber-white/40 font-mono">Inspect past revisions and perform zero-downtime rollbacks</p>
        </div>
      </div>

      <div className="space-y-3">
        {deployments.map((d) => (
          <div
            key={d.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-all ${
              d.isCurrent
                ? "border-cyber-green/30 bg-cyber-green/[0.02]"
                : "border-cyber-white/10 bg-cyber-space/80"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-cyber-cyan/10 border border-cyber-cyan/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyber-cyan uppercase">
                  {d.platform}
                </span>
                <h4 className="text-xs font-bold text-cyber-white">{d.commit}</h4>
                {d.isCurrent && (
                  <span className="rounded-full bg-cyber-green/20 border border-cyber-green/40 px-2 py-0.2 text-[9px] font-mono font-bold text-cyber-green">
                    CURRENT
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-cyber-white/40">
                <span className="flex items-center gap-1">
                  <GitCommit className="h-3 w-3 text-cyber-purple" /> {d.id}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {d.deployedAt} ({d.duration})
                </span>
                <a
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-cyber-cyan hover:underline"
                >
                  <span>{d.url}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            {!d.isCurrent && <RollbackButton deploymentId={d.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
