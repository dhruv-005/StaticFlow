"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-2.5 py-1 text-xs font-mono text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white transition-all",
        copied && "border-cyber-green/40 text-cyber-green bg-cyber-green/10",
        className
      )}
      title="Copy to clipboard"
    >
      {copied ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
      {label && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}
