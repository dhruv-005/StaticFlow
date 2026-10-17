import { Code2, Shield, Activity, FileText, Key, Rocket, Monitor, Bot, Mic, Copy, MessageSquare, ShoppingCart, Users, Scale, Server, GitBranch, Layers, Database } from "lucide-react";

const cats = [
  { title: "Core Platform", features: [
    { icon: Bot, name: "AI API Generation", desc: "Describe your API in plain language. Get production-ready code." },
    { icon: Shield, name: "Security Testing", desc: "OWASP Top 10 scanning with AI vulnerability detection." },
    { icon: Activity, name: "Performance Testing", desc: "Load, stress, spike testing with bottleneck analysis." },
    { icon: FileText, name: "Auto Documentation", desc: "OpenAPI specs, Postman collections, SDKs." },
    { icon: Key, name: "Key Management", desc: "Secure vault with auto-rotation and IP whitelisting." },
    { icon: Rocket, name: "One-Click Deploy", desc: "Deploy to Vercel, Render, Fly.io, or any cloud." },
    { icon: Monitor, name: "Real-Time Monitoring", desc: "Uptime, latency, error rates, anomaly detection." },
  ]},
  { title: "Advanced AI", features: [
    { icon: Bot, name: "AI API Doctor", desc: "Paste existing code. AI finds bugs and optimizes." },
    { icon: Mic, name: "Voice-to-API", desc: "Speak your requirements. AI builds your API." },
    { icon: Copy, name: "API Cloner", desc: "Clone any public API structure with improvements." },
    { icon: MessageSquare, name: "NL Testing", desc: "Write tests in plain English." },
  ]},
  { title: "Ecosystem", features: [
    { icon: ShoppingCart, name: "Marketplace", desc: "50+ pre-built API templates." },
    { icon: Users, name: "Team Collaboration", desc: "Real-time editing and code reviews." },
    { icon: Scale, name: "Compliance", desc: "GDPR, HIPAA, PCI-DSS, SOC 2." },
    { icon: Server, name: "Mock Server", desc: "Instant mock APIs for frontend teams." },
    { icon: GitBranch, name: "Versioning", desc: "Auto-versioning and migration guides." },
    { icon: Layers, name: "Composition", desc: "Combine multiple APIs into one gateway." },
    { icon: Database, name: "GraphQL", desc: "Generate GraphQL APIs with resolvers." },
  ]},
];

export default function FeaturesPage() {
  return (
    <div className="flex flex-col">
      <section className="catalyst-section pt-32">
        <div className="catalyst-container-narrow text-center">
          <span className="catalyst-badge mb-6 inline-flex">24+ Features</span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--text)" }}>
            Everything you need, <span style={{ color: "var(--text-muted)" }}>one platform.</span>
          </h1>
        </div>
      </section>

      {cats.map((cat) => (
        <section key={cat.title} className="catalyst-section-sm">
          <div className="catalyst-container">
            <h2 className="mb-8 text-xl font-semibold" style={{ color: "var(--text)" }}>{cat.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cat.features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.name} className="catalyst-card p-5">
                    <Icon className="mb-3 h-5 w-5" style={{ color: "var(--text-muted)" }} />
                    <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--text)" }}>{f.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
