"use client";
import { useBuilderStore } from "@/stores/builder-store";
import { FileCode, Plus } from "lucide-react";
export function FileTree() {
  const { files = {}, activeFile, setActiveFile, setFiles } = useBuilderStore();
  return (
    <div className="w-48 border-r border-white/10 p-2 space-y-1 bg-[#0A0A1A]">
      <span className="text-[10px] font-bold uppercase text-white/40 px-2">Files</span>
      {Object.values(files || {}).map((f: any) => (
        <button key={f.path} onClick={() => setActiveFile(f.path)} className={`flex items-center gap-2 w-full p-1.5 text-xs font-mono rounded ${activeFile === f.path ? "bg-cyan-500/10 text-cyan-400 font-bold" : "text-white/60 hover:bg-white/5"}`}>
          <FileCode className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{f.name}</span>
        </button>
      ))}
    </div>
  );
}