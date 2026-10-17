export const APP_NAME = "StaticFlow";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// In Vercel multi-service mode, BACKEND_URL is auto-injected by the service binding.
// In local dev, it falls back to localhost:8000.
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export const SUPPORTED_LANGUAGES = [
  { id: "node-express", label: "Node.js / Express", icon: "🟢", color: "text-green-400" },
  { id: "python-fastapi", label: "Python / FastAPI", icon: "🐍", color: "text-blue-400" },
  { id: "python-django", label: "Python / Django", icon: "🐍", color: "text-green-600" },
  { id: "java-spring", label: "Java / Spring Boot", icon: "☕", color: "text-orange-400" },
  { id: "go-gin", label: "Go / Gin", icon: "🔵", color: "text-cyan-400" },
  { id: "php-laravel", label: "PHP / Laravel", icon: "🔴", color: "text-red-400" },
] as const;

export const SUPPORTED_DATABASES = [
  { id: "postgresql", label: "PostgreSQL", icon: "🐘" },
  { id: "mongodb", label: "MongoDB", icon: "🍃" },
  { id: "mysql", label: "MySQL", icon: "🐬" },
  { id: "sqlite", label: "SQLite", icon: "📦" },
] as const;

export const DEPLOY_TARGETS = [
  { id: "vercel", label: "Vercel", icon: "▲", free: true },
  { id: "render", label: "Render", icon: "◆", free: true },
  { id: "flyio", label: "Fly.io", icon: "🎈", free: true },
  { id: "railway", label: "Railway", icon: "🚂", free: false },
  { id: "aws", label: "AWS", icon: "☁️", free: false },
  { id: "gcp", label: "GCP", icon: "🌐", free: false },
  { id: "azure", label: "Azure", icon: "🔷", free: false },
] as const;

export const SCAN_TYPES = {
  quick: { label: "Quick Scan", duration: "2-5 min", tests: 200 },
  deep: { label: "Deep Scan", duration: "15-30 min", tests: 800 },
  full: { label: "Full Audit", duration: "1-2 hours", tests: 2000 },
} as const;

export const SECURITY_GRADES = [
  { grade: "A+", min: 95, color: "text-cyber-green" },
  { grade: "A", min: 90, color: "text-cyber-green" },
  { grade: "B+", min: 85, color: "text-green-400" },
  { grade: "B", min: 80, color: "text-green-400" },
  { grade: "C", min: 70, color: "text-cyber-yellow" },
  { grade: "D", min: 60, color: "text-orange-400" },
  { grade: "F", min: 0, color: "text-cyber-red" },
] as const;

export const OWASP_TOP_10 = [
  "A01:2021 – Broken Access Control",
  "A02:2021 – Cryptographic Failures",
  "A03:2021 – Injection",
  "A04:2021 – Insecure Design",
  "A05:2021 – Security Misconfiguration",
  "A06:2021 – Vulnerable and Outdated Components",
  "A07:2021 – Identification and Authentication Failures",
  "A08:2021 – Software and Data Integrity Failures",
  "A09:2021 – Security Logging and Monitoring Failures",
  "A10:2021 – Server-Side Request Forgery (SSRF)",
] as const;

export const PLANS = {
  free: { name: "Free", maxProjects: 3, maxTeam: 1, maxApiCalls: 1000 },
  pro: { name: "Pro", maxProjects: Infinity, maxTeam: 5, maxApiCalls: 100000 },
  enterprise: { name: "Enterprise", maxProjects: Infinity, maxTeam: Infinity, maxApiCalls: Infinity },
} as const;

export const API_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export const HTTP_STATUS_CODES: Record<number, string> = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  409: "Conflict",
  422: "Unprocessable Entity",
  429: "Too Many Requests",
  500: "Internal Server Error",
  502: "Bad Gateway",
  503: "Service Unavailable",
};
