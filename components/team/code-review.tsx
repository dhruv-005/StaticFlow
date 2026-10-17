"use client";

import { useState } from "react";
import { GitPullRequest, CheckCircle2, MessageSquare, AlertCircle, FileCode, Check } from "lucide-react";

interface ReviewItem {
  id: string;
  title: string;
  author: string;
  branch: string;
  endpointsChanged: number;
  commentsCount: number;
  status: "OPEN" | "APPROVED" | "CHANGES_REQUESTED";
  time: string;
}

export function CodeReview() {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: "cr-101",
      title: "Add Stripe webhook signature HMAC validation",
      author: "Marcus Johnson",
      branch: "feat/webhook-security",
      endpointsChanged: 2,
      commentsCount: 3,
      status: "OPEN",
      time: "25 minutes ago",
    },
    {
      id: "cr-102",
      title: "Implement Redis caching on GET /api/v1/products",
      author: "Sarah Chen",
      branch: "perf/product-caching",
      endpointsChanged: 1,
      commentsCount: 1,
      status: "APPROVED",
      time: "2 hours ago",
    },
    {
      id: "cr-103",
      title: "Add role-based authorization to DELETE /api/v1/users",
      author: "Priya Patel",
      branch: "fix/rbac-delete",
      endpointsChanged: 1,
      commentsCount: 4,
      status: "CHANGES_REQUESTED",
      time: "1 day ago",
    },
  ]);

  const statusStyles: Record<string, string> = {
    OPEN: "bg-cyber-cyan/10 border-cyber-cyan/30 text-cyber-cyan",
    APPROVED: "bg-cyber-green/10 border-cyber-green/30 text-cyber-green",
    CHANGES_REQUESTED: "bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow",
  };

  const handleApprove = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r)));
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-cyber-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <GitPullRequest className="h-5 w-5 text-cyber-pink" />
          <div>
            <h3 className="text-base font-bold text-cyber-white">Collaborative Endpoint Change Reviews</h3>
            <p className="text-xs text-cyber-white/40 font-mono">Peer review and approve generated API routes before production deploy</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-cyber-white/10 bg-cyber-space/80 p-4 hover:border-cyber-pink/30 transition-all"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`rounded border px-1.5 py-0.2 text-[9px] font-bold ${statusStyles[rev.status]}`}>
                  {rev.status}
                </span>
                <h4 className="text-sm font-bold text-cyber-white font-sans">{rev.title}</h4>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-cyber-white/40">
                <span>Author: <strong className="text-cyber-white/70">{rev.author}</strong></span>
                <span className="text-cyber-purple font-bold">{rev.branch}</span>
                <span className="flex items-center gap-1">
                  <FileCode className="h-3 w-3" /> {rev.endpointsChanged} routes
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" /> {rev.commentsCount} comments
                </span>
                <span>{rev.time}</span>
              </div>
            </div>

            {rev.status === "OPEN" && (
              <button
                onClick={() => handleApprove(rev.id)}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-cyber-green/30 bg-cyber-green/10 px-3 py-1.5 text-xs font-semibold text-cyber-green hover:bg-cyber-green/20 transition-all shrink-0"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Approve Changes</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
