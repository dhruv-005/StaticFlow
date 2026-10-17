"use client";

import { Star } from "lucide-react";

export function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3 w-3 fill-cyber-yellow text-cyber-yellow" />
      <span className="text-xs font-mono font-bold text-cyber-white">{rating.toFixed(1)}</span>
    </div>
  );
}
