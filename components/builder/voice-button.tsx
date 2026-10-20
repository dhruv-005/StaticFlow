"use client";

import { useVoice } from "@/hooks/use-voice";
import { Mic, MicOff } from "lucide-react";

export function VoiceButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const { isListening, isSupported, toggleListening } = useVoice(onTranscript);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-mono transition-all ${
        isListening
          ? "bg-cyber-red/20 text-cyber-red border border-cyber-red/40 animate-pulse"
          : "text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white"
      }`}
      title={isListening ? "Listening... Click to stop" : "Voice to Prompt"}
    >
      {isListening ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
      <span>{isListening ? "Listening..." : "Voice"}</span>
    </button>
  );
}
