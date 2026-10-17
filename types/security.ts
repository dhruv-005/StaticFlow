export type ScanType = "quick" | "deep" | "full";
export type ScanStatus = "pending" | "running" | "completed" | "failed";
export type VulnerabilitySeverity = "critical" | "high" | "medium" | "low" | "info";

export interface SecurityVulnerability {
  id: string;
  severity: VulnerabilitySeverity;
  category: string;
  title: string;
  description: string;
  file?: string;
  line?: number;
  endpoint?: string;
  payload?: string;
  fixSuggestion?: string;
  autoFixable: boolean;
}

export interface SecurityScan {
  id: string;
  projectId: string;
  scanType: ScanType;
  status: ScanStatus;
  score: number;
  grade: string;
  vulnerabilities: SecurityVulnerability[];
  reportUrl?: string;
  startedAt: string;
  completedAt?: string;
}
