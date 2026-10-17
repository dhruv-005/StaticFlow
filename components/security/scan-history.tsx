"use client";

import Link from "next/link";
import { useSecurityStore } from "@/stores/security-store";
import { SecurityScore } from "./security-score";
import { Shield, Clock, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export function ScanHistory() {
  const { scans } = useSecurityStore();

  if (scans.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
        <Shield className="mb-3 h-10 w-10 text-cyber-white/20" />
        <h3 className="text-lg font-bold text-cyber-white/40">No Scan History</h3>
        <p className="mt-1 text-sm text-cyber-white/25">
          Run your first security scan to see results here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-cyber-white">
        Scan History ({scans.length})
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scans.map((scan) => {
          const vulnCount = scan.vulnerabilities.length;
          const isClean = vulnCount === 0;

          return (
            <Link
              key={scan.id}
              href={`/security/${scan.id}`}
              className="glass-card group p-5 transition-all hover:scale-[1.02] hover:border-cyber-cyan/20"
            >
              <div className="flex items-start justify-between">
                <SecurityScore score={scan.score} grade={scan.grade} />
                <ArrowRight className="h-4 w-4 text-cyber-white/20 group-hover:text-cyber-cyan transition-colors" />
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyber-white/40">Type</span>
                  <span className="text-xs font-bold text-cyber-cyan uppercase">
                    {scan.scanType}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyber-white/40">Vulnerabilities</span>
                  <span className={`flex items-center gap-1 text-xs font-bold ${isClean ? "text-cyber-green" : "text-cyber-yellow"}`}>
                    {isClean ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : (
                      <AlertTriangle className="h-3 w-3" />
                    )}
                    {vulnCount} found
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-cyber-white/40">Date</span>
                  <span className="flex items-center gap-1 text-xs text-cyber-white/30">
                    <Clock className="h-3 w-3" />
                    {scan.completedAt
                      ? new Date(scan.completedAt).toLocaleDateString()
                      : "In progress"}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
