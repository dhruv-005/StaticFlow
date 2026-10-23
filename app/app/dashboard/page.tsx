import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import {
  FolderKanban, Activity, CheckCircle2, Rocket,
  Zap, ArrowRight, Clock, AlertTriangle,
} from "lucide-react";

const metrics = [
  { label: "Total Projects", value: "0", icon: <FolderKanban size={18} />, color: "text-blue-400 bg-blue-500/10" },
  { label: "API Requests", value: "0", icon: <Activity size={18} />, color: "text-green-500 bg-green-500/10" },
  { label: "Success Rate", value: "—", icon: <CheckCircle2 size={18} />, color: "text-crimson bg-crimson-soft" },
  { label: "Active Deploys", value: "0", icon: <Rocket size={18} />, color: "text-purple-400 bg-purple-500/10" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Your API Workspace"
        description="Monitor projects, test activity, and deployments from one place."
        actions={
          <>
            <Link href="/app/tester" className="btn-secondary btn-sm">
              <Activity size={14} /> API Tester
            </Link>
            <Link href="/app/builder" className="btn-primary btn-sm">
              <Zap size={14} /> New Project
            </Link>
          </>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-static flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.color}`}>
              {m.icon}
            </div>
            <div>
              <p className="text-sm text-[var(--text-muted)]">{m.label}</p>
              <p className="text-2xl font-bold font-display text-[var(--text-primary)] tracking-tight">{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Link href="/app/builder" className="card group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-crimson-soft text-crimson flex items-center justify-center group-hover:bg-crimson group-hover:text-white transition-all">
            <Zap size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-[var(--text-primary)]">Generate New API</h3>
            <p className="text-sm text-[var(--text-secondary)]">Describe your API in natural language</p>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-crimson transition-colors" />
        </Link>

        <Link href="/app/tester" className="card group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
            <Activity size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-[var(--text-primary)]">Test an Endpoint</h3>
            <p className="text-sm text-[var(--text-secondary)]">Send HTTP requests and inspect responses</p>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-crimson transition-colors" />
        </Link>

        <Link href="/app/deployments" className="card group flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
            <Rocket size={22} />
          </div>
          <div className="flex-1">
            <h3 className="font-display font-semibold text-[var(--text-primary)]">Deploy to Production</h3>
            <p className="text-sm text-[var(--text-secondary)]">Ship your API with one click</p>
          </div>
          <ArrowRight size={16} className="text-[var(--text-muted)] group-hover:text-crimson transition-colors" />
        </Link>
      </div>

      {/* Recent Activity + Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-static">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Clock size={16} className="text-[var(--text-muted)]" /> Recent Activity
          </h3>
          <div className="text-center py-8">
            <p className="text-sm text-[var(--text-muted)]">No activity yet. Create your first project to get started.</p>
          </div>
        </div>

        <div className="card-static">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-[var(--text-muted)]" /> Alerts
          </h3>
          <div className="text-center py-8">
            <p className="text-sm text-[var(--text-muted)]">No alerts. Everything is running smoothly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
