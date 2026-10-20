const metrics = [
  { value: "10,000+", label: "APIs Generated" },
  { value: "99.98%", label: "Platform Uptime" },
  { value: "50+", label: "Frameworks Supported" },
  { value: "< 15 min", label: "Avg Deploy Time" },
];

export function TrustBar() {
  return (
    <section className="border-y" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
      <div className="catalyst-container grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 lg:gap-12">
        {metrics.map((m) => (
          <div key={m.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--text)" }}>{m.value}</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
