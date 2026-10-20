"use client";
import { useState } from "react";
import { DocEndpoint } from "@/types/docs";
import { Search } from "lucide-react";

export function SearchDocs({
  endpoints,
  onSelect,
}: {
  endpoints: DocEndpoint[];
  selectedId: string;
  onSelect: (ep: DocEndpoint) => void;
}) {
  const [query, setQuery] = useState("");
  const filtered = (endpoints || []).filter(
    (e) =>
      e.path.toLowerCase().includes(query.toLowerCase()) ||
      e.summary.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white">
        <Search className="h-3.5 w-3.5 text-white/30" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter routes..."
          className="w-full bg-transparent outline-none font-mono text-xs"
        />
      </div>
      {query && (
        <div className="absolute top-full left-0 right-0 z-30 mt-1 rounded-lg border border-white/10 bg-[#111133] p-1 shadow-2xl">
          {filtered.map((ep) => (
            <button
              key={ep.id}
              onClick={() => {
                onSelect(ep);
                setQuery("");
              }}
              className="flex w-full justify-between p-2 text-xs font-mono text-white hover:bg-cyan-500/10 rounded"
            >
              <span>{ep.path}</span>
              <span className="text-cyan-400 font-bold">{ep.method}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
