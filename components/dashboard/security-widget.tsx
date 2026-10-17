import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const vulnerabilities = [
  { name: "SQL Injection", count: 0, severity: "critical" },
  { name: "XSS Attacks", count: 0, severity: "high" },
  { name: "Auth Bypass", count: 0, severity: "critical" },
  { name: "Rate Limiting", count: 1, severity: "medium" },
  { name: "CORS Config", count: 0, severity: "low" },
  { name: "JWT Security", count: 0, severity: "high" },
];

const severityConfig: Record<string, { color: string; icon: typeof CheckCircle2 }> = {
  critical: { color: "text-cyber-red", icon: XCircle },
  high: { color: "text-cyber-pink", icon: XCircle },
  medium: { color: "text-cyber-yellow", icon: AlertTriangle },
  low: { color: "text-cyber-green", icon: CheckCircle2 },
};

export function SecurityWidget() {
  const totalIssues = vulnerabilities.reduce((sum, v) => sum + v.count, 0);

  return (
    <div className="glass-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 px-5 py-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyber-green" />
          <h2 className="font-bold text-cyber-white">Security</h2>
        </div>
        <Link
          href="/security"
          className="text-xs text-cyber-cyan hover:underline flex items-center gap-1"
        >
          Full Scan <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Score */}
      <div className="flex flex-col items-center py-6">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-cyber-green/30 bg-cyber-green/5">
          <div className="text-center">
            <p className="text-3xl font-black text-cyber-green">A+</p>
            <p className="text-[10px] text-cyber-green/60">95/100</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-cyber-white/40">
          Last scan: 2 hours ago
        </p>
      </div>

      {/* Vulnerability List */}
      <div className="px-5 pb-5 space-y-2">
        {vulnerabilities.map((vuln) => {
          const config = severityConfig[vuln.severity];
          const Icon = config.icon;
          return (
            <div
              key={vuln.name}
              className="flex items-center justify-between rounded-lg border border-cyber-white/5 bg-cyber-white/[0.01] px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`h-3.5 w-3.5 ${
                    vuln.count === 0 ? "text-cyber-green" : config.color
                  }`}
                />
                <span className="text-xs text-cyber-white/50">{vuln.name}</span>
              </div>
              <span
                className={`text-xs font-bold ${
                  vuln.count === 0 ? "text-cyber-green" : config.color
                }`}
              >
                {vuln.count === 0 ? "Pass" : `${vuln.count} found`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
