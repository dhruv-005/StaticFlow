"use client";

import React, { useState } from "react";
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  searchPlaceholder?: string;
  pageSize?: number;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  searchKey,
  searchPlaceholder = "Filter records...",
  pageSize = 10,
  className,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  // Search Filter
  const filteredData = data.filter((item) => {
    if (!searchKey) return true;
    const val = item[searchKey];
    if (typeof val === "string" || typeof val === "number") {
      return val.toString().toLowerCase().includes(search.toLowerCase());
    }
    return true;
  });

  // Sort Filter
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (aVal === bVal) return 0;
    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    return sortOrder === "asc" ? 1 : -1;
  });

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <div className={cn("glass-card overflow-hidden space-y-3", className)}>
      {/* Search Header */}
      {searchKey && (
        <div className="flex items-center justify-between border-b border-cyber-white/10 p-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-cyber-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 pl-9 pr-3.5 py-2 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>
          <span className="text-[11px] font-mono text-cyber-white/40">
            {filteredData.length} entries
          </span>
        </div>
      )}

      {/* Table Canvas */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-cyber-white/10 bg-cyber-white/[0.02] text-cyber-white/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && toggleSort(col.key)}
                  className={cn(
                    "p-3.5 font-bold uppercase tracking-wider",
                    col.sortable && "cursor-pointer select-none hover:text-cyber-cyan",
                    col.className
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && sortKey === col.key && (
                      sortOrder === "asc" ? (
                        <ChevronUp className="h-3 w-3 text-cyber-cyan" />
                      ) : (
                        <ChevronDown className="h-3 w-3 text-cyber-cyan" />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-white/5">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-cyber-white/30">
                  No matching records found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-cyber-white/[0.015] transition-all">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("p-3.5 text-cyber-white/80", col.className)}>
                      {col.render ? col.render(item) : String(item[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Strip */}
      <div className="flex items-center justify-between border-t border-cyber-white/10 p-3.5 text-xs font-mono text-cyber-white/50">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyber-white/10 bg-cyber-white/5 disabled:opacity-30 hover:bg-cyber-white/10"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyber-white/10 bg-cyber-white/5 disabled:opacity-30 hover:bg-cyber-white/10"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
