"use client";
import { useBuilderStore } from "@/stores/builder-store";
import { FileCode } from "lucide-react";
export function TabBar() {
  const { files = {}, activeFile, setActiveFile } = useBuilderStore();
  return (
    <div className="flex items-center gap-1 overflow-x-auto max-w-[60%]">
      {Object.keys(files || {}).map((path) => (
        <button key={path} onClick={() => setActiveFile(path)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t-md ${activeFile === path ? "bg-[#0d0d1a] text-cyan-400 border-b-2 border-cyan-400 font-bold" : "text-white/40"}`}>
          <FileCode className="h-3 w-3" />
          <span className="truncate max-w-[120px]">{(files[path] || {}).name}</span>
        </button>
      ))}
    </div>
  );
}