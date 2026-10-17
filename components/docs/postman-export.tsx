"use client";
import { DocEndpoint } from "@/types/docs";
import { Download } from "lucide-react";

export function PostmanExport({ endpoints }: { endpoints: DocEndpoint[] }) {
  const handleExport = () => {
    const coll = { info: { name: "StaticFlow Collection" }, item: (endpoints || []).map(e => ({ name: e.summary, request: { method: e.method, url: e.path } })) };
    const blob = new Blob([JSON.stringify(coll, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staticflow-postman.json";
    a.click();
  };
  return (
    <button onClick={handleExport} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white hover:bg-white/10 font-mono">
      <Download className="h-3.5 w-3.5 text-cyan-400" /> Export Postman
    </button>
  );
}
