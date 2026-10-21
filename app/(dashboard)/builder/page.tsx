"use client";

import { useState, useRef, useEffect, useCallback } from "react";

/* ── types ── */
interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

interface Credentials {
  url: string;
  apiKey: string;
  projectId: string;
}

interface TestResult {
  status: number;
  ok: boolean;
  body: string;
  ms: number;
}

type Tab = "build" | "code" | "test";

/* ── helpers ── */
function copyText(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/* ── component ── */
export default function BuilderPage() {
  /* prompt + generation */
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState("");

  /* outputs */
  const [code, setCode] = useState("");
  const [creds, setCreds] = useState<Credentials | null>(null);
  const [credsOpen, setCredsOpen] = useState(false);

  /* chat */
  const [chat, setChat] = useState<ChatMsg[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  /* quick test */
  const [testMethod, setTestMethod] = useState("GET");
  const [testPath, setTestPath] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);

  /* mobile tab */
  const [tab, setTab] = useState<Tab>("build");
  const hasAutoSwitchedRef = useRef(false);

  /* copied feedback */
  const [copied, setCopied] = useState<string | null>(null);

  /* ── smooth, non-jarring chat scroll (uses rAF + nearest) ── */
  useEffect(() => {
    const el = chatScrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [chat, generating]);

  /* ── auto-switch to code tab ONCE per generation (mobile only) ── */
  useEffect(() => {
    if (!code) {
      hasAutoSwitchedRef.current = false;
      return;
    }
    if (hasAutoSwitchedRef.current) return;
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) {
      setTab("code");
      hasAutoSwitchedRef.current = true;
    }
  }, [code]);

  /* ── restore focus to prompt after generation finishes ── */
  useEffect(() => {
    if (!generating && typeof window !== "undefined" && window.innerWidth >= 1024) {
      promptRef.current?.focus();
    }
  }, [generating]);

  /* ── generate ── */
  const handleGenerate = useCallback(async () => {
    const p = prompt.trim();
    if (!p || generating) return;

    setGenError("");
    setGenerating(true);
    setChat((prev) => [...prev, { role: "user", content: p, ts: Date.now() }]);
    setPrompt("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: p }),
      });

      const data = await res.json().catch(() => ({ error: "Invalid server response" }));

      if (!res.ok) {
        throw new Error(data.error || `Request failed (${res.status})`);
      }

      setCode(data.code || "");
      if (data.endpoint && data.apiKey) {
        setCreds({
          url: data.endpoint,
          apiKey: data.apiKey,
          projectId: data.projectId || "",
        });
        setCredsOpen(true);
        setTestPath(data.endpoint);
      }

      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message || "✅ API generated successfully! Check the Code tab.",
          ts: Date.now(),
        },
      ]);
    } catch (err: any) {
      const msg = err?.message || "Something went wrong.";
      setGenError(msg);
      setChat((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `❌ ${msg}`,
          ts: Date.now(),
        },
      ]);
    } finally {
      setGenerating(false);
    }
  }, [prompt, generating]);

  /* ── keyboard: Enter sends, Shift+Enter newline ── */
  const handlePromptKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  /* ── quick test ── */
  const handleTest = async () => {
    if (!testPath.trim() || testLoading) return;
    setTestLoading(true);
    setTestResult(null);

    const start = performance.now();
    try {
      const headers: Record<string, string> = {};
      if (creds?.apiKey) headers["x-api-key"] = creds.apiKey;

      const res = await fetch(testPath.trim(), {
        method: testMethod,
        headers,
      });

      const ms = Math.round(performance.now() - start);
      let body = "";
      try {
        const json = await res.json();
        body = JSON.stringify(json, null, 2);
      } catch {
        body = await res.text();
      }

      setTestResult({ status: res.status, ok: res.ok, body, ms });
    } catch (err: any) {
      setTestResult({
        status: 0,
        ok: false,
        body: err?.message || "Network error",
        ms: 0,
      });
    } finally {
      setTestLoading(false);
    }
  };

  /* ── copy with feedback ── */
  const handleCopy = (text: string, label: string) => {
    copyText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  /* ── prompt suggestions ── */
  const suggestions = [
    "Student records API with 20 entries",
    "Product catalog with 50 items and categories",
    "Employee directory with departments",
    "Blog posts with authors and comments",
  ];

  return (
    <div className="space-y-4 lg:space-y-6 pb-4">
      {/* Header */}
      <header>
        <h1 className="text-[clamp(1.3rem,3vw,1.75rem)] font-bold text-[var(--text)]">
          AI Builder
        </h1>
        <p className="text-sm text-[var(--muted)] mt-0.5">
          Describe your API and get a live endpoint in seconds
        </p>
      </header>

      {/* ── Prompt Input (always visible) ── */}
      <section className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="space-y-3"
        >
          <textarea
            ref={promptRef}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handlePromptKey}
            placeholder="Describe the API you want to build… e.g. 'Create a REST API for a bookstore with 100 books including title, author, genre, price, and ISBN'"
            rows={3}
            disabled={generating}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors resize-none disabled:opacity-60"
            style={{ fontSize: "16px" }}
          />

          {/* Suggestions — horizontal scroll on mobile, prevents layout shift */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setPrompt(s);
                  promptRef.current?.focus();
                }}
                disabled={generating}
                className="shrink-0 text-[11px] sm:text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)]/40 transition-colors disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="submit"
              disabled={generating || !prompt.trim()}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                  Generate API
                </>
              )}
            </button>
            <span className="text-[11px] text-[var(--muted)]">
              Press <kbd className="px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--bg)] text-[10px]">Enter</kbd> to send
            </span>
            {genError && (
              <span className="text-xs text-red-400 break-words flex-1 min-w-0 basis-full sm:basis-auto">
                {genError}
              </span>
            )}
          </div>
        </form>
      </section>

      {/* ── Credentials Banner — NO height animation (prevents jump), uses opacity+scale ── */}
      {creds && credsOpen && (
        <section
          className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4 sm:p-5 space-y-3 animate-fade-in"
          style={{
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[var(--accent)] flex items-center gap-2 min-w-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="truncate">Live API Credentials</span>
            </h3>
            <button
              onClick={() => setCredsOpen(false)}
              className="shrink-0 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              Hide
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* URL */}
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                Endpoint URL
              </p>
              <div className="flex items-center gap-2 min-w-0">
                <code className="flex-1 text-xs sm:text-sm text-[var(--accent)] font-mono bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 truncate min-w-0">
                  {creds.url}
                </code>
                <button
                  onClick={() => handleCopy(creds.url, "url")}
                  className="shrink-0 p-2 rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
                  aria-label="Copy URL"
                >
                  {copied === "url" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] mb-1">
                API Key
              </p>
              <div className="flex items-center gap-2 min-w-0">
                <code className="flex-1 text-xs sm:text-sm text-purple-400 font-mono bg-[var(--bg)] border border-[var(--border)] rounded-md px-3 py-2 truncate min-w-0">
                  {creds.apiKey}
                </code>
                <button
                  onClick={() => handleCopy(creds.apiKey, "key")}
                  className="shrink-0 p-2 rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/50 transition-colors"
                  aria-label="Copy API Key"
                >
                  {copied === "key" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Show reopen button when credentials exist but hidden */}
      {creds && !credsOpen && (
        <button
          onClick={() => setCredsOpen(true)}
          className="text-xs text-[var(--accent)] hover:underline"
        >
          Show credentials
        </button>
      )}

      {/* ── Mobile Tabs ── */}
      <div className="lg:hidden flex gap-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] p-1 sticky top-2 z-10">
        {(["build", "code", "test"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors capitalize ${
              tab === t
                ? "bg-[var(--accent)] text-[var(--bg)]"
                : "text-[var(--muted)] hover:text-[var(--text)]"
            }`}
          >
            {t}
            {t === "code" && code && tab !== "code" && (
              <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
            )}
          </button>
        ))}
      </div>

      {/* ── Main Content Grid — FIXED heights prevent jumping ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* ── LEFT COLUMN ── */}
        <div
          className={`space-y-4 ${
            tab !== "build" && tab !== "test" ? "hidden lg:block" : ""
          }`}
        >
          {/* Chat History */}
          <div
            className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col ${
              tab === "test" ? "hidden lg:flex" : "flex"
            }`}
            style={{ height: "clamp(300px, 50vh, 500px)" }}
          >
            <div className="px-4 py-3 border-b border-[var(--border)] shrink-0 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--text)]">
                Chat History
              </h2>
              {chat.length > 0 && (
                <button
                  onClick={() => setChat([])}
                  className="text-[11px] text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div
              ref={chatScrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar"
            >
              {chat.length === 0 && !generating && (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-3">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                  </div>
                  <p className="text-sm text-[var(--muted)]">
                    Start by describing the API you want to build
                  </p>
                </div>
              )}
              {chat.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] w-fit rounded-xl px-3.5 py-2.5 text-sm break-words ${
                      msg.role === "user"
                        ? "bg-[var(--accent)] text-[var(--bg)] rounded-br-sm"
                        : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] rounded-bl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        msg.role === "user"
                          ? "text-[var(--bg)]/60"
                          : "text-[var(--muted)]"
                      }`}
                    >
                      {timeAgo(msg.ts)}
                    </p>
                  </div>
                </div>
              ))}
              {generating && (
                <div className="flex justify-start">
                  <div className="bg-[var(--bg)] border border-[var(--border)] rounded-xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Test */}
          <div
            className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] ${
              tab === "build" ? "hidden lg:block" : "block"
            }`}
          >
            <div className="px-4 py-3 border-b border-[var(--border)]">
              <h2 className="text-sm font-semibold text-[var(--text)]">
                Quick Test
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <select
                  value={testMethod}
                  onChange={(e) => setTestMethod(e.target.value)}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm font-mono font-bold text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 shrink-0"
                  style={{ fontSize: "16px" }}
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <input
                  type="text"
                  value={testPath}
                  onChange={(e) => setTestPath(e.target.value)}
                  placeholder="https://api.example.com/data"
                  className="flex-1 min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2.5 text-sm font-mono text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)] transition-colors"
                  style={{ fontSize: "16px" }}
                />
                <button
                  onClick={handleTest}
                  disabled={testLoading || !testPath.trim()}
                  className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--bg)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 shrink-0"
                >
                  {testLoading ? "…" : "Send"}
                </button>
              </div>

              {/* Reserved slot for result — min-height prevents layout jump */}
              <div className="min-h-[80px]">
                {testResult && (
                  <div className="rounded-lg border border-[var(--border)] bg-[var(--bg)] overflow-hidden">
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-[var(--border)]">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          testResult.ok
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {testResult.status || "ERR"}
                      </span>
                      <span className="text-xs text-[var(--muted)]">
                        {testResult.ms}ms
                      </span>
                      <button
                        onClick={() => handleCopy(testResult.body, "response")}
                        className="ml-auto text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                      >
                        {copied === "response" ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre className="p-3 text-xs sm:text-sm font-mono text-[var(--text)] overflow-x-auto max-h-64 overflow-y-auto no-scrollbar">
                      <code className="break-all whitespace-pre-wrap">
                        {testResult.body}
                      </code>
                    </pre>
                  </div>
                )}

                {!creds && !testResult && (
                  <p className="text-xs text-[var(--muted)] text-center py-6">
                    Generate an API first, then test it here
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Code Preview — ALWAYS fixed height ── */}
        <div
          className={`rounded-xl border border-[var(--border)] bg-[var(--surface)] flex flex-col ${
            tab !== "code" ? "hidden lg:flex" : "flex"
          }`}
          style={{ height: "clamp(400px, 70vh, 700px)" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
            <h2 className="text-sm font-semibold text-[var(--text)]">
              Generated Code
            </h2>
            {code && !generating && (
              <button
                onClick={() => handleCopy(code, "code")}
                className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors flex items-center gap-1"
              >
                {copied === "code" ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 overflow-auto no-scrollbar p-4">
            {generating && !code ? (
              /* Skeleton loader while generating — no more empty jarring state */
              <div className="space-y-2">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="h-3 rounded bg-[var(--border)]/60 animate-pulse"
                    style={{
                      width: `${35 + ((i * 13) % 55)}%`,
                      animationDelay: `${i * 70}ms`,
                    }}
                  />
                ))}
              </div>
            ) : code ? (
              <pre className="text-xs sm:text-sm font-mono text-[var(--text)] leading-relaxed">
                <code className="break-all whitespace-pre-wrap">{code}</code>
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-12 h-12 rounded-full bg-[var(--border)]/50 flex items-center justify-center mb-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </div>
                <p className="text-sm text-[var(--muted)]">
                  Generated code will appear here
                </p>
                <p className="text-xs text-[var(--muted)] mt-1">
                  Use the prompt above to build your API
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline keyframes — scoped, prevents extra CSS file */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
