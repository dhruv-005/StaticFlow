import { MarketingHeader } from "@/components/layout/marketing-header";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import Link from "next/link";
import {
  Zap, FileCode, Link2, FlaskConical, KeyRound, Rocket,
  BarChart3, AlertTriangle, FolderKanban, Shield, ArrowRight,
} from "lucide-react";

const features = [
  { icon: <Zap size={28} />, title: "AI-Assisted API Generation", desc: "Describe your API in natural language and get complete, production-ready backend code with endpoints, validation, database schemas, and authentication — all generated in seconds.", tags: ["NLP", "Code Gen", "Multi-framework"] },
  { icon: <FileCode size={28} />, title: "Code Editing & File Explorer", desc: "Full IDE-like experience with syntax highlighting, file tree navigation, search, multi-tab editing, and unsaved change tracking. Edit every line the AI generates.", tags: ["Monaco", "Syntax HL", "File Tree"] },
  { icon: <Link2 size={28} />, title: "Endpoint Management", desc: "Visual endpoint registry with method badges, route paths, auth requirements, request/response schemas, and one-click testing. Supports GET, POST, PUT, PATCH, DELETE.", tags: ["REST", "OpenAPI", "Schemas"] },
  { icon: <FlaskConical size={28} />, title: "HTTP Request Testing", desc: "Professional API client built right into the workspace. Build requests with params, headers, body, and auth. Inspect responses with JSON formatting, timing, and status codes.", tags: ["HTTP", "JSON", "History"] },
  { icon: <KeyRound size={28} />, title: "API Key Management", desc: "Generate, rotate, and revoke API keys with granular scopes and usage limits. Secrets are encrypted at rest and shown only once at creation.", tags: ["Encryption", "RBAC", "Scopes"] },
  { icon: <Rocket size={28} />, title: "Deployment Workflows", desc: "One-click deploy with automatic builds, health checks, environment variables, and rollback. Monitor deployment status in real-time with detailed build logs.", tags: ["CI/CD", "Health", "Rollback"] },
  { icon: <BarChart3 size={28} />, title: "Usage Analytics", desc: "Real-time dashboards showing request volume, success rates, latency percentiles, status code distribution, and endpoint usage. Filter by time range and project.", tags: ["Charts", "Latency", "Filters"] },
  { icon: <AlertTriangle size={28} />, title: "Error Monitoring", desc: "Track failed requests, slow endpoints, and error patterns. Get detailed error traces with request context to debug issues faster.", tags: ["Tracing", "Alerts", "Logs"] },
  { icon: <FolderKanban size={28} />, title: "Project Organization", desc: "Organize APIs into projects with descriptions, framework metadata, deployment status, and team access controls. Switch between projects instantly.", tags: ["Workspaces", "Teams", "Metadata"] },
  { icon: <Shield size={28} />, title: "Security Controls", desc: "Enterprise-grade security with encrypted secrets, role-based access, audit logs, rate limiting, and SOC 2 compliant infrastructure.", tags: ["SOC 2", "Audit", "RBAC"] },
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingHeader />
      <main className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="section-title mb-4">Platform Features</h1>
            <p className="section-subtitle">Everything you need to design, build, test, and deploy APIs — in one workspace.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-crimson-soft text-crimson flex items-center justify-center shrink-0 group-hover:bg-crimson group-hover:text-white transition-all duration-200">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">{f.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">{f.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {f.tags.map((tag) => (
                        <span key={tag} className="badge bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-20">
            <Link href="/signup" className="btn-primary btn-lg shadow-glow">
              Try All Features Free <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </>
  );
}
