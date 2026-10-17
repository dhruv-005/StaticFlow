"use client";

import { Search, X } from "lucide-react";

export function SearchTemplates({
  query,
  onSearch,
}: {
  query: string;
  onSearch: (q: string) => void;
}) {
  return (
    <div className="relative flex items-center min-w-[240px]">
      <Search className="absolute left-3 h-3.5 w-3.5 text-cyber-white/30" />
      <input
        type="text"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search templates..."
        className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/[0.03] pl-9 pr-8 py-1.5 text-xs font-mono text-cyber-white placeholder:text-cyber-white/30 outline-none focus:border-cyber-cyan/40 transition-all"
      />
      {query && (
        <button
          onClick={() => onSearch("")}
          className="absolute right-2.5 text-cyber-white/30 hover:text-cyber-white"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
