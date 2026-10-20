"use client";

import Link from "next/link";
import { usePerformanceStore } from "@/stores/performance-store";
import { Gauge, Clock, Users, ArrowRight, Zap } from "lucide-react";

export function TestHistory() {
  const { tests } = usePerformanceStore();

  if (tests.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
        <Gauge className="mb-3 h-10 w-10 text-cyber-white/20" />
        <h3 className="text-lg font-bold text-cyber-white/40">No Performance Runs</h3>
        <p className="mt-1 text-sm text-cyber-white/25">
          Execute your first load or stress test to track performance benchmarks over time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-white">
        Benchmark History ({tests.length})
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tests.map((t) => (
          <Link
            key={t.id}
            href={`/performance/${t.id}`}
            className="glass-card group p-5 transition-all hover:scale-[1.02] hover:border-cyber-purple/30"
          >
            <div className="flex items-center justify-between border-b border-cyber-white/5 pb-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase text-cyber-purple font-mono">
                <Zap className="h-3.5 w-3.5" />
                {t.testType} Test
              </span>
              <ArrowRight className="h-4 w-4 text-cyber-white/20 group-hover:text-cyber-cyan transition-colors" />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <p className="text-cyber-white/40">Avg Latency</p>
                <p className="text-base font-bold text-cyber-cyan">
                  {t.avgResponseMs}ms
                </p>
              </div>
              <div>
                <p className="text-cyber-white/40">Throughput</p>
                <p className="text-base font-bold text-cyber-purple">
                  {t.throughputReqSec} r/s
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-cyber-white/5 pt-2 text-[10px] font-mono text-cyber-white/30">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> {t.maxUsers} Users
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {t.completedAt
                  ? new Date(t.completedAt).toLocaleDateString()
                  : "Recent"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
