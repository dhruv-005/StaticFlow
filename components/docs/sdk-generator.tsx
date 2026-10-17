"use client";
import { Download, Code2 } from "lucide-react";

export function SdkGenerator() {
  return (
    <div className="glass-card p-6 border-white/10 rounded-2xl bg-white/[0.02] space-y-4">
      <h3 className="font-bold text-white text-base">Client SDK Packages</h3>
      <div className="grid sm:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-2">
          <span className="text-cyan-400 font-bold">TypeScript / Node.js</span>
          <p className="text-white/50">npm install @staticflow/sdk</p>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-black/60 space-y-2">
          <span className="text-purple-400 font-bold">Python</span>
          <p className="text-white/50">pip install staticflow-sdk</p>
        </div>
      </div>
    </div>
  );
}
