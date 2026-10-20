"use client";
import { Bot, Sparkles } from "lucide-react";
export function ChatPanel() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Bot className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white text-sm">StaticFlow AI Architect</h3>
      </div>
      <div className="flex-1 p-4 text-xs text-white/50 text-center flex flex-col items-center justify-center gap-2">
        <Sparkles className="h-8 w-8 text-cyan-400" />
        <p>Type your requirements to generate a complete API.</p>
      </div>
    </div>
  );
}