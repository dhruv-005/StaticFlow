"use client";

import { ApiTemplate } from "@/types/marketplace";
import { TemplateCard } from "./template-card";
import { ShoppingBag } from "lucide-react";

export function TemplateGrid({ templates }: { templates: ApiTemplate[] }) {
  if (templates.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
        <ShoppingBag className="h-10 w-10 text-cyber-white/20 mb-3" />
        <h3 className="text-base font-bold text-cyber-white">No Templates Found</h3>
        <p className="mt-1 text-xs text-cyber-white/40">Try adjusting your search query or category filter.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
