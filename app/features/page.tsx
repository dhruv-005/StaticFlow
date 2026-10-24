import Link from "next/link";
import { Zap, ArrowLeft, Code2, Database, Shield, Globe, BarChart3, Key, GitBranch, TestTube, FileJson } from "lucide-react";

const features = [
  { icon: Code2, title: "Visual API Builder", desc: "Design endpoints with a drag-and-drop interface. Define schemas, methods, and responses visually.", tag: "Core" },
  { icon: Database, title: "Auto Mock Data", desc: "Generate realistic test data automatically. Supports names, emails, dates, and custom patterns.", tag: "Data" },
  { icon: Shield, title: "Auth & API Keys", desc: "Built-in authentication with role-based access control. Manage API keys from the dashboard.", tag: "Security" },
  { icon: Globe, title: "Instant Deploy", desc: "One-click deployment to a live URL with HTTPS. No server setup required.", tag: "Deploy" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track requests, latency, error rates, and usage patterns in real-time.", tag: "Monitor" },
  { icon: Key, title: "Rate Limiting", desc: "Configure per-key and per-endpoint rate limits to protect your API.", tag: "Security" },
  { icon: GitBranch, title: "Version Control", desc: "Roll back to previous API versions. Compare changes side by side.", tag: "DevOps" },
  { icon: TestTube, title: "API Tester", desc: "Built-in request tester with headers, body, and auth configuration.", tag: "Testing" },
  { icon: FileJson, title: "Auto Documentation", desc: "OpenAPI/Swagger docs generated automatically for every endpoint.", tag: "Docs" },
  { icon: Zap, title: "AI Generation", desc: "Describe your API in plain English and let AI build the entire schema.", tag: "AI" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-noir-950 text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-noir-800/50 bg-noir-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-crimson flex items-center justify-center"><Zap className="w-5 h-5 text-white" /></div>
            <span className="font-display font-bold text-xl">StaticFlow</span>
          </Link>
          <Link href="/" className="btn-ghost btn-sm gap-2"><ArrowLeft className="w-4 h-4" /> Home</Link>
        </div>
      </header>
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">Powerful <span className="text-gradient">Features</span></h1>
            <p className="text-xl text-noir-400 max-w-2xl mx-auto">Everything you need to build, test, and deploy production-ready APIs.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 group">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-crimson/10 flex items-center justify-center group-hover:bg-crimson/20 transition-colors">
                    <f.icon className="w-6 h-6 text-crimson" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-noir-800 text-noir-400 border border-noir-700">{f.tag}</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-noir-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
