"use client";

import { GitPullRequest } from "lucide-react";

export function CodeReview() {
  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <GitPullRequest className="h-5 w-5 text-cyber-pink" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">
              Endpoint Change Reviews
            </h3>
            <p className="text-xs text-cyber-white/40 font-mono">
              Peer review generated API routes before production deploy
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-10 space-y-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyber-white/10 bg-cyber-white/5">
          <GitPullRequest className="h-6 w-6 text-cyber-white/20" />
        </div>
        <p className="text-xs text-cyber-white/30 font-mono text-center">
          No code reviews in progress.
        </p>
        <p className="text-[10px] text-cyber-white/20 font-mono text-center">
          Collaborative code review requires a team backend model.
        </p>
      </div>
    </div>
  );
}
