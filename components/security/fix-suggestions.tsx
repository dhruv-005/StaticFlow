"use client";

import { useState } from "react";
import { Wrench, Zap, CheckCircle2, Loader2 } from "lucide-react";

export function FixSuggestions({ count }: { count: number }) {
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApplyAll = async () => {
    setApplying(true);
    // Simulate applying fixes
    await new Promise((r) => setTimeout(r, 2000));
    setApplying(false);
    setApplied(true);
  };

  if (applied) {
    return (
      <div className="glass-card flex items-center gap-3 border-cyber-green/20 p-4">
        <CheckCircle2 className="h-5 w-5 text-cyber-green" />
        <div>
          <p className="text-sm font-bold text-cyber-green">
            All {count} auto-fixes applied successfully!
          </p>
          <p className="text-xs text-cyber-white/40">
            Your code has been updated. Re-scan to verify.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex items-center justify-between border-cyber-cyan/20 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/30">
          <Wrench className="h-5 w-5 text-cyber-cyan" />
        </div>
        <div>
          <p className="text-sm font-bold text-cyber-white">
            {count} Auto-Fixes Available
          </p>
          <p className="text-xs text-cyber-white/40">
            AI has generated code patches for {count} vulnerabilities. Apply them with one click.
          </p>
        </div>
      </div>

      <button
        onClick={handleApplyAll}
        disabled={applying}
        className="neon-button flex items-center gap-2 !px-4 !py-2 text-xs disabled:opacity-50"
      >
        {applying ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Applying...
          </>
        ) : (
          <>
            <Zap className="h-3.5 w-3.5" />
            Apply All Fixes
          </>
        )}
      </button>
    </div>
  );
}
