"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FolderCode, ArrowRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  endpoint: string | null;
  updatedAt: string;
}

export function RecentProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/overview")
      .then((r) => r.json())
      .then((data) => setProjects(data.recentProjects || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-3">
        <div className="flex items-center gap-2">
          <FolderCode className="h-4 w-4 text-cyber-cyan" />
          <h3 className="text-sm font-bold text-cyber-white font-mono">
            Recent Projects
          </h3>
        </div>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-[10px] font-mono text-cyber-cyan hover:underline"
        >
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-xl bg-cyber-white/5"
            />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-xs text-cyber-white/30 font-mono">
            No projects yet.
          </p>
          <Link
            href="/projects"
            className="mt-2 inline-block text-xs text-cyber-cyan hover:underline"
          >
            Create your first project →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-3.5 hover:border-cyber-cyan/30 transition-all"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-cyber-white font-sans truncate">
                  {p.name}
                </p>
                <p className="text-[11px] text-cyber-white/40 font-mono truncate">
                  {p.endpoint || "No endpoint"}
                </p>
              </div>
              <span className="text-[10px] text-cyber-white/30 font-mono shrink-0 ml-3">
                {new Date(p.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
