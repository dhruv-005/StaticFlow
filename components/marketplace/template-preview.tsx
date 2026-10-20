"use client";

import { ApiTemplate } from "@/types/marketplace";
import { Terminal, Code2, ListTree, Database } from "lucide-react";

export function TemplatePreview({ template }: { template: ApiTemplate }) {
  const sampleEndpoints = [
    { method: "POST", path: "/api/v1/auth/register", desc: "User registration with hashed credentials" },
    { method: "POST", path: "/api/v1/auth/login", desc: "Issue JWT and rotating refresh tokens" },
    { method: "GET", path: "/api/v1/resources", desc: "List paginated resources with full text search" },
    { method: "POST", path: "/api/v1/resources", desc: "Create resource with Zod schema validation" },
    { method: "POST", path: "/api/v1/webhooks/incoming", desc: "HMAC verified ingestion webhook" },
  ];

  const methodColors: Record<string, string> = {
    GET: "text-cyber-green bg-cyber-green/10 border-cyber-green/30",
    POST: "text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30",
    PUT: "text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30",
    DELETE: "text-cyber-red bg-cyber-red/10 border-cyber-red/30",
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Left 6 Cols: Endpoints Manifest */}
      <div className="glass-card p-5 space-y-4 lg:col-span-6">
        <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ListTree className="h-4 w-4 text-cyber-cyan" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono">
              Packaged API Routes
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyber-white/40">5 Endpoints</span>
        </div>

        <div className="space-y-2">
          {sampleEndpoints.map((ep, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border border-cyber-white/5 bg-cyber-space/80 p-3 font-mono text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className={`rounded border px-1.5 py-0.5 text-[10px] font-bold ${methodColors[ep.method]}`}>
                  {ep.method}
                </span>
                <span className="text-cyber-white font-bold">{ep.path}</span>
              </div>
              <span className="text-[11px] text-cyber-white/40 hidden sm:inline">{ep.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right 6 Cols: Prompt Definition */}
      <div className="glass-card p-5 space-y-4 lg:col-span-6">
        <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyber-purple" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono">
              Generation Prompt Specification
            </h3>
          </div>
          <span className="text-[10px] font-mono text-cyber-purple">AI Blueprint</span>
        </div>

        <div className="rounded-xl border border-cyber-white/10 bg-black/80 p-4 font-mono text-xs text-cyber-white/80 leading-relaxed">
          <span className="text-cyber-cyan">&gt; AI System Prompt Directive:</span>
          <p className="mt-2 text-cyber-white/70 italic">&ldquo;{template.promptTemplate}&rdquo;</p>
        </div>

        <p className="text-[11px] text-cyber-white/40 leading-relaxed font-mono">
          When cloned, StaticFlow will spin up a fresh isolated workspace with all corresponding route controllers, middleware, and Prisma migrations ready.
        </p>
      </div>
    </div>
  );
}
