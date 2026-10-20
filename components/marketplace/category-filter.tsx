"use client";

export function CategoryFilter({
  categories,
  activeCategory,
  onSelect,
}: {
  categories: string[];
  activeCategory: string;
  onSelect: (cat: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold font-mono transition-all ${
              isActive
                ? "bg-cyber-cyan/15 text-cyber-cyan border border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                : "border border-cyber-white/10 bg-cyber-white/[0.02] text-cyber-white/50 hover:border-cyber-white/20 hover:text-cyber-white"
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
