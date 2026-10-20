"use client";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

export function PromptInput() {
  const [text, setText] = useState("");
  return (
    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your API..."
        className="flex-1 bg-transparent text-xs text-white outline-none"
      />
      <button className="p-2 bg-cyan-400 text-black rounded-lg font-bold">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
