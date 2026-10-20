"use client";

import { SecurityScan } from "@/types/security";
import { SecurityScore } from "./security-score";
import { VulnerabilityCard } from "./vulnerability-card";
import { OWASPChart } from "./owasp-chart";
import { FixSuggestions } from "./fix-suggestions";
import { ReportExport } from "./report-export";
import { Shield, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export function ScanResults({ scan }: { scan: SecurityScan }) {
  const criticalCount = scan.vulnerabilities.filter((v) => v.severity === "critical").length;
  const highCount = scan.vulnerabilities.filter((v) => v.severity === "high").length;
  const mediumCount = scan.vulnerabilities.filter((v) => v.severity === "medium").length;
  const lowCount = scan.vulnerabilities.filter((v) => v.severity === "low").length;
  const infoCount = scan.vulnerabilities.filter((v) => v.severity === "info").length;
  const autoFixable = scan.vulnerabilities.filter((v) => v.autoFixable).length;

  const gradeColor =
    scan.grade.startsWith("A")
      ? "text-cyber-green"
      : scan.grade.startsWith("B")
        ? "text-green-400"
        : scan.grade === "C"
          ? "text-cyber-yellow"
          : "text-cyber-red";

  return (
    <div className="space-y-6">
      {/* Score Overview Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card flex flex-col items-center justify-center p-6">
          <SecurityScore score={scan.score} grade={scan.grade} />
        </div>

        <div className="glass-card p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyber-white/40">
            Severity Breakdown
          </h4>
          <div className="space-y-2">
            {[
              { label: "Critical", count: criticalCount, color: "text-cyber-red", bg: "bg-cyber-red" },
              { label: "High", count: highCount, color: "text-cyber-pink", bg: "bg-cyber-pink" },
              { label: "Medium", count: mediumCount, color: "text-cyber-yellow", bg: "bg-cyber-yellow" },
              { label: "Low", count: lowCount, color: "text-cyber-green", bg: "bg-cyber-green" },
              { label: "Info", count: infoCount, color: "text-cyber-white/40", bg: "bg-cyber-white/30" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${item.bg}`} />
                  <span className="text-xs text-cyber-white/60">{item.label}</span>
                </div>
                <span className={`text-sm font-bold ${item.color}`}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyber-white/40">
            Scan Summary
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyber-white/50">Scan Type</span>
              <span className="text-xs font-bold text-cyber-cyan uppercase">{scan.scanType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyber-white/50">Status</span>
              <span className="flex items-center gap-1 text-xs font-bold text-cyber-green">
                <CheckCircle2 className="h-3 w-3" /> {scan.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyber-white/50">Auto-Fixable</span>
              <span className="text-xs font-bold text-cyber-cyan">{autoFixable} issues</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyber-white/50">Completed</span>
              <span className="text-xs text-cyber-white/40">
                {scan.completedAt
                  ? new Date(scan.completedAt).toLocaleString()
                  : "In progress"}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <OWASPChart vulnerabilities={scan.vulnerabilities} />
        </div>
      </div>

      {/* Auto-Fix Banner */}
      {autoFixable > 0 && <FixSuggestions count={autoFixable} />}

      {/* Vulnerability List */}
      <div className="glass-card">
        <div className="flex items-center justify-between border-b border-cyber-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-cyber-yellow" />
            <h3 className="font-bold text-cyber-white">
              Vulnerabilities ({scan.vulnerabilities.length})
            </h3>
          </div>
          <ReportExport scan={scan} />
        </div>

        {scan.vulnerabilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="mb-3 h-12 w-12 text-cyber-green" />
            <h4 className="text-lg font-bold text-cyber-green">All Clear!</h4>
            <p className="mt-1 text-sm text-cyber-white/40">
              No vulnerabilities detected. Your API passed all {scan.scanType} scan tests.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-cyber-white/5">
            {scan.vulnerabilities.map((vuln) => (
              <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
