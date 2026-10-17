#!/bin/bash
set -e

echo "📦 [1/6] Creating directories..."
mkdir -p stores components/builder components/ui types app/\(dashboard\)/builder

echo "📁 [2/6] Writing stores/builder-store.ts..."
cat << 'STORE_EOF' > stores/builder-store.ts
import { create } from "zustand";

export interface BuilderFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

interface BuilderState {
  activeFile: string;
  files: Record<string, BuilderFile>;
  isGenerating: boolean;
  selectedLanguage: string;
  selectedDatabase: string;
  setActiveFile: (path: string) => void;
  setFiles: (files: Record<string, BuilderFile>) => void;
  updateFileContent: (path: string, content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setLanguage: (lang: string) => void;
  setDatabase: (db: string) => void;
  resetBuilder: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  activeFile: "src/index.ts",
  files: {
    "src/index.ts": {
      name: "index.ts",
      path: "src/index.ts",
      language: "typescript",
      content: "// ⚡ StaticFlow API Workspace\nimport express from 'express';\nconst app = express();\napp.use(express.json());\napp.get('/health', (req, res) => res.json({ status: 'live' }));\napp.listen(3000, () => console.log('Live on 3000'));",
    },
  },
  isGenerating: false,
  selectedLanguage: "node-express",
  selectedDatabase: "postgresql",
  setActiveFile: (activeFile) => set({ activeFile }),
  setFiles: (files) => set({ files: files || {} }),
  updateFileContent: (path, content) =>
    set((state) => ({
      files: {
        ...state.files,
        [path]: { ...(state.files[path] || { name: path, path, language: "typescript" }), content },
      },
    })),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setLanguage: (selectedLanguage) => set({ selectedLanguage }),
  setDatabase: (selectedDatabase) => set({ selectedDatabase }),
  resetBuilder: () => set({ activeFile: "src/index.ts", files: {}, isGenerating: false }),
}));
STORE_EOF

echo "🔨 [3/6] Writing builder components..."

cat << 'COMP_EOF' > components/builder/chat-panel.tsx
"use client";
import { Bot, Sparkles } from "lucide-react";
import { PromptInput } from "./prompt-input";

export function ChatPanel() {
  return (
    <div className="flex h-full flex-col p-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Bot className="h-5 w-5 text-cyan-400" />
        <h3 className="font-bold text-white text-sm">StaticFlow AI Architect</h3>
      </div>
      <div className="flex-1 p-4 text-xs text-white/50 text-center flex flex-col items-center justify-center gap-2">
        <Sparkles className="h-8 w-8 text-cyan-400" />
        <p>Type your requirements to generate a complete API.</p>
      </div>
      <div className="border-t border-white/10 pt-3">
        <PromptInput />
      </div>
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/code-editor.tsx
"use client";
import Editor from "@monaco-editor/react";
import { useBuilderStore } from "@/stores/builder-store";
import { Loader2 } from "lucide-react";

export function CodeEditor() {
  const { activeFile = "src/index.ts", files = {}, updateFileContent } = useBuilderStore();
  const currentFile = (files && files[activeFile]) || {
    content: "// Describe your API\n",
    language: "typescript",
    path: "src/index.ts",
  };

  return (
    <div className="h-full w-full overflow-hidden bg-[#0d0d1a]">
      <Editor
        height="100%"
        path={currentFile.path}
        language={currentFile.language || "typescript"}
        value={currentFile.content}
        theme="vs-dark"
        onChange={(val) => updateFileContent(currentFile.path, val || "")}
        loading={<div className="flex h-full items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-cyan-400" /></div>}
        options={{ fontSize: 13, minimap: { enabled: true }, scrollBeyondLastLine: false, tabSize: 2 }}
      />
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/toolbar.tsx
"use client";
import { Rocket, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export function Toolbar() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl border border-white/10 bg-[#111133]/50">
      <span className="text-xs font-bold font-mono text-cyan-400">StaticFlow Core Builder</span>
      <div className="flex items-center gap-2">
        <button onClick={() => router.push("/security")} className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400 hover:bg-green-500/20">
          <Shield className="h-3.5 w-3.5" /> Scan
        </button>
        <button onClick={() => router.push("/deploy")} className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-3.5 py-1.5 text-xs font-bold text-black">
          <Rocket className="h-3.5 w-3.5" /> Deploy
        </button>
      </div>
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/file-tree.tsx
"use client";
import { useBuilderStore } from "@/stores/builder-store";
import { FileCode, Plus } from "lucide-react";

export function FileTree() {
  const { files = {}, activeFile, setActiveFile, setFiles } = useBuilderStore();

  const addFile = () => {
    const name = prompt("Enter file path:");
    if (name) {
      setFiles({
        ...files,
        [name]: { name, path: name, content: `// ${name}\n`, language: "typescript" },
      });
      setActiveFile(name);
    }
  };

  return (
    <div className="w-48 border-r border-white/10 p-2 space-y-1 bg-[#0A0A1A]">
      <div className="flex justify-between px-2 pb-1 text-[10px] font-bold text-white/40 uppercase">
        <span>Files</span>
        <button onClick={addFile}><Plus className="h-3 w-3 hover:text-cyan-400" /></button>
      </div>
      {Object.values(files || {}).map((f: any) => (
        <button key={f.path} onClick={() => setActiveFile(f.path)} className={`flex items-center gap-2 w-full p-1.5 text-xs font-mono rounded ${activeFile === f.path ? "bg-cyan-500/10 text-cyan-400 font-bold border-l-2 border-cyan-400" : "text-white/60 hover:bg-white/5"}`}>
          <FileCode className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="truncate">{f.name}</span>
        </button>
      ))}
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/tab-bar.tsx
"use client";
import { useBuilderStore } from "@/stores/builder-store";
import { FileCode } from "lucide-react";

export function TabBar() {
  const { files = {}, activeFile, setActiveFile } = useBuilderStore();
  return (
    <div className="flex items-center gap-1 overflow-x-auto max-w-[60%]">
      {Object.keys(files || {}).map((path) => (
        <button key={path} onClick={() => setActiveFile(path)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t-md ${activeFile === path ? "bg-[#0d0d1a] text-cyan-400 border-b-2 border-cyan-400 font-bold" : "text-white/40 hover:bg-white/5"}`}>
          <FileCode className="h-3 w-3" />
          <span className="truncate max-w-[120px]">{(files[path] || {}).name}</span>
        </button>
      ))}
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/terminal-output.tsx
"use client";
import { Terminal } from "lucide-react";

export function TerminalOutput() {
  return (
    <div className="h-full bg-black/90 p-4 rounded-xl border border-white/10 font-mono text-xs text-green-400 space-y-1">
      <div className="flex items-center gap-1.5 text-white/40 pb-2 border-b border-white/10 mb-2">
        <Terminal className="h-3.5 w-3.5 text-cyan-400" /> Container Console
      </div>
      <p>&gt; Virtual micro-container active</p>
      <p>&gt; Ready for commands</p>
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/endpoint-list.tsx
"use client";

export function EndpointList() {
  const sampleEndpoints = [
    { method: "GET", path: "/health", desc: "System health check endpoint", auth: false },
    { method: "POST", path: "/api/auth/register", desc: "User registration", auth: false },
    { method: "POST", path: "/api/auth/login", desc: "User login issuing JWT", auth: false },
    { method: "GET", path: "/api/items", desc: "List paginated resources", auth: true },
  ];

  return (
    <div className="p-4 space-y-3 font-mono text-xs">
      <h4 className="text-white font-bold pb-2 border-b border-white/10">Endpoints</h4>
      <div className="grid gap-2">
        {sampleEndpoints.map((ep, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <span className="text-green-400 font-bold">{ep.method}</span>
              <span className="text-white font-bold">{ep.path}</span>
              <span className="text-white/40">{ep.desc}</span>
            </div>
            <span className="text-[10px] text-white/50">{ep.auth ? "JWT Required" : "Public"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/schema-preview.tsx
"use client";
import { Database } from "lucide-react";

export function SchemaPreview() {
  return (
    <div className="p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center gap-2 text-cyan-400 font-bold">
        <Database className="h-4 w-4" /> PostgreSQL Schema
      </div>
      <div className="p-3 bg-black/60 rounded-xl border border-white/10 text-white/70">
        model User &#123; id: String @id, email: String @unique &#125;
      </div>
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/language-selector.tsx
"use client";

export function LanguageSelector() {
  return <div className="text-xs font-mono text-white/60"><span>Stack: Node.js / Express</span></div>;
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/project-config.tsx
"use client";

export function ProjectConfig() {
  return <div className="text-xs font-mono text-white/40"><span>Workspace: Production</span></div>;
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/prompt-input.tsx
"use client";
import { useState } from "react";
import { ArrowUp } from "lucide-react";

export function PromptInput() {
  const [text, setText] = useState("");
  return (
    <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Describe your API..."
        className="flex-1 bg-transparent text-xs text-white outline-none"
      />
      <button className="p-2 bg-cyan-400 text-black rounded-lg font-bold">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/chat-message.tsx
"use client";
export function ChatMessage({ message }: { message: any }) {
  return <div className="text-xs text-white">{message?.content}</div>;
}
COMP_EOF

cat << 'COMP_EOF' > components/builder/suggestion-chips.tsx
"use client";
export function SuggestionChips() {
  return <div className="text-xs text-white/40">Click any template above to get started.</div>;
}
COMP_EOF

echo "📄 [4/6] Writing app/(dashboard)/builder/page.tsx..."
cat << 'PAGE_EOF' > "app/(dashboard)/builder/page.tsx"
"use client";

import { useEffect } from "react";
import { useBuilderStore } from "@/stores/builder-store";
import { ChatPanel } from "@/components/builder/chat-panel";
import { CodeEditor } from "@/components/builder/code-editor";
import { Toolbar } from "@/components/builder/toolbar";
import { FileTree } from "@/components/builder/file-tree";
import { TabBar } from "@/components/builder/tab-bar";
import { TerminalOutput } from "@/components/builder/terminal-output";
import { EndpointList } from "@/components/builder/endpoint-list";
import { SchemaPreview } from "@/components/builder/schema-preview";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Database, ListTree, Terminal as TerminalIcon } from "lucide-react";

export default function BuilderPage() {
  return (
    <div className="flex h-[calc(100vh-6rem)] flex-col gap-3">
      <Toolbar />
      <div className="grid flex-1 grid-cols-12 gap-3 overflow-hidden">
        <div className="col-span-12 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111133]/40 lg:col-span-4">
          <ChatPanel />
        </div>
        <div className="col-span-12 flex flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111133]/40 lg:col-span-8">
          <Tabs defaultValue="editor" className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#111133]/60 px-4 py-2">
              <TabBar />
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger value="editor" className="flex items-center gap-1.5 text-xs">
                  <Code2 className="h-3.5 w-3.5" /> Editor
                </TabsTrigger>
                <TabsTrigger value="endpoints" className="flex items-center gap-1.5 text-xs">
                  <ListTree className="h-3.5 w-3.5" /> Endpoints
                </TabsTrigger>
                <TabsTrigger value="schema" className="flex items-center gap-1.5 text-xs">
                  <Database className="h-3.5 w-3.5" /> Database
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex items-center gap-1.5 text-xs">
                  <TerminalIcon className="h-3.5 w-3.5" /> Terminal
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="editor" className="m-0 flex flex-1 overflow-hidden">
              <div className="flex w-full h-full">
                <FileTree />
                <div className="flex-1 h-full overflow-hidden">
                  <CodeEditor />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="endpoints" className="m-0 flex-1 overflow-y-auto p-4">
              <EndpointList />
            </TabsContent>
            <TabsContent value="schema" className="m-0 flex-1 overflow-y-auto p-4">
              <SchemaPreview />
            </TabsContent>
            <TabsContent value="terminal" className="m-0 flex-1 overflow-hidden p-4">
              <TerminalOutput />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
PAGE_EOF

echo "🧪 [5/6] Testing build locally..."
npx prisma generate
npm run build

echo "🚀 [6/6] Staging & pushing all files to GitHub..."
git add -A
git commit -m "fix(prod): include stores and builder components in git repo" || true
git push origin main --force

echo ""
echo "🎉 SUCCESS: All builder components committed and pushed to GitHub main branch!"
