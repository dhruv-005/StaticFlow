"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import {
  Zap, Play, Save, Eye, FileCode, FolderTree,
  Settings2, Terminal, ChevronRight, Loader2,
} from "lucide-react";

const demoFiles = [
  { name: "src", type: "folder", children: [
    { name: "routes", type: "folder", children: [
      { name: "auth.ts", type: "file" },
      { name: "users.ts", type: "file" },
      { name: "tasks.ts", type: "file" },
    ]},
    { name: "models", type: "folder", children: [
      { name: "User.ts", type: "file" },
      { name: "Task.ts", type: "file" },
    ]},
    { name: "middleware", type: "folder", children: [
      { name: "auth.ts", type: "file" },
    ]},
    { name: "index.ts", type: "file" },
  ]},
  { name: "package.json", type: "file" },
  { name: "tsconfig.json", type: "file" },
];

const demoCode = `import express from "express";
import { authenticate } from "../middleware/auth";
import { Task } from "../models/Task";

const router = express.Router();

// GET /api/tasks — List all tasks
router.get("/", authenticate, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json({ data: tasks, total: tasks.length });
});

// POST /api/tasks — Create a new task
router.post("/", authenticate, async (req, res) => {
  const { title, description, priority } = req.body;
  const task = await Task.create({
    title,
    description,
    priority: priority || "medium",
    userId: req.user.id,
  });
  res.status(201).json({ data: task });
});

// PUT /api/tasks/:id — Update a task
router.put("/:id", authenticate, async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!task) return res.status(404).json({ error: "Not found" });
  res.json({ data: task });
});

// DELETE /api/tasks/:id — Delete a task
router.delete("/:id", authenticate, async (req, res) => {
  await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  res.status(204).send();
});

export default router;`;

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState("tasks.ts");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="space-y-4 animate-fade-in h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader
        title="AI API Builder"
        description="Describe your API and let AI generate the complete backend."
        actions={
          <>
            <button className="btn-secondary btn-sm"><Save size={14} /> Save</button>
            <button className="btn-secondary btn-sm"><Eye size={14} /> Preview</button>
            <button className="btn-primary btn-sm" onClick={handleGenerate} disabled={generating}>
              {generating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
              {generating ? "Generating..." : "Generate"}
            </button>
          </>
        }
      />

      {/* Prompt Area */}
      <div className="card-static p-4 shrink-0">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='Describe your API... e.g., "Create a REST API for managing tasks with authentication, CRUD endpoints, request validation, and a PostgreSQL database."'
              className="input min-h-[60px] resize-none font-sans text-sm pr-12"
              rows={2}
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="btn-primary self-end"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1"><Settings2 size={12} /> Node.js + Express</span>
          <span className="flex items-center gap-1"><FileCode size={12} /> TypeScript</span>
          <span className="flex items-center gap-1"><Terminal size={12} /> PostgreSQL</span>
        </div>
      </div>

      {/* IDE Area */}
      <div className="flex-1 flex gap-1 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] min-h-0">
        {/* File Tree */}
        <div className="w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-elevated)] p-3 overflow-y-auto hidden md:block">
          <p className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-semibold mb-3 flex items-center gap-1">
            <FolderTree size={12} /> Explorer
          </p>
          <div className="space-y-0.5 text-sm">
            {demoFiles.map((f) => (
              <div key={f.name}>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[var(--text-secondary)] font-medium">
                  <ChevronRight size={12} />
                  <span className="text-crimson">📁</span> {f.name}
                </div>
                {f.children && f.children.map((c: any) => (
                  <div key={c.name} className="ml-4">
                    {c.type === "folder" ? (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[var(--text-secondary)]">
                        <ChevronRight size={12} />
                        <span className="text-crimson">📁</span> {c.name}
                      </div>
                    ) : null}
                    {c.children && c.children.map((cf: any) => (
                      <button
                        key={cf.name}
                        onClick={() => setSelectedFile(cf.name)}
                        className={`w-full text-left flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-colors ${
                          selectedFile === cf.name
                            ? "bg-crimson-soft text-crimson"
                            : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
                        }`}
                      >
                        <FileCode size={12} /> {cf.name}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          <div className="flex items-center border-b border-[var(--border)] bg-[var(--bg-elevated)] px-2 shrink-0">
            <div className="flex items-center gap-1 px-3 py-2 text-xs font-mono bg-[var(--bg-surface)] border-t-2 border-t-crimson text-[var(--text-primary)] rounded-t-lg">
              <FileCode size={12} className="text-crimson" /> {selectedFile}
            </div>
          </div>
          {/* Code */}
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-relaxed bg-[var(--code-bg)]">
            <pre className="text-[var(--text-secondary)]">
              {demoCode.split("\n").map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-right mr-4 text-[var(--text-muted)] select-none text-xs leading-relaxed">{i + 1}</span>
                  <span className="text-[var(--text-primary)]">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
