"use client";
import { useState } from "react";
import { DocEndpoint } from "@/types/docs";
import { Play, Send } from "lucide-react";

export function ApiPlayground({ endpoint }: { endpoint: DocEndpoint }) {
  const [response, setResponse] = useState<string | null>(null);

  const handleSend = () => {
    setResponse(JSON.stringify(endpoint.responses[0]?.example || { status: "ok" }, null, 2));
  };

  return (
    <div className="glass-card p-6 rounded-2xl border-white/10 bg-white/[0.02] space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-white font-sans text-sm">Interactive Sandbox</span>
        </div>
      </div>
      <div className="p-3 bg-black/80 rounded-xl text-white flex items-center justify-between">
        <span className="truncate mr-2">https://staticflow.onrender.com{endpoint.path}</span>
        <button
          onClick={handleSend}
          className="px-3 py-1 bg-cyan-400 text-black font-bold rounded flex items-center gap-1 shrink-0"
        >
          <Send className="h-3 w-3" /> Test
        </button>
      </div>
      {response && (
        <div className="p-4 bg-black/90 rounded-xl border border-white/10 space-y-1">
          <span className="text-green-400 font-bold">200 OK Response:</span>
          <pre className="text-white/80 overflow-auto">
            <code>{response}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
