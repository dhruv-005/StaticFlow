import { Code2, Shield, Globe, Users, Zap, Rocket } from "lucide-react";

const values = [
  { icon: Zap, title: "Speed First", desc: "APIs generated in minutes, not weeks." },
  { icon: Shield, title: "Security by Default", desc: "OWASP Top 10 hardened out of the box." },
  { icon: Globe, title: "Open & Accessible", desc: "Built on open-source tools. No vendor lock-in." },
  { icon: Users, title: "Developer Experience", desc: "Every feature reduces friction." },
  { icon: Code2, title: "Production Quality", desc: "Not prototypes — production-ready code." },
  { icon: Rocket, title: "Ship Faster", desc: "Idea to deployed API in 15 minutes." },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="catalyst-section pt-32">
        <div className="catalyst-container-narrow text-center">
          <span className="catalyst-badge mb-6 inline-flex">Our Mission</span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: "var(--text)" }}>
            API development is <span style={{ color: "var(--text-muted)" }}>broken.</span>
          </h1>
          <p className="mt-6 text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Developers spend 60% of their time on boilerplate. StaticFlow fixes that.
          </p>
        </div>
      </section>

      <section className="catalyst-section" style={{ backgroundColor: "var(--surface-muted)" }}>
        <div className="catalyst-container">
          <h2 className="mb-12 text-center text-2xl font-bold" style={{ color: "var(--text)" }}>Core Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="catalyst-card p-6" style={{ backgroundColor: "var(--surface)" }}>
                  <Icon className="mb-3 h-5 w-5" style={{ color: "var(--text-muted)" }} />
                  <h3 className="mb-2 text-base font-semibold" style={{ color: "var(--text)" }}>{v.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="catalyst-section">
        <div className="catalyst-container-narrow">
          <div className="catalyst-card p-10">
            <div className="grid gap-8 sm:grid-cols-3 text-center">
              <div><p className="text-4xl font-bold" style={{ color: "var(--text)" }}>99.5%</p><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Time Saved</p></div>
              <div><p className="text-4xl font-bold" style={{ color: "var(--text)" }}>10+</p><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Tools Replaced</p></div>
              <div><p className="text-4xl font-bold" style={{ color: "var(--text)" }}>Free</p><p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>To Start</p></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
