import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CatalystCTA() {
  return (
    <section className="catalyst-section">
      <div className="catalyst-container">
        <div className="relative overflow-hidden rounded-3xl p-10 text-center sm:p-16 lg:p-20" style={{ backgroundColor: "var(--text)" }}>
          <div className="pointer-events-none absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle at 25% 25%, var(--accent) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--accent) 0%, transparent 50%)" }} />

          <div className="relative z-10">
            <span className="catalyst-badge mb-6 inline-flex" style={{ backgroundColor: "rgba(223,255,0,0.1)", borderColor: "rgba(223,255,0,0.2)", color: "var(--accent)" }}>
              Get Started Today
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: "var(--bg)" }}>
              Ready to ship APIs <span style={{ color: "var(--accent)" }}>10x faster?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base" style={{ color: "var(--text-muted)" }}>
              Join thousands of engineering teams who stopped writing boilerplate and started delivering production APIs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register" className="catalyst-btn-primary text-base">Start Free Trial <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/demo" className="catalyst-btn-ghost text-base" style={{ color: "var(--bg)" }}>View live demo</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
