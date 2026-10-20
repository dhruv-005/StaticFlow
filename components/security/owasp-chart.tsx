"use client";

import { SecurityVulnerability } from "@/types/security";
import { Shield } from "lucide-react";

const OWASP_CATEGORIES = [
  { id: "A01", name: "Access Control", color: "#FF3366" },
  { id: "A02", name: "Crypto Failures", color: "#FF2D7B" },
  { id: "A03", name: "Injection", color: "#FFD700" },
  { id: "A05", name: "Misconfig", color: "#7B2FFF" },
  { id: "A07", name: "Auth Failures", color: "#00AAFF" },
  { id: "A10", name: "SSRF", color: "#00FF88" },
];

export function OWASPChart({
  vulnerabilities,
}: {
  vulnerabilities: SecurityVulnerability[];
}) {
  const categoryCounts = OWASP_CATEGORIES.map((cat) => ({
    ...cat,
    count: vulnerabilities.filter((v) => v.category.includes(cat.id)).length,
  }));

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  return (
    <div>
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-cyber-white/40 flex items-center gap-1.5">
        <Shield className="h-3.5 w-3.5" />
        OWASP Coverage
      </h4>
      <div className="space-y-2">
        {categoryCounts.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <span className="w-16 text-[10px] font-mono text-cyber-white/40 truncate">
              {cat.name}
            </span>
            <div className="flex-1 h-3 rounded-full bg-cyber-white/5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.max((cat.count / maxCount) * 100, cat.count > 0 ? 10 : 0)}%`,
                  backgroundColor: cat.color,
                  boxShadow: `0 0 8px ${cat.color}40`,
                }}
              />
            </div>
            <span className="w-4 text-right text-[10px] font-bold text-cyber-white/50">
              {cat.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
