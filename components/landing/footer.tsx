import Link from "next/link";
import { CatalystLogo } from "@/components/shared/catalyst-logo";

const cols = {
  Product: [{ href: "/features", label: "Features" }, { href: "/demo", label: "Demo" }, { href: "/blog", label: "Blog" }, { href: "/about", label: "About" }],
  Resources: [{ href: "/docs", label: "Documentation" }, { href: "/api-reference", label: "API Reference" }, { href: "/templates", label: "Templates" }, { href: "/status", label: "Status" }],
  Company: [{ href: "/about", label: "About" }, { href: "/careers", label: "Careers" }, { href: "/contact", label: "Contact" }],
  Legal: [{ href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }, { href: "/security", label: "Security" }],
};

export function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}>
      <div className="catalyst-container py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <CatalystLogo href="/home" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              The AI-powered API builder, security scanner, and multi-cloud deployer.
            </p>
          </div>
          {Object.entries(cols).map(([title, items]) => (
            <div key={title}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{title}</h3>
              <ul className="space-y-3">
                {items.map((l) => (
                  <li key={l.href}><Link href={l.href} className="text-sm transition-colors hover:opacity-70" style={{ color: "var(--text-muted)" }}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>&copy; {new Date().getFullYear()} StaticFlow. All rights reserved.</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Built with precision.</p>
        </div>
      </div>
    </footer>
  );
}
