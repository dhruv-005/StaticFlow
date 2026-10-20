"use client";
import { Rocket, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
export function Toolbar() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-[#111133]/50">
      <span className="text-xs font-bold font-mono text-cyan-400">StaticFlow Workspace</span>
      <div className="flex items-center gap-2">
        <button onClick={() => router.push("/security")} className="flex items-center gap-1 rounded bg-green-500/10 border border-green-500/30 px-3 py-1.5 text-xs text-green-400"><Shield className="h-3.5 w-3.5" /> Scan</button>
        <button onClick={() => router.push("/deploy")} className="flex items-center gap-1 rounded bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-black"><Rocket className="h-3.5 w-3.5" /> Deploy</button>
      </div>
    </div>
  );
}