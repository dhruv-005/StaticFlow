"use client";

import { useState } from "react";
import { ApiTemplate } from "@/types/marketplace";
import { generateId } from "@/lib/utils";
import { Upload, X, Check, Sparkles } from "lucide-react";

export function PublishForm({
  isOpen,
  onClose,
  onPublish,
}: {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (tpl: ApiTemplate) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("E-Commerce");
  const [language, setLanguage] = useState("node-express");
  const [database, setDatabase] = useState("postgresql");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const newTemplate: ApiTemplate = {
      id: generateId("tpl"),
      title,
      description,
      category,
      language,
      database,
      stars: 5.0,
      downloads: 1,
      author: {
        name: "Community Developer",
      },
      promptTemplate: `Build a complete ${category} API named ${title}: ${description}`,
      createdAt: new Date().toISOString().split("T")[0],
    };

    onPublish(newTemplate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-cyber-white/10 bg-cyber-navy/95 p-6 shadow-2xl backdrop-blur-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-cyber-white/40 hover:bg-cyber-white/5 hover:text-cyber-white transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple">
              <Upload className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-cyber-white">Publish to Community Marketplace</h3>
              <p className="text-xs text-cyber-white/40 font-mono">Share your API architecture with global developers</p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-mono text-cyber-white/50">Template Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Serverless Multi-Vendor Marketplace"
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 px-3.5 py-2 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-mono text-cyber-white/50">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the features, database models, and integrations..."
              className="w-full rounded-xl border border-cyber-white/10 bg-cyber-white/5 p-3 text-xs font-mono text-cyber-white outline-none focus:border-cyber-cyan/40 no-scrollbar"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-mono text-cyber-white/50">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-cyber-white/10 bg-cyber-navy px-3 py-2 text-xs font-mono text-cyber-white outline-none"
              >
                <option value="E-Commerce">E-Commerce</option>
                <option value="SaaS">SaaS</option>
                <option value="Real-Time">Real-Time</option>
                <option value="Healthcare">Healthcare</option>
                <option value="AI & ML">AI &amp; ML</option>
                <option value="FinTech">FinTech</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-mono text-cyber-white/50">Stack Runtime</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-cyber-white/10 bg-cyber-navy px-3 py-2 text-xs font-mono text-cyber-white outline-none"
              >
                <option value="node-express">Node.js Express</option>
                <option value="python-fastapi">Python FastAPI</option>
                <option value="go-gin">Go Gin</option>
                <option value="java-spring">Java Spring Boot</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="neon-button w-full text-xs font-bold uppercase tracking-wider mt-4"
          >
            Publish Template
          </button>
        </form>
      </div>
    </div>
  );
}
