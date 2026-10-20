import { Code2, Shield, Activity, FileText, Key, Rocket } from "lucide-react";

const features = [
  { icon: Code2, title: "AI Code Generation", desc: "Describe your API in plain language. Receive production-ready code with authentication, validation, and error handling.", highlight: true },
  { icon: Shield, title: "Security Auditing", desc: "Automated OWASP Top 10 scanning on every generated API. SQL injection, XSS, and JWT vulnerabilities caught before deploy.", highlight: false },
  { icon: Activity, title: "Performance Testing", desc: "Load, stress, and spike testing with AI-powered bottleneck detection. Identify latency issues before production.", highlight: false },
  { icon: FileText, title: "Auto Documentation", desc: "OpenAPI 3.1 specifications, Postman collections, and client SDKs generated and kept in sync with your codebase.", highlight: false },
  { icon: Key, title: "Key Management", desc: "Encrypted secret vault with automated key rotation, IP whitelisting, and granular permission scoping.", highlight: false },
  { icon: Rocket, title: "Multi-Cloud Deploy", desc: "One-click deployment to Vercel, Render, Fly.io, or AWS. SSL, custom domains, and auto-scaling configured.", highlight: true },
];

export function FeaturesGrid() {
  return (
    <section className="catalyst-section">
      <div className="catalyst-container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="catalyst-badge mb-4 inline-flex">Platform Capabilities</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>
            Everything your team needs, <span style={{ color: "var(--text-muted)" }}>in one platform.</span>
          </h2>
          <p className="mt-4 text-base" style={{ color: "var(--text-muted)" }}>
            Replace fragmented toolchains with a unified API lifecycle platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="catalyst-card p-6 sm:p-8">
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: f.highlight ? "var(--accent)" : "var(--surface-muted)",
                    color: f.highlight ? "var(--accent-text)" : "var(--text-muted)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--text)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
