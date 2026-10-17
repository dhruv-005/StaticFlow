"use client";

import { useState } from "react";
import { SecurityScan } from "@/types/security";
import {
  Download,
  FileJson,
  FileText,
  ChevronDown,
  Check,
} from "lucide-react";

export function ReportExport({ scan }: { scan: SecurityScan }) {
  const [open, setOpen] = useState(false);
  const [exported, setExported] = useState<string | null>(null);

  const exportJSON = () => {
    const data = JSON.stringify(scan, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staticflow-security-report-${scan.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported("json");
    setTimeout(() => setExported(null), 2000);
  };

  const exportText = () => {
    const lines = [
      `StaticFlow Security Report`,
      `=========================`,
      `Scan ID: ${scan.id}`,
      `Type: ${scan.scanType}`,
      `Score: ${scan.score}/100 (${scan.grade})`,
      `Date: ${scan.completedAt || "N/A"}`,
      ``,
      `Vulnerabilities: ${scan.vulnerabilities.length}`,
      ``,
      ...scan.vulnerabilities.map(
        (v, i) =>
          `${i + 1}. [${v.severity.toUpperCase()}] ${v.title}\n   ${v.description}\n   Fix: ${v.fixSuggestion || "Manual review required"}\n`
      ),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `staticflow-security-report-${scan.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExported("txt");
    setTimeout(() => setExported(null), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-cyber-white/10 bg-cyber-white/5 px-3 py-1.5 text-xs font-semibold text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white transition-all"
      >
        {exported ? (
          <Check className="h-3.5 w-3.5 text-cyber-green" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {exported ? "Exported!" : "Export"}
        {!exported && <ChevronDown className="h-3 w-3" />}
      </button>

      {open && !exported && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-cyber-white/10 bg-cyber-navy/95 shadow-xl backdrop-blur-xl">
            <button
              onClick={() => {
                exportJSON();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-cyber-white/60 hover:bg-cyber-white/5 hover:text-cyber-white"
            >
              <FileJson className="h-3.5 w-3.5 text-cyber-yellow" />
              JSON Report
            </button>
            <button
              onClick={() => {
                exportText();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-xs text-cyber-white/60 hover:bg-cyber-white/5 hover:text-cyber-white"
            >
              <FileText className="h-3.5 w-3.5 text-cyber-cyan" />
              Text Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}
