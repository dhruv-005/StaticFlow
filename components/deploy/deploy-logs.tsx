"use client";

import { useRef, useEffect, useState } from "react";
import { useDeployStore } from "@/stores/deploy-store";
import { Terminal, Copy, Check, Trash2, Radio } from "lucide-react";

export function DeployLogs() {
  const { deployLogs, isDeploying, clearLogs } = useDeployStore();
  const [copied, setCopied] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const defaultLogs = [
    `[${new Date().toISOString()}] StaticFlow Orchestrator v1.0.0 initializing...`,
    `[${new Date().toISOString()}] Reading project manifest and dependency trees...`,
    `[${new Date().toISOString()}] Ready to compile microservice containers.`,
  ];

  const logsToRender = deployLogs.length > 0 ? deployLogs : defaultLogs;

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [deployLogs]);

  const copyLogs = () => {
    navigator.clipboard.writeText(logsToRender.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card flex flex-col h-[520px] overflow-hidden">
      <div className="flex items-center justify-between border-b border-cyber-white/10 bg-cyber-navy/90 p-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyber-cyan" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyber-white font-mono">
            Pipeline Build &amp; Deploy Console
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {isDeploying && (
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-cyber-green animate-pulse">
              <Radio className="h-3 w-3" /> Live Pipeline
            </span>
          )}

          <button
            onClick={copyLogs}
            className="flex items-center gap-1 rounded border border-cyber-white/10 bg-cyber-white/5 px-2 py-0.5 text-[10px] text-cyber-white/60 hover:text-cyber-white font-mono"
          >
            {copied ? <Check className="h-3 w-3 text-cyber-green" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={clearLogs}
            className="rounded p-1 text-cyber-white/30 hover:bg-cyber-white/5 hover:text-cyber-white"
            title="Clear Console"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 bg-black/90 no-scrollbar text-cyber-white/80">
        {logsToRender.map((log, index) => {
          const isError = log.toLowerCase().includes("error") || log.toLowerCase().includes("failed");
          const isSuccess = log.toLowerCase().includes("successful") || log.toLowerCase().includes("complete");

          return (
            <div
              key={index}
              className={`leading-relaxed ${
                isError ? "text-cyber-red" : isSuccess ? "text-cyber-green font-bold" : "text-cyber-white/70"
              }`}
            >
              {log}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
