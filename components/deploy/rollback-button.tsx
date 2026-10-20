"use client";

import { useState } from "react";
import { RotateCcw, Loader2, Check } from "lucide-react";

export function RollbackButton({ deploymentId: _deploymentId }: { deploymentId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleRollback = async () => {
    if (!confirm("Are you sure you want to rollback to this build?")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setDone(true);
    setTimeout(() => setDone(false), 3000);
  };

  return (
    <button
      onClick={handleRollback}
      disabled={loading || done}
      className="flex items-center gap-1.5 rounded-lg border border-cyber-red/30 bg-cyber-red/10 px-3 py-1.5 text-xs font-semibold text-cyber-red hover:bg-cyber-red/20 transition-all disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : done ? (
        <Check className="h-3.5 w-3.5 text-cyber-green" />
      ) : (
        <RotateCcw className="h-3.5 w-3.5" />
      )}
      <span>{done ? "Restored" : "Rollback to this"}</span>
    </button>
  );
}
