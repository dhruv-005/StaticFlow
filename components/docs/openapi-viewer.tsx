"use client";
import { DocEndpoint } from "@/types/docs";
import { FileText } from "lucide-react";

export function OpenapiViewer({ endpoints }: { endpoints: DocEndpoint[] }) {
  const spec = {
    openapi: "3.1.0",
    info: { title: "StaticFlow Generated API", version: "1.0.0" },
    paths: (endpoints || []).reduce((acc: any, ep) => {
      acc[ep.path] = { [ep.method.toLowerCase()]: { summary: ep.summary } };
      return acc;
    }, {}),
  };
  return (
    <div className="glass-card p-6 border-white/10 rounded-2xl bg-black/80 font-mono text-xs space-y-3">
      <div className="flex items-center gap-2 text-cyan-400 border-b border-white/10 pb-3">
        <FileText className="h-4 w-4" />
        <span className="font-bold">OpenAPI 3.1.0 JSON Spec</span>
      </div>
      <pre className="text-white/70 overflow-auto max-h-[500px]">
        <code>{JSON.stringify(spec, null, 2)}</code>
      </pre>
    </div>
  );
}
