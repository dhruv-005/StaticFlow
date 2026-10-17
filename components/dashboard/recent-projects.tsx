import Link from "next/link";
import {
  Code2,
  ExternalLink,
  Shield,
  Clock,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const projects = [
  {
    id: "1",
    name: "E-Commerce API",
    description: "Full e-commerce backend with auth, products, orders, and Stripe payments.",
    language: "Node.js",
    framework: "Express",
    status: "live" as const,
    security: "A+",
    lastDeploy: "2 hours ago",
    endpoints: 34,
  },
  {
    id: "2",
    name: "Blog Platform API",
    description: "Blog API with posts, comments, likes, and role-based access control.",
    language: "Python",
    framework: "FastAPI",
    status: "live" as const,
    security: "A",
    lastDeploy: "1 day ago",
    endpoints: 24,
  },
  {
    id: "3",
    name: "Healthcare Records API",
    description: "HIPAA-compliant patient records management with encryption.",
    language: "Java",
    framework: "Spring Boot",
    status: "testing" as const,
    security: "B+",
    lastDeploy: "3 days ago",
    endpoints: 18,
  },
  {
    id: "4",
    name: "Real-Time Chat API",
    description: "WebSocket-based chat with rooms, typing indicators, and read receipts.",
    language: "Go",
    framework: "Gin",
    status: "draft" as const,
    security: "—",
    lastDeploy: "Never",
    endpoints: 12,
  },
];

const statusConfig = {
  live: {
    label: "Live",
    color: "text-cyber-green",
    bg: "bg-cyber-green/10",
    border: "border-cyber-green/20",
    dot: "bg-cyber-green",
  },
  testing: {
    label: "Testing",
    color: "text-cyber-yellow",
    bg: "bg-cyber-yellow/10",
    border: "border-cyber-yellow/20",
    dot: "bg-cyber-yellow",
  },
  draft: {
    label: "Draft",
    color: "text-cyber-white/40",
    bg: "bg-cyber-white/5",
    border: "border-cyber-white/10",
    dot: "bg-cyber-white/30",
  },
};

const langColors: Record<string, string> = {
  "Node.js": "text-cyber-green",
  Python: "text-cyber-blue",
  Java: "text-cyber-pink",
  Go: "text-cyber-cyan",
};

export function RecentProjects() {
  return (
    <div className="glass-card">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-white/5 px-6 py-4">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-cyber-cyan" />
          <h2 className="font-bold text-cyber-white">Recent Projects</h2>
        </div>
        <Link
          href="/builder"
          className="flex items-center gap-1.5 rounded-lg border border-cyber-cyan/20 bg-cyber-cyan/5
                     px-3 py-1.5 text-xs font-semibold text-cyber-cyan
                     hover:bg-cyber-cyan/10 transition-all"
        >
          <Plus className="h-3 w-3" />
          New API
        </Link>
      </div>

      {/* Project List */}
      <div className="divide-y divide-cyber-white/5">
        {projects.map((project) => {
          const status = statusConfig[project.status];
          return (
            <Link
              key={project.id}
              href={`/builder/${project.id}`}
              className="flex items-center gap-4 px-6 py-4 transition-all hover:bg-cyber-white/[0.02]"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyber-white/5 bg-cyber-white/[0.02]">
                <Code2 className={`h-5 w-5 ${langColors[project.language] || "text-cyber-white/40"}`} />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-bold text-cyber-white">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${status.color} ${status.bg} ${status.border}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-cyber-white/30">
                  {project.description}
                </p>
              </div>

              {/* Meta */}
              <div className="hidden items-center gap-6 sm:flex">
                <div className="text-right">
                  <p className="text-xs text-cyber-white/30">Security</p>
                  <p className={`text-sm font-bold ${project.security === "A+" ? "text-cyber-green" : project.security === "A" ? "text-cyber-green/70" : "text-cyber-yellow"}`}>
                    {project.security}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-cyber-white/30">Endpoints</p>
                  <p className="text-sm font-bold text-cyber-white/60">
                    {project.endpoints}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-cyber-white/30">Stack</p>
                  <p className={`text-xs font-semibold ${langColors[project.language]}`}>
                    {project.framework}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-cyber-white/30">Deployed</p>
                  <p className="text-xs text-cyber-white/40">
                    {project.lastDeploy}
                  </p>
                </div>
              </div>

              <ExternalLink className="h-4 w-4 shrink-0 text-cyber-white/20" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
