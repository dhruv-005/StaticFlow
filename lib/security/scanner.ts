import { BACKEND_URL } from "@/lib/constants";

export interface ScanConfig {
  projectId: string;
  scanType: "quick" | "deep" | "full";
  targetUrl?: string;
}

export interface ScanResult {
  scanId: string;
  score: number;
  grade: string;
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  vulnerabilities: Array<{
    severity: "critical" | "high" | "medium" | "low" | "info";
    title: string;
    description: string;
    fix: string;
    autoFixable: boolean;
  }>;
  duration: number;
}

export async function runSecurityScan(config: ScanConfig): Promise<ScanResult> {
  const response = await fetch(`${BACKEND_URL}/api/v1/security/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error(`Security scan failed: ${response.status}`);
  }

  return response.json();
}

export function calculateGrade(score: number): string {
  if (score >= 95) return "A+";
  if (score >= 90) return "A";
  if (score >= 85) return "B+";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
