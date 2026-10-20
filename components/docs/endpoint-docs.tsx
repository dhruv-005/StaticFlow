"use client";
import { DocEndpoint } from "@/types/docs";
import { Globe, Lock } from "lucide-react";

export function EndpointDocs({ endpoint }: { endpoint: DocEndpoint }) {
  return (
    <div className="space-y-4 font-mono text-xs">
      <div className="glass-card p-6 border-cyan-500/20 rounded-2xl bg-white/[0.02] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/30">
              {endpoint.method}
            </span>
            <span className="text-white font-bold">{endpoint.path}</span>
          </div>
          {endpoint.authRequired ? (
            <span className="flex items-center gap-1 text-[10px] text-purple-400">
              <Lock className="h-3 w-3" /> Auth Required
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] text-green-400">
              <Globe className="h-3 w-3" /> Public
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-white font-sans">{endpoint.summary}</h3>
        <p className="text-xs text-white/60 font-sans">{endpoint.description}</p>
      </div>

      {endpoint.requestBody && (
        <div className="glass-card p-4 rounded-xl border-white/10 bg-black/80 space-y-2">
          <span className="text-white/40 uppercase">Request Body:</span>
          <pre className="text-cyan-400 overflow-auto">
            <code>{JSON.stringify(endpoint.requestBody.example, null, 2)}</code>
          </pre>
        </div>
      )}

      {endpoint.responses && endpoint.responses.length > 0 && (
        <div className="glass-card p-4 rounded-xl border-white/10 bg-black/80 space-y-2">
          <span className="text-green-400 uppercase font-bold">
            Response ({endpoint.responses[0].status}):
          </span>
          <pre className="text-white/80 overflow-auto">
            <code>{JSON.stringify(endpoint.responses[0].example, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
