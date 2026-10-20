"use client";

import { Terminal } from "lucide-react";

export function StreamingCode({ code, language = "typescript" }: { code: string; language?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-cyber-cyan/30 bg-cyber-space/95 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
      <div className="flex items-center justify-between border-b border-cyber-white/10 bg-cyber-white/[0.02] px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-cyber-cyan animate-pulse" />
          <span className="text-xs font-mono text-cyber-cyan">Live AI Generation Stream</span>
        </div>
        <span className="text-[10px] font-mono text-cyber-white/40 uppercase">{language}</span>
      </div>
      <pre className="max-h-[300px] overflow-auto p-4 font-mono text-xs text-cyber-white/90 no-scrollbar">
        <code>{code}</code>
      </pre>
    </div>
  );
}
