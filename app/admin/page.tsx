import { PageHeader } from "@/components/layout/page-header";
import {
  Users, FolderKanban, Activity, AlertTriangle,
  TrendingUp, TrendingDown, Server, Shield,
} from "lucide-react";

const metrics = [
  { label: "Total Users", value: "1,247", change: "+8.3%", up: true, icon: <Users size={18} />, color: "text-blue-400 bg-blue-500/10" },
  { label: "Total Projects", value: "3,891", change: "+12.1%", up: true, icon: <FolderKanban size={18} />, color: "text-green-500 bg-green-500/10" },
  { label: "API Requests (24h)", value: "284K", change: "+5.7%", up: true, icon: <Activity size={18} />, color: "text-crimson bg-crimson-soft" },
  { label: "System Errors", value: "23", change: "-14.2%", up: false, icon: <AlertTriangle size={18} />, color: "text-yellow-500 bg-yellow-500/10" },
];

const recentUsers = [
  { name: "Dhruv Patel", email: "dhruv@api.com", role: "Super Admin", status: "Active", joined: "Jan 1, 2025" },
  { name: "Vatsal Shah", email: "vatsal@api.com", role: "Super Admin", status: "Active", joined: "Jan 5, 2025" },
  { name: "Admin User", email: "admin@api.com", role: "Super Admin", status: "Active", joined: "Jan 10, 2025" },
  { name: "Sarah Chen", email: "sarah@dev.io", role: "User", status: "Active", joined: "Feb 14, 2025" },
  { name: "Mike Johnson", email: "mike@startup.co", role: "Admin", status: "Active", joined: "Mar 2, 2025" },
];

const systemHealth = [
  { service: "API Gateway", status: "Operational", uptime: "99.99%", latency: "12ms" },
  { service: "Auth Service", status: "Operational", uptime: "99.97%", latency: "28ms" },
  { service: "AI Builder", status: "Degraded", uptime: "98.50%", latency: "1.2s" },
  { service: "Database", status: "Operational", uptime: "99.99%", latency: "4ms" },
  { service: "CDN", status: "Operational", uptime: "100%", latency: "8ms" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Admin Overview"
        description="Platform metrics, system health, and user activity."
      />

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="card-static">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--text-muted)]">{m.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${m.color}`}>
                {m.icon}
              </div>
            </div>
            <p className="text-2xl font-bold font-display text-[var(--text-primary)] tracking-tight">{m.value}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${m.up ? "text-green-500" : "text-crimson"}`}>
              {m.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {m.change} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card-static">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Users size={16} className="text-[var(--text-muted)]" /> Recent Users
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 text-xs font-semibold text-[var(--text-muted)] uppercase">User</th>
                  <th className="text-left py-2 text-xs font-semibold text-[var(--text-muted)] uppercase hidden sm:table-cell">Role</th>
                  <th className="text-left py-2 text-xs font-semibold text-[var(--text-muted)] uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.email} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-2.5">
                      <p className="font-medium text-[var(--text-primary)] text-xs">{u.name}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{u.email}</p>
                    </td>
                    <td className="py-2.5 hidden sm:table-cell">
                      <span className={`badge text-[10px] ${
                        u.role === "Super Admin" ? "bg-crimson-soft text-crimson" :
                        u.role === "Admin" ? "bg-purple-500/10 text-purple-400" :
                        "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                      }`}>{u.role}</span>
                    </td>
                    <td className="py-2.5">
                      <span className="badge bg-green-500/10 text-green-500 text-[10px]">{u.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="card-static">
          <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Server size={16} className="text-[var(--text-muted)]" /> System Health
          </h3>
          <div className="space-y-2">
            {systemHealth.map((s) => (
              <div key={s.service} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-elevated)]">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    s.status === "Operational" ? "bg-green-500" :
                    s.status === "Degraded" ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm text-[var(--text-primary)]">{s.service}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                  <span className="hidden sm:block">{s.uptime}</span>
                  <span className="font-mono">{s.latency}</span>
                  <span className={`badge text-[10px] ${
                    s.status === "Operational" ? "bg-green-500/10 text-green-500" :
                    s.status === "Degraded" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                  }`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Deployments", value: "847", icon: <Server size={16} /> },
          { label: "API Keys Active", value: "2,341", icon: <Shield size={16} /> },
          { label: "Avg Response Time", value: "38ms", icon: <Activity size={16} /> },
          { label: "Uptime (30d)", value: "99.97%", icon: <TrendingUp size={16} /> },
        ].map((s) => (
          <div key={s.label} className="card-static flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-crimson-soft text-crimson flex items-center justify-center shrink-0">
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
              <p className="text-lg font-bold font-display text-[var(--text-primary)]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
