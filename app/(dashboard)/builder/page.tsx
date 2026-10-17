"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CodeFile { name: string; language: string; content: string }
interface ChatMsg { role: "user" | "assistant"; content: string }
interface GenRes { success: boolean; files: CodeFile[]; apiUrl?: string; apiKey?: string; model?: string; error?: string }

/* ── Icons ── */
const I = ({ d, s = 16 }: { d: string; s?: number }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const Sparkles = () => <I d="M12 3l1.9 5.8a2 2 0 001.3 1.3L21 12l-5.8 1.9a2 2 0 00-1.3 1.3L12 21l-1.9-5.8a2 2 0 00-1.3-1.3L3 12l5.8-1.9a2 2 0 001.3-1.3L12 3z" />;
const Copy = () => <I d="M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2zM5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" s={14} />;
const Check = () => <I d="M20 6L9 17l-5-5" s={14} />;
const Send = () => <I d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />;
const Play = () => <I d="M5 3l14 9-14 9V3z" s={12} />;
const KeyIco = () => <I d="M21 2l-2 2m-7.6 7.6a5.5 5.5 0 11-7.8 7.8 5.5 5.5 0 017.8-7.8zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" s={14} />;
const LinkIco = () => <I d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.8 1.7" s={14} />;
const Ext = () => <I d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" s={11} />;

export default function BuilderPage() {
  const [prompt, setPrompt] = useState("");
  const [gen, setGen] = useState(false);
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [af, setAf] = useState(0);
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "assistant", content: 'Hi! Describe the API you want. Example: "100 college students with marks and subjects."' },
  ]);
  const [ci, setCi] = useState("");
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [cp, setCp] = useState<string | null>(null);
  const [logs, setLogs] = useState(["[INFO] StaticFlow Builder ready."]);
  const [view, setView] = useState<"editor" | "console" | "chat">("editor");
  const ce = useRef<HTMLDivElement>(null);

  useEffect(() => { ce.current?.scrollIntoView({ behavior: "smooth" }); }, [chat]);

  const copy = useCallback(async (t: string, f: string) => {
    try { await navigator.clipboard.writeText(t); } catch {}
    setCp(f); setTimeout(() => setCp(null), 2000);
  }, []);

  const generate = useCallback(async (p?: string) => {
    const t = p || prompt;
    if (!t.trim() || gen) return;
    setGen(true);
    setLogs(l => [...l, `[INFO] Generating: "${t}"`]);
    try {
      const r = await fetch("/api/generate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: t }),
      });
      const d: GenRes = await r.json();
      if (d.success && d.files?.length) {
        setFiles(d.files); setAf(0);
        setUrl(d.apiUrl || "https://staticflow.onrender.com/api/v1/items?limit=100");
        setKey(d.apiKey || "sf_live_demo");
        setLogs(l => [...l, `[SUCCESS] ${d.files.length} files via ${d.model}`, `[INFO] ${d.apiUrl}`]);
        setChat(c => [...c, { role: "assistant", content: `✅ Generated ${d.files.length} files. Click Test to see data.` }]);
      } else {
        setLogs(l => [...l, `[ERROR] ${d.error}`]);
      }
    } catch (e: unknown) {
      const m = e instanceof Error ? e.message : "Error";
      setLogs(l => [...l, `[ERROR] ${m}`]);
    } finally { setGen(false); }
  }, [prompt, gen]);

  const send = useCallback(() => {
    if (!ci.trim()) return;
    const m = ci.trim();
    setChat(c => [...c, { role: "user", content: m }]); setCi("");
    if (/create|build|generate|make|api|crud|rest/i.test(m)) { setPrompt(m); generate(m); }
    else setTimeout(() => setChat(c => [...c, { role: "assistant", content: 'Try: "Create 100 products API."' }]), 500);
  }, [ci, generate]);

  const chips = ["100 students", "500 products", "50 tasks", "200 employees"];

  return (
    <div className="min-h-screen w-full overflow-x-hidden" style={{ background: "var(--bg)", color: "var(--text)" }}>
      <div className="mx-auto w-full max-w-[1600px] px-2 py-3 sm:px-4 sm:py-5 lg:px-6 lg:py-6">

        {/* ── Header ── */}
        <div className="mb-3 sm:mb-4">
          <h1 className="text-base font-bold leading-tight sm:text-xl md:text-2xl lg:text-3xl">API Builder</h1>
          <p className="mt-0.5 text-[10px] sm:text-xs md:text-sm" style={{ color: "var(--muted)" }}>
            Describe your API → get live endpoints instantly.
          </p>
        </div>

        {/* ── Prompt Card ── */}
        <Card className="mb-2.5 w-full" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
          <CardContent className="p-2 sm:p-3 md:p-4">
            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Input
                placeholder='"100 students" or "500 products"'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); generate(); } }}
                className="h-9 w-full min-w-0 flex-1 text-xs sm:h-10 sm:text-sm"
                style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
              />
              <Button
                onClick={() => generate()}
                disabled={gen || !prompt.trim()}
                className="h-9 w-full shrink-0 gap-1.5 text-xs font-semibold sm:h-10 sm:w-auto sm:text-sm"
                style={{ background: gen ? "var(--muted)" : "var(--accent)", color: "#171815", minWidth: 110 }}
              >
                {gen ? (
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#171815] border-t-transparent" />
                ) : <Sparkles />}
                {gen ? "Generating…" : "Generate"}
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {chips.map(c => (
                <button
                  key={c}
                  onClick={() => { setPrompt(c); generate(c); }}
                  disabled={gen}
                  className="rounded-full px-2 py-0.5 text-[10px] transition-opacity disabled:opacity-40 sm:px-2.5 sm:text-[11px]"
                  style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--muted)" }}
                >
                  {c}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Credentials (animated reveal, fully contained) ── */}
        <div
          className="w-full overflow-hidden transition-all duration-300 ease-out"
          style={{
            maxHeight: url ? 500 : 0,
            opacity: url ? 1 : 0,
            marginBottom: url ? 10 : 0,
          }}
        >
          <Card className="w-full" style={{ background: "var(--surface)", borderColor: "var(--accent)", borderWidth: 2 }}>
            <CardHeader className="pb-1 pt-2 sm:pt-3">
              <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: "var(--accent)" }}>
                <KeyIco /> Live API Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-2.5 sm:pb-3">

              {/* URL block */}
              <div className="w-full min-w-0">
                <label className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]" style={{ color: "var(--muted)" }}>
                  <LinkIco /> API URL
                </label>
                <div className="flex w-full min-w-0 flex-col gap-1.5">
                  <div
                    className="w-full min-w-0 overflow-hidden rounded px-2 py-1.5"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  >
                    <code
                      className="block w-full text-[10px] sm:text-[11px] md:text-xs"
                      style={{
                        color: "var(--text)",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                        fontFamily: "monospace",
                        lineHeight: 1.4,
                      }}
                    >
                      {url}
                    </code>
                  </div>
                  <div className="flex w-full gap-1.5">
                    <Button
                      variant="outline" size="sm"
                      className="h-7 flex-1 gap-1 text-[10px] sm:text-xs"
                      onClick={() => copy(url, "u")}
                      style={{ borderColor: "var(--border)", color: "var(--text)" }}
                    >
                      {cp === "u" ? <><Check /> Copied</> : <><Copy /> Copy</>}
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 flex-1 gap-1 text-[10px] sm:text-xs"
                      onClick={() => window.open(url, "_blank")}
                      style={{ background: "var(--accent)", color: "#171815" }}
                    >
                      <Play /> Test <Ext />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Key block */}
              <div className="w-full min-w-0">
                <label className="mb-1 flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wide sm:text-[10px]" style={{ color: "var(--muted)" }}>
                  <KeyIco /> API Key
                </label>
                <div className="flex w-full min-w-0 flex-col gap-1.5 sm:flex-row sm:items-stretch">
                  <div
                    className="w-full min-w-0 overflow-hidden rounded px-2 py-1.5 sm:flex-1"
                    style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
                  >
                    <code
                      className="block w-full text-[10px] sm:text-[11px] md:text-xs"
                      style={{
                        color: "var(--accent)",
                        wordBreak: "break-all",
                        overflowWrap: "break-word",
                        fontFamily: "monospace",
                        lineHeight: 1.4,
                      }}
                    >
                      {key}
                    </code>
                  </div>
                  <Button
                    variant="outline" size="sm"
                    className="h-7 gap-1 text-[10px] sm:w-auto sm:text-xs"
                    onClick={() => copy(key, "k")}
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    {cp === "k" ? <><Check /> Copied</> : <><Copy /> Copy</>}
                  </Button>
                </div>
              </div>

              {/* cURL buttons */}
              <div className="flex w-full flex-wrap gap-1.5">
                <Button
                  variant="outline" size="sm"
                  className="h-6 flex-1 text-[9px] sm:text-[10px]"
                  onClick={() => copy(`curl "${url}"`, "c")}
                  style={{ borderColor: "var(--border)", color: "var(--text)", minWidth: 100 }}
                >
                  {cp === "c" ? "✓ Copied" : "Copy cURL"}
                </Button>
                <Button
                  variant="outline" size="sm"
                  className="h-6 flex-1 text-[9px] sm:text-[10px]"
                  onClick={() => copy(`curl -H "x-api-key: ${key}" "${url}"`, "ca")}
                  style={{ borderColor: "var(--border)", color: "var(--text)", minWidth: 100 }}
                >
                  {cp === "ca" ? "✓ Copied" : "cURL + Auth"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── MOBILE: Pill tabs for 3 panels ── */}
        <div className="mb-2 flex w-full gap-1 lg:hidden">
          {(["editor", "console", "chat"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="flex-1 rounded-md py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors sm:text-xs"
              style={{
                background: view === v ? "var(--accent)" : "var(--surface)",
                color: view === v ? "#171815" : "var(--muted)",
                border: "1px solid var(--border)",
              }}
            >
              {v === "editor" ? "Code" : v === "console" ? "Logs" : "AI"}
            </button>
          ))}
        </div>

        {/* ── Workspace grid ── */}
        <div className="grid w-full gap-2.5 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_340px]">

          {/* ── LEFT: Editor + Console ── */}
          <div className={`w-full min-w-0 ${view === "chat" ? "hidden lg:block" : ""}`}>
            <Card className="w-full overflow-hidden" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>

              {/* Desktop sub-tabs */}
              <div className="hidden items-center justify-between border-b px-3 lg:flex" style={{ borderColor: "var(--border)" }}>
                <div className="flex">
                  {(["editor", "console"] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="border-b-2 px-3 py-2 text-xs font-medium transition-colors"
                      style={{
                        borderColor: view === v ? "var(--accent)" : "transparent",
                        color: view === v ? "var(--accent)" : "var(--muted)",
                      }}
                    >
                      {v === "editor" ? "Editor" : "Console"}
                    </button>
                  ))}
                </div>
                {files.length > 0 && view === "editor" && (
                  <span className="text-[10px]" style={{ color: "var(--muted)" }}>{files.length} files</span>
                )}
              </div>

              {/* EDITOR */}
              {(view === "editor" || (view !== "console" && view !== "chat")) && (
                <div className="w-full">
                  {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center sm:py-16">
                      <div style={{ color: "var(--muted)" }}><Sparkles /></div>
                      <p className="text-[11px] sm:text-xs" style={{ color: "var(--muted)" }}>
                        Enter a prompt and click <strong>Generate</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col">
                      {/* File selector */}
                      <div className="w-full border-b" style={{ borderColor: "var(--border)", background: "var(--bg)" }}>
                        <select
                          value={af}
                          onChange={e => setAf(+e.target.value)}
                          className="w-full appearance-none bg-transparent px-2.5 py-1.5 text-[11px] font-mono outline-none sm:text-xs"
                          style={{ color: "var(--text)" }}
                        >
                          {files.map((f, i) => (
                            <option key={f.name} value={i} style={{ background: "var(--surface)" }}>
                              📄 {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Code area */}
                      <div className="relative w-full">
                        <Button
                          variant="ghost" size="sm"
                          className="absolute right-1.5 top-1.5 z-10 h-6 w-6 p-0"
                          onClick={() => copy(files[af]?.content || "", "code")}
                          style={{ color: "var(--muted)", background: "var(--surface)" }}
                        >
                          {cp === "code" ? <Check /> : <Copy />}
                        </Button>
                        <div
                          className="w-full overflow-auto"
                          style={{
                            background: "var(--bg)",
                            maxHeight: "60vh",
                            minHeight: 250,
                          }}
                        >
                          <pre
                            className="p-2.5 text-[10px] leading-relaxed sm:p-3 sm:text-[11px] md:text-xs"
                            style={{
                              color: "var(--text)",
                              whiteSpace: "pre-wrap",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              fontFamily: "monospace",
                              margin: 0,
                            }}
                          >
                            <code>{files[af]?.content}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* CONSOLE */}
              {view === "console" && (
                <div
                  className="w-full overflow-auto p-2.5 font-mono text-[10px] leading-relaxed sm:p-3 sm:text-[11px]"
                  style={{
                    background: "#0d0e0c",
                    color: "#a3e635",
                    maxHeight: "60vh",
                    minHeight: 250,
                    wordBreak: "break-all",
                    overflowWrap: "break-word",
                  }}
                >
                  {logs.map((l, i) => (
                    <div key={i} className="py-0.5">
                      <span style={{ color: "#6b7280" }}>[{String(i).padStart(3, "0")}]</span>{" "}
                      <span style={{
                        color: l.includes("[ERROR]") ? "#f87171" :
                               l.includes("[SUCCESS]") ? "#86efac" : "#a3e635"
                      }}>
                        {l}
                      </span>
                    </div>
                  ))}
                  {gen && (
                    <div className="mt-1 flex items-center gap-1.5" style={{ color: "#a3e635" }}>
                      <span className="inline-block h-2.5 w-2.5 animate-spin rounded-full border border-[#a3e635] border-t-transparent" />
                      Processing…
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* ── RIGHT: AI Chat ── */}
          <div className={`w-full min-w-0 ${view !== "chat" ? "hidden lg:block" : ""}`}>
            <Card
              className="flex w-full flex-col overflow-hidden"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
                height: "min(60vh, 500px)",
                minHeight: 300,
              }}
            >
              <CardHeader className="shrink-0 border-b pb-2 pt-2.5" style={{ borderColor: "var(--border)" }}>
                <CardTitle className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Sparkles /> AI Assistant
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <div
                className="w-full flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 sm:px-3"
                style={{ minHeight: 0 }}
              >
                <div className="flex w-full flex-col gap-2">
                  {chat.map((m, i) => (
                    <div
                      key={i}
                      className={`w-fit max-w-[85%] rounded-lg px-2.5 py-1.5 text-[11px] leading-relaxed sm:text-xs ${
                        m.role === "user" ? "self-end" : "self-start"
                      }`}
                      style={{
                        background: m.role === "user" ? "var(--accent)" : "var(--bg)",
                        color: m.role === "user" ? "#171815" : "var(--text)",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {m.content}
                    </div>
                  ))}
                  <div ref={ce} />
                </div>
              </div>

              {/* Input */}
              <div className="shrink-0 border-t p-2" style={{ borderColor: "var(--border)" }}>
                <div className="flex w-full gap-1.5">
                  <Input
                    placeholder="Ask anything…"
                    value={ci}
                    onChange={e => setCi(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") send(); }}
                    className="h-8 min-w-0 flex-1 text-[11px] sm:text-xs"
                    style={{ background: "var(--bg)", borderColor: "var(--border)", color: "var(--text)" }}
                  />
                  <Button
                    size="icon"
                    onClick={send}
                    disabled={!ci.trim()}
                    className="h-8 w-8 shrink-0"
                    style={{ background: "var(--accent)", color: "#171815" }}
                  >
                    <Send />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
