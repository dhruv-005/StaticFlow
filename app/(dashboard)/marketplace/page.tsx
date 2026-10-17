"use client";

import { Download, ArrowRight, Star } from "lucide-react";

const templates = [
  { title: "E-Commerce Suite", cat: "E-Commerce", desc: "Stripe payments, cart, inventory.", stars: 4.9, downloads: 3820, lang: "Node.js" },
  { title: "SaaS Boilerplate", cat: "SaaS", desc: "Multi-tenant, roles, billing.", stars: 4.8, downloads: 2940, lang: "Node.js" },
  { title: "Real-Time Chat", cat: "Real-Time", desc: "WebSocket messaging, rooms.", stars: 4.9, downloads: 1850, lang: "Go" },
  { title: "Healthcare Records", cat: "Healthcare", desc: "HIPAA-compliant patient data.", stars: 4.7, downloads: 920, lang: "Java" },
  { title: "AI RAG Pipeline", cat: "AI & ML", desc: "Vector search, streaming chat.", stars: 5.0, downloads: 4100, lang: "Python" },
  { title: "Financial Ledger", cat: "FinTech", desc: "Double-entry accounting.", stars: 4.9, downloads: 1420, lang: "Python" },
];

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--text)" }}>API Marketplace</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Pre-built API architectures ready to clone and customize.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <div key={t.title} className="catalyst-card catalyst-card-hover p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="catalyst-badge text-[10px]">{t.cat}</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}><Star className="h-3 w-3 fill-current" style={{ color: "var(--warning)" }} />{t.stars}</span>
              </div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text)" }}>{t.title}</h3>
              <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3 text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                <span>{t.lang}</span><span className="flex items-center gap-1"><Download className="h-3 w-3" />{t.downloads.toLocaleString()}</span>
              </div>
              <button className="text-xs font-semibold flex items-center gap-1" style={{ color: "var(--text)" }}>Clone <ArrowRight className="h-3 w-3" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
