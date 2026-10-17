"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CodeFile { name: string; language: string; content: string }
interface ChatMsg { role: "user" | "assistant"; content: string }
interface GenRes { success: boolean; files: CodeFile[]; apiUrl?: string; apiKey?: string; model?: string; error?: string }

const SparklesIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/></svg>;
const CopyIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const FileIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const SendIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const PlayIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const KeyIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>;
const LinkIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
const ExternalIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [activeFile, setActiveFile] = useState(0);
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "assistant", content: 'Hi! Describe the API you want. Example: "Create a REST API for managing students with name, email, and grade."' },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>(["[INFO] StaticFlow Builder ready."]);
  const [tab, setTab] = useState<"editor" | "console">("editor");
  const chatEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const copy = useCallback(async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const generate = useCallback(async (p?: string) => {
    const text = p || prompt;
    if (!text.trim()) return;
    setIsGenerating(true);
    setLogs(l => [...l, `[INFO] Generating: "${text}"`]);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const d: GenRes = await r.json();
      if (d.success && d.files?.length) {
        setFiles(d.files);
        setActiveFile(0);
        setApiUrl(d.apiUrl || "https://staticflow.onrender.com/api/v1/items");
        setApiKey(d.apiKey || "sf_live_demo_key");
        setLogs(l => [...l, `[SUCCESS] ${d.files.length} files via ${d.model || "engine"}`, `[INFO] Live → ${d.apiUrl}`]);
        setChat(c => [...c, { role: "assistant", content: `✅ Generated **${d.files.length} files**! Your live API is at \`${d.apiUrl}\`. Click **Quick Test** to see it in action.` }]);
      } else {
        setLogs(l => [...l, `[ERROR] ${d.error || "Failed"}`]);
        setChat(c => [...c, { role: "assistant", content: `⚠️ ${d.error || "Generation failed"}. Try rephrasing.` }]);
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Network error";
      setLogs(l => [...l, `[ERROR] ${msg}`]);
      setChat(c => [...c, { role: "assistant", content: `⚠️ ${msg}` }]);
    } finally { setIsGenerating(false); }
  }, [prompt]);

  const sendChat = useCallback(() => {
    if (!chatInput.trim()) return;
    const m = chatInput.trim();
    setChat(c => [...c, { role: "user", content: m }]);
    setChatInput("");
    if (/create|build|generate|make|api|endpoint|crud|rest/i.test(m)) {
      setPrompt(m);
      generate(m);
    } else {
      setTimeout(() => setChat(c => [...c, { role: "assistant", content: 'Try: "Create a REST API for products with name, price, category."' }]), 500);
    }
  }, [chatInput, generate]);

  const suggestions = [
    "Create a student management API",
    "Build a product catalog API",
    "Make a task tracker API",
    "Generate an employee directory API",
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto max-w-[1600px] px-4 py-6 lg:px-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">API Builder</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Describe your API in plain English → get live endpoints instantly.</p>
        </div>

        {/* Prompt */}
        <Card className="mb-4" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                placeholder='e.g. "Create a REST API for managing students with name, email, grade"'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => e.key === "Enter" && generate()}
                className="flex-1 text-sm"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <Button onClick={() => generate()} disabled={isGenerating || !prompt.trim()} className="shrink-0 gap-2 font-semibold" style={{ background: isGenerating ? "var(--muted)" : "var(--accent)", color: "#171815" }}>
                <SparklesIcon />{isGenerating ? "Generating…" : "Generate API"}
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setPrompt(s); generate(s); }} className="rounded-full px-3 py-1 text-xs transition-colors hover:opacity-80" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}>{s}</button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ★ Credentials Panel */}
        {apiUrl && apiKey && (
          <Card className="mb-4" style={{ background: "var(--surface)", borderColor: "var(--accent)", borderWidth: 2 }}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base" style={{ color: "var(--accent)" }}>
                <KeyIcon /> Live API Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}><LinkIcon /> Live API URL</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded px-3 py-2 text-sm" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}>{apiUrl}</code>
                  <Button variant="outline" size="sm" onClick={() => copy(apiUrl, "url")} style={{ borderColor: "var(--border)", color: "var(--text)" }}>{copied === "url" ? <CheckIcon /> : <CopyIcon />}</Button>
                  <Button size="sm" className="gap-1" onClick={() => window.open(apiUrl, "_blank")} style={{ background: "var(--accent)", color: "#171815" }}><PlayIcon /> Quick Test <ExternalIcon /></Button>
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--muted)" }}><KeyIcon /> API Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 rounded px-3 py-2 text-sm font-mono" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--accent)" }}>{apiKey}</code>
                  <Button variant="outline" size="sm" onClick={() => copy(apiKey, "key")} style={{ borderColor: "var(--border)", color: "var(--text)" }}>{copied === "key" ? <CheckIcon /> : <CopyIcon />}</Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => copy(`curl ${apiUrl}`, "curl")} style={{ borderColor: "var(--border)", color: "var(--text)" }}>{copied === "curl" ? <CheckIcon /> : <CopyIcon />} Copy cURL</Button>
                <Button variant="outline" size="sm" onClick={() => copy(`curl -H "x-api-key: ${apiKey}" ${apiUrl}`, "curlauth")} style={{ borderColor: "var(--border)", color: "var(--text)" }}>{copied === "curlauth" ? <CheckIcon /> : <CopyIcon />} cURL + Auth</Button>
              </div>
              <div className="rounded p-3 text-xs font-mono leading-relaxed" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}>
                <span style={{ color: "var(--accent)" }}>// Try it now</span><br/>
                <span style={{ color: "var(--text)" }}>fetch</span>(<span style={{ color: "#86efac" }}>&quot;{apiUrl}&quot;</span>)<br/>
                &nbsp;&nbsp;.then(r =&gt; r.json())<br/>
                &nbsp;&nbsp;.then(console.log)
              </div>
            </CardContent>
          </Card>
        )}

        {/* Workspace */}
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <Card style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
            <Tabs value={tab} onValueChange={v => setTab(v as "editor" | "console")}>
              <div className="flex items-center justify-between border-b px-4" style={{ borderColor: "var(--border)" }}>
                <TabsList style={{ background: "transparent" }}>
                  <TabsTrigger value="editor" style={{ color: "var(--text)" }}>Editor</TabsTrigger>
                  <TabsTrigger value="console" style={{ color: "var(--text)" }}>Console</TabsTrigger>
                </TabsList>
                {files.length > 0 && <span className="text-xs" style={{ color: "var(--muted)" }}>{files.length} file(s)</span>}
              </div>
              <TabsContent value="editor" className="m-0">
                {files.length === 0 ? (
                  <div className="flex h-[420px] flex-col items-center justify-center gap-3 p-8 text-center">
                    <SparklesIcon />
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Enter a prompt and click <strong>Generate API</strong>.</p>
                  </div>
                ) : (
                  <div className="flex h-[420px]">
                    <div className="w-48 shrink-0 overflow-y-auto border-r p-2" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                      <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--muted)" }}>Files</p>
                      {files.map((f, i) => (
                        <button key={f.name} onClick={() => setActiveFile(i)} className="flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left text-xs" style={{ background: i === activeFile ? "var(--surface)" : "transparent", color: i === activeFile ? "var(--accent)" : "var(--text)", border: i === activeFile ? "1px solid var(--border)" : "1px solid transparent" }}>
                          <FileIcon /><span className="truncate">{f.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 overflow-auto">
                      <div className="flex items-center justify-between border-b px-4 py-2" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                        <span className="text-xs font-medium">{files[activeFile]?.name}</span>
                        <Button variant="ghost" size="sm" onClick={() => copy(files[activeFile]?.content || "", "code")} style={{ color: "var(--muted)" }}>{copied === "code" ? <CheckIcon /> : <CopyIcon />}</Button>
                      </div>
                      <pre className="h-full overflow-auto p-4 text-xs leading-relaxed font-mono" style={{ background: "var(--bg)", color: "var(--text)" }}><code>{files[activeFile]?.content}</code></pre>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="console" className="m-0">
                <div className="h-[420px] overflow-auto p-4 font-mono text-xs leading-relaxed" style={{ background: "#0d0e0c", color: "#a3e635" }}>
                  {logs.map((l, i) => (
                    <div key={i}><span style={{ color: "#6b7280" }}>[{String(i).padStart(3, "0")}]</span> <span style={{ color: l.includes("[ERROR]") ? "#f87171" : l.includes("[SUCCESS]") ? "#86efac" : "#a3e635" }}>{l}</span></div>
                  ))}
                  <div className="mt-1 animate-pulse" style={{ color: "#6b7280" }}>▌</div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <Card className="flex flex-col" style={{ background: "var(--surface)", borderColor: "var(--border)", height: 520 }}>
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-sm"><SparklesIcon /> AI Assistant</CardTitle></CardHeader>
            <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
              <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">
                {chat.map((m, i) => (
                  <div key={i} className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${m.role === "user" ? "ml-8" : "mr-8"}`} style={{ background: m.role === "user" ? "var(--accent)" : "var(--bg)", color: m.role === "user" ? "#171815" : "var(--text)" }}>{m.content}</div>
                ))}
                <div ref={chatEnd} />
              </div>
              <div className="border-t p-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex gap-2">
                  <Input placeholder="Ask anything…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendChat()} className="flex-1 text-sm" style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }} />
                  <Button size="icon" onClick={sendChat} disabled={!chatInput.trim()} style={{ background: "var(--accent)", color: "#171815" }}><SendIcon /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
