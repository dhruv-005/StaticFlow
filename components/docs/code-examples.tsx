"use client";
import { DocEndpoint } from "@/types/docs";

export function CodeExamples({ endpoint }: { endpoint: DocEndpoint }) {
  return (
    <div className="glass-card p-4 rounded-xl border-white/10 bg-black/80 font-mono text-xs text-white/80">
      <p className="text-cyan-400 font-bold mb-2">cURL Example:</p>
      <code>curl -X {endpoint.method} "https://staticflow.onrender.com{endpoint.path}"</code>
    </div>
  );
}
