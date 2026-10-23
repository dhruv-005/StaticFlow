
import * as React from "react";

type Variant = "default" | "red" | "green" | "yellow" | "blue" | "purple";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  dot?: boolean;
}

const styles: Record<Variant, string> = {
  default: "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border)]",
  red: "bg-crimson-soft text-crimson",
  green: "bg-green-500/10 text-green-500",
  yellow: "bg-yellow-500/10 text-yellow-500",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
};

const dots: Record<Variant, string> = {
  default: "bg-[var(--text-muted)]",
  red: "bg-crimson",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  blue: "bg-blue-400",
  purple: "bg-purple-400",
};

export function Badge({ variant = "default", dot = false, className = "", children, ...props }: BadgeProps) {
  return (
    <span className={`badge ${styles[variant]} ${className}`} {...props}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dots[variant]}`} />}
      {children}
    </span>
  );
}

export function MethodBadge({ method, className = "" }: { method: string; className?: string }) {
  const m = method.toUpperCase();
  const map: Record<string, Variant> = { GET: "green", POST: "blue", PUT: "yellow", PATCH: "purple", DELETE: "red" };
  return <Badge variant={map[m] || "default"} className={`font-mono text-[10px] tracking-wider ${className}`}>{m}</Badge>;
}

export function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
  const s = status.toLowerCase();
  const map: Record<string, Variant> = {
    active: "green", deployed: "green", success: "green", completed: "green",
    pending: "yellow", building: "yellow", queued: "yellow",
    failed: "red", error: "red", revoked: "red",
    inactive: "default", draft: "default",
  };
  return <Badge variant={map[s] || "default"} dot className={className}>{status}</Badge>;
}
