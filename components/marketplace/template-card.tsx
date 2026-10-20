"use client";

import Link from "next/link";
import { ApiTemplate } from "@/types/marketplace";
import { RatingStars } from "./rating-stars";
import { Code2, Database, Download, Sparkles, ArrowRight } from "lucide-react";

export function TemplateCard({ template }: { template: ApiTemplate }) {
  return (
    <div className="glass-card group flex flex-col justify-between p-5 space-y-4 hover:border-cyber-cyan/30 hover:scale-[1.01] transition-all">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="rounded bg-cyber-cyan/10 border border-cyber-cyan/30 px-2 py-0.5 text-[10px] font-mono font-bold text-cyber-cyan uppercase">
            {template.category}
          </span>
          <RatingStars rating={template.stars} />
        </div>

        {/* Title and Summary */}
        <div>
          <h3 className="text-base font-bold text-cyber-white group-hover:text-cyber-cyan transition-colors">
            {template.title}
          </h3>
          <p className="mt-1 text-xs text-cyber-white/50 line-clamp-2 leading-relaxed">
            {template.description}
          </p>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-cyber-white/40 pt-1">
          <span className="flex items-center gap-1">
            <Code2 className="h-3 w-3 text-cyber-cyan" /> {template.language}
          </span>
          <span className="flex items-center gap-1">
            <Database className="h-3 w-3 text-cyber-purple" /> {template.database}
          </span>
        </div>
      </div>

      {/* Footer Details and Inspect Link */}
      <div className="flex items-center justify-between border-t border-cyber-white/5 pt-3">
        <div className="flex items-center gap-1 text-[11px] font-mono text-cyber-white/40">
          <Download className="h-3 w-3 text-cyber-green" />
          <span>{template.downloads.toLocaleString()}</span>
        </div>

        <Link
          href={`/marketplace/${template.id}`}
          className="flex items-center gap-1 text-xs font-semibold text-cyber-cyan hover:underline group-hover:translate-x-0.5 transition-transform"
        >
          <span>Inspect Architecture</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
