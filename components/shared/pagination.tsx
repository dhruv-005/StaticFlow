"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-center gap-1 font-mono text-xs", className)}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyber-white/10 bg-cyber-white/5 text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white disabled:opacity-30 transition-all"
        title="First Page"
      >
        <ChevronsLeft className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyber-white/10 bg-cyber-white/5 text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white disabled:opacity-30 transition-all"
        title="Previous Page"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-center gap-1 px-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (p) =>
              p === 1 ||
              p === totalPages ||
              Math.abs(p - currentPage) <= 1
          )
          .map((page, idx, array) => {
            const isGap = idx > 0 && page - array[idx - 1] > 1;

            return (
              <React.Fragment key={page}>
                {isGap && <span className="px-1 text-cyber-white/30">...</span>}
                <button
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg border text-xs font-bold transition-all",
                    currentPage === page
                      ? "border-cyber-cyan/50 bg-cyber-cyan/15 text-cyber-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]"
                      : "border-cyber-white/10 bg-cyber-white/5 text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white"
                  )}
                >
                  {page}
                </button>
              </React.Fragment>
            );
          })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyber-white/10 bg-cyber-white/5 text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white disabled:opacity-30 transition-all"
        title="Next Page"
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyber-white/10 bg-cyber-white/5 text-cyber-white/60 hover:bg-cyber-white/10 hover:text-cyber-white disabled:opacity-30 transition-all"
        title="Last Page"
      >
        <ChevronsRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

import React from "react";
