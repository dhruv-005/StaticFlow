export interface OWASPFinding {
  id: string;
  category: string;
  owaspId: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  endpoint?: string;
  file?: string;
  line?: number;
  payload?: string;
  evidence?: string;
  fix: string;
  autoFixable: boolean;
  cvssScore: number;
}

export interface OWASPReport {
  scanId: string;
  targetUrl: string;
  scanType: "quick" | "deep" | "full";
  score: number;
  grade: string;
  totalTests: number;
  passed: number;
  failed: number;
  findings: OWASPFinding[];
  coverage: Record<string, boolean>;
  startedAt: string;
  completedAt: string;
  duration: number;
}

export const OWASP_CATEGORIES = {
  A01: {
    id: "A01:2021",
    name: "Broken Access Control",
    tests: [
      "IDOR (Insecure Direct Object Reference)",
      "Privilege Escalation (Vertical)",
      "Privilege Escalation (Horizontal)",
      "Missing Function Level Access Control",
      "CORS Misconfiguration",
      "JWT None Algorithm",
      "Path Traversal",
      "Forceful Browsing",
    ],
  },
  A02: {
    id: "A02:2021",
    name: "Cryptographic Failures",
    tests: [
      "Weak Encryption Algorithm",
      "Missing HTTPS",
      "Weak TLS Configuration",
      "Sensitive Data in URL",
      "Missing Password Hashing",
      "Hardcoded Secrets",
      "Insecure Random Number Generation",
    ],
  },
  A03: {
    id: "A03:2021",
    name: "Injection",
    tests: [
      "SQL Injection (Union-based)",
      "SQL Injection (Blind)",
      "SQL Injection (Time-based)",
      "NoSQL Injection",
      "Command Injection",
      "LDAP Injection",
      "XSS (Reflected)",
      "XSS (Stored)",
      "XSS (DOM-based)",
      "SSTI (Server-Side Template Injection)",
      "Header Injection",
    ],
  },
  A05: {
    id: "A05:2021",
    name: "Security Misconfiguration",
    tests: [
      "Missing Security Headers",
      "Verbose Error Messages",
      "Default Credentials",
      "Unnecessary HTTP Methods",
      "Directory Listing Enabled",
      "Missing Rate Limiting",
      "Debug Mode Enabled",
      "Missing Content Security Policy",
    ],
  },
  A07: {
    id: "A07:2021",
    name: "Authentication Failures",
    tests: [
      "Brute Force Protection",
      "Weak Password Policy",
      "Missing MFA",
      "Session Fixation",
      "JWT Expiration",
      "JWT Signature Validation",
      "Token Revocation",
      "Credential Stuffing Protection",
    ],
  },
  A10: {
    id: "A10:2021",
    name: "Server-Side Request Forgery",
    tests: [
      "SSRF via URL Parameter",
      "SSRF via Header",
      "SSRF via File Upload",
      "DNS Rebinding",
      "Cloud Metadata Access",
    ],
  },
};

export function calculateSecurityScore(
  findings: OWASPFinding[]
): { score: number; grade: string } {
  let totalDeduction = 0;

  for (const finding of findings) {
    switch (finding.severity) {
      case "critical":
        totalDeduction += 20;
        break;
      case "high":
        totalDeduction += 10;
        break;
      case "medium":
        totalDeduction += 5;
        break;
      case "low":
        totalDeduction += 2;
        break;
      case "info":
        totalDeduction += 0.5;
        break;
    }
  }

  const score = Math.max(0, Math.round(100 - totalDeduction));

  let grade = "F";
  if (score >= 95) grade = "A+";
  else if (score >= 90) grade = "A";
  else if (score >= 85) grade = "B+";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";

  return { score, grade };
}

export function generateOWASPReport(
  scanId: string,
  targetUrl: string,
  scanType: "quick" | "deep" | "full",
  findings: OWASPFinding[],
  duration: number
): OWASPReport {
  const { score, grade } = calculateSecurityScore(findings);

  const coverage: Record<string, boolean> = {};
  for (const [key, category] of Object.entries(OWASP_CATEGORIES)) {
    coverage[category.id] = findings.some((f) => f.owaspId === category.id);
  }

  return {
    scanId,
    targetUrl,
    scanType,
    score,
    grade,
    totalTests: Object.values(OWASP_CATEGORIES).reduce(
      (sum, c) => sum + c.tests.length,
      0
    ),
    passed: Object.values(OWASP_CATEGORIES).reduce(
      (sum, c) => sum + c.tests.length,
      0
    ) - findings.length,
    failed: findings.length,
    findings,
    coverage,
    startedAt: new Date(Date.now() - duration).toISOString(),
    completedAt: new Date().toISOString(),
    duration,
  };
}
