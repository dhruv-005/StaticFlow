import { frontendApi } from "./client";

export interface SecurityScan {
  id: string;
  projectId: string;
  scanType: "quick" | "deep" | "full";
  status: "running" | "completed" | "failed";
  score: number;
  grade: string;
  vulnerabilities: Vulnerability[];
  startedAt: string;
  completedAt?: string;
}

export interface Vulnerability {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  title: string;
  description: string;
  file?: string;
  line?: number;
  fix?: string;
  autoFixable: boolean;
}

export async function startScan(data: {
  projectId: string;
  scanType: "quick" | "deep" | "full";
}): Promise<SecurityScan | null> {
  const res = await frontendApi.post<{ scan: SecurityScan }>("/security/scan", data);
  return res.ok ? res.data.scan : null;
}

export async function getScan(scanId: string): Promise<SecurityScan | null> {
  const res = await frontendApi.get<{ scan: SecurityScan }>(`/security/${scanId}`);
  return res.ok ? res.data.scan : null;
}

export async function applyFix(scanId: string, vulnId: string): Promise<boolean> {
  const res = await frontendApi.post(`/security/${scanId}/fix`, { vulnId });
  return res.ok;
}
