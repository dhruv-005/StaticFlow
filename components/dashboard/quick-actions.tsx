import Link from "next/link";
import {
  Code2,
  Shield,
  BarChart3,
  Rocket,
  FileText,
  Key,
  ArrowRight,
} from "lucide-react";

const actions = [
  {
    href: "/builder",
    icon: Code2,
    label: "Build New API",
    description: "Generate from prompt",
    color: "text-cyber-cyan",
    bg: "bg-cyber-cyan/5",
    border: "hover:border-cyber-cyan/30",
  },
  {
    href: "/security",
    icon: Shield,
    label: "Run Security Scan",
    description: "OWASP Top 10 check",
    color: "text-cyber-green",
    bg: "bg-cyber-green/5",
    border: "hover:border-cyber-green/30",
  },
  {
    href: "/performance",
    icon: BarChart3,
    label: "Performance Test",
    description: "Load & stress test",
    color: "text-cyber-purple",
    bg: "bg-cyber-purple/5",
    border: "hover:border-cyber-purple/30",
  },
  {
    href: "/deploy",
    icon: Rocket,
    label: "Deploy to Cloud",
    description: "One-click deploy",
    color: "text-cyber-pink",
    bg: "bg-cyber-pink/5",
    border: "hover:border-cyber-pink/30",
  },
  {
    href: "/docs",
    icon: FileText,
    label: "Generate Docs",
    description: "OpenAPI + Postman",
    color: "text-cyber-yellow",
    bg: "bg-cyber-yellow/5",
    border: "hover:border-cyber-yellow/30",
  },
  {
    href: "/keys",
    icon: Key,
    label: "Manage Keys",
    description: "Vault & rotation",
    color: "text-cyber-blue",
    bg: "bg-cyber-blue/5",
    border: "hover:border-cyber-blue/30",
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className={`glass-card group flex flex-col items-center gap-2 p-4 text-center
                      transition-all duration-300 hover:scale-[1.03] ${action.border}`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg} border border-current/10`}
          >
            <action.icon className={`h-5 w-5 ${action.color}`} />
          </div>
          <div>
            <p className="text-xs font-bold text-cyber-white">{action.label}</p>
            <p className="text-[10px] text-cyber-white/30">{action.description}</p>
          </div>
          <ArrowRight className="h-3 w-3 text-cyber-white/10 group-hover:text-cyber-cyan group-hover:translate-x-0.5 transition-all" />
        </Link>
      ))}
    </div>
  );
}
