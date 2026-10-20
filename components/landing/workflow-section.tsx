import { MessageSquare, Cpu, ShieldCheck, Rocket } from "lucide-react";

const steps = [
  { num: "01", icon: MessageSquare, title: "Describe Your Requirements", desc: "Provide a natural language description of the API you need. Our AI asks clarifying questions." },
  { num: "02", icon: Cpu, title: "AI Generates the Codebase", desc: "Endpoints, database schemas, authentication, validation, and Docker config — all in minutes." },
  { num: "03", icon: ShieldCheck, title: "Automated Security & Testing", desc: "OWASP Top 10 scans, performance benchmarks, and load tests run automatically." },
  { num: "04", icon: Rocket, title: "Deploy to Production", desc: "One-click deployment with SSL, custom domains, monitoring, and auto-scaling." },
];

export function WorkflowSection() {
  return (
    <section className="catalyst-section" style={{ backgroundColor: "var(--surface-muted)" }}>
      <div className="catalyst-container">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="catalyst-badge mb-4 inline-flex">How It Works</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>
            From prompt to production <span style={{ color: "var(--text-muted)" }}>in four steps.</span>
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="catalyst-card p-6" style={{ backgroundColor: "var(--surface)" }}>
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold" style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}>{s.num}</span>
                  <Icon className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
                </div>
                <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--text)" }}>{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
