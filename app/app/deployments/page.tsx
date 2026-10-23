import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/badge";
import { Rocket, ExternalLink, RefreshCw, Clock, GitBranch } from "lucide-react";

const deployments = [
  { id: "dpl_abc123", env: "Production", status: "Deployed", url: "https://my-api.staticflow.app", version: "v1.2.0", time: "2 hours ago", duration: "45s" },
  { id: "dpl_def456", env: "Staging", status: "Building", url: "—", version: "v1.3.0-rc1", time: "10 min ago", duration: "—" },
  { id: "dpl_ghi789", env: "Production", status: "Failed", url: "—", version: "v1.1.9", time: "1 day ago", duration: "32s" },
  { id: "dpl_jkl012", env: "Production", status: "Deployed", url: "https://my-api.staticflow.app", version: "v1.1.8", time: "3 days ago", duration: "41s" },
];

export default function DeploymentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Deployments"
        description="Manage builds, environments, and production releases."
        actions={
          <button className="btn-primary btn-sm"><Rocket size={14} /> Deploy Now</button>
        }
      />

      {/* Current Status */}
      <div className="card-static flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
            <Rocket size={22} />
          </div>
          <div>
            <p className="text-sm text-[var(--text-muted)]">Current Production</p>
            <p className="font-display font-semibold text-[var(--text-primary)]">v1.2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status="Deployed" />
          <a href="https://my-api.staticflow.app" target="_blank" className="btn-secondary btn-sm">
            <ExternalLink size={14} /> Live URL
          </a>
        </div>
      </div>

      {/* Deployment History */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Deployment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Environment</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden md:table-cell">Version</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden lg:table-cell">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider hidden sm:table-cell">When</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr key={d.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-primary)]">{d.id}</td>
                  <td className="px-4 py-3">
                    <span className="badge bg-[var(--bg-elevated)] text-[var(--text-secondary)] text-[10px] flex items-center gap-1 w-fit">
                      <GitBranch size={10} /> {d.env}
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--text-secondary)] hidden md:table-cell">{d.version}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden lg:table-cell">{d.duration}</td>
                  <td className="px-4 py-3 text-xs text-[var(--text-muted)] hidden sm:table-cell flex items-center gap-1"><Clock size={12} /> {d.time}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-crimson hover:bg-crimson-soft transition-colors" title="Redeploy">
                      <RefreshCw size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
