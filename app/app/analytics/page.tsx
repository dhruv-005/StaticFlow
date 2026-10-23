import { PageHeader } from "@/components/layout/page-header";
import { Activity, CheckCircle2, AlertTriangle, Timer, TrendingUp, TrendingDown } from "lucide-react";

const metrics = [
  { label: "Total Requests", value: "12,847", change: "+12.5%", up: true, icon: <Activity size={18} /> },
  { label: "Success Rate", value: "99.2%", change: "+0.3%", up: true, icon: <CheckCircle2 size={18} /> },
  { label: "Error Rate", value: "0.8%", change: "-0.1%", up: false, icon: <AlertTriangle size={18} /> },
  { label: "Avg Response", value: "42ms", change: "-8ms", up: false, icon: <Timer size={18} /> },
];

const topEndpoints = [
  { path: "GET /api/tasks", requests: "4,231", avgTime: "38ms", errors: "0.2%" },
  { path: "POST /api/auth/login", requests: "3,892", avgTime: "128ms", errors: "1.1%" },
  { path: "POST /api/tasks", requests: "2,104", avgTime: "67ms", errors: "0.5%" },
  { path: "GET /api/auth/me", requests: "1,847", avgTime: "22ms", errors: "0.0%" },
  { path: "DELETE /api/tasks/:id", requests: "773", avgTime: "31ms", errors: "0.3%" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Monitor API performance, usage, and error rates."
        actions={
          <select className="input w-36 text-xs">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-static">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)]">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-crimson-soft text-crimson flex items-center justify-center">{m.icon}</div>
            </div>
            <p className="text-2xl font-bold font-display text-[var(--text-primary)] tracking-tight">{m.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${m.up ? "text-green-500" : "text-crimson"}`}>
              {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {m.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="card-static">
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Requests Over Time</h3>
        <div className="h-48 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center">
          <div className="text-center">
            <Activity size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
            <p className="text-sm text-[var(--text-muted)]">Chart visualization requires a charting library</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Demo mode — connect analytics backend for live data</p>
          </div>
        </div>
      </div>

      {/* Top Endpoints */}
      <div className="card-static">
        <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Top Endpoints</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Endpoint</th>
                <th className="text-right py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Requests</th>
                <th className="text-right py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Avg Time</th>
                <th className="text-right py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Error Rate</th>
              </tr>
            </thead>
            <tbody>
              {topEndpoints.map((ep) => (
                <tr key={ep.path} className="border-b border-[var(--border)] last:border-0">
                  <td className="py-3 font-mono text-xs text-[var(--text-primary)]">{ep.path}</td>
                  <td className="py-3 text-right text-[var(--text-secondary)]">{ep.requests}</td>
                  <td className="py-3 text-right font-mono text-xs text-[var(--text-secondary)]">{ep.avgTime}</td>
                  <td className="py-3 text-right">
                    <span className={parseFloat(ep.errors) > 1 ? "text-crimson" : "text-green-500"}>{ep.errors}</span>
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
