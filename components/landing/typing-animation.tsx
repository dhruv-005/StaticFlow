"use client";

import { useState, useEffect } from "react";

const prompts = [
  "Build an e-commerce API with auth and payments...",
  "Create a blog API with posts, comments, and likes...",
  "Generate a healthcare API with HIPAA compliance...",
  "Make a real-time chat API with WebSocket support...",
];

export function TypingAnimation() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPrompt = prompts[promptIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && charIndex < currentPrompt.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 50);
    } else if (!isDeleting && charIndex === currentPrompt.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 30);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setPromptIndex((p) => (p + 1) % prompts.length);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, promptIndex]);

  return (
    <div className="glass-card p-4 text-left scan-line">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="h-3 w-3 rounded-full bg-cyber-red/60" />
        <div className="h-3 w-3 rounded-full bg-cyber-yellow/60" />
        <div className="h-3 w-3 rounded-full bg-cyber-green/60" />
        <span className="ml-2 text-xs text-cyber-white/30 font-mono">
          staticflow-builder
        </span>
      </div>

      {/* Prompt Line */}
      <div className="flex items-start gap-2 font-mono text-sm">
        <span className="text-cyber-cyan shrink-0">$</span>
        <span className="text-cyber-white/80">
          {prompts[promptIndex].slice(0, charIndex)}
        </span>
        <span className="inline-block h-4 w-2 bg-cyber-cyan animate-pulse" />
      </div>

      {/* Fake Output (shows after typing completes) */}
      {!isDeleting && charIndex === prompts[promptIndex].length && (
        <div className="mt-3 space-y-1 font-mono text-xs animate-pulse">
          <p className="text-cyber-green/60">
            ✓ Generated 24 endpoints
          </p>
          <p className="text-cyber-green/60">
            ✓ Security scan passed (A+)
          </p>
          <p className="text-cyber-green/60">
            ✓ Deployed to production
          </p>
        </div>
      )}
    </div>
  );
}
