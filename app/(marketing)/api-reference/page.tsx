export const metadata = {
  title: "API Reference — StaticFlow",
  description: "Complete API reference for StaticFlow endpoints.",
};

export default function ApiReferencePage() {
  const endpoints = [
    { method: "POST", path: "/api/generate", desc: "Generate API code from a prompt" },
    { method: "POST", path: "/api/test", desc: "Test any HTTP endpoint" },
    { method: "GET",  path: "/api/projects", desc: "List all your projects" },
    { method: "POST", path: "/api/projects", desc: "Create a new project" },
    { method: "GET",  path: "/api/keys", desc: "List your API keys" },
    { method: "POST", path: "/api/keys", desc: "Generate a new API key" },
    { method: "GET",  path: "/api/dashboard/stats", desc: "Get dashboard statistics" },
    { method: "GET",  path: "/api/notifications", desc: "Fetch user notifications" },
    { method: "GET",  path: "/api/health", desc: "Check system health" },
  ];

  return (
    <main className="min-h-screen px-4 py-16 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">API Reference</h1>
      <p className="text-neutral-500 mb-10">
        All StaticFlow endpoints. Use your API key in the <code className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">Authorization: Bearer &lt;key&gt;</code> header.
      </p>

      <div className="space-y-3">
        {endpoints.map((ep) => (
          <div
            key={ep.path}
            className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-[#DFFF00] transition"
          >
            <span
              className={`px-2.5 py-1 text-xs font-mono font-bold rounded ${
                ep.method === "GET"
                  ? "bg-blue-500/10 text-blue-500"
                  : "bg-green-500/10 text-green-500"
              }`}
            >
              {ep.method}
            </span>
            <code className="font-mono text-sm flex-1">{ep.path}</code>
            <span className="text-sm text-neutral-500 hidden sm:block">{ep.desc}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
